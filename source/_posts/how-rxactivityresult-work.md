---
title: RxActivityResult 原理浅析
date: 2016-11-16 08:12:47
tags:
---

> 因为刚学RxJava不久, 一直在使用一些基于RxJava的第三方扩展库, 觉得非常神奇, 特别是一些库能够直接代理Activity进行数据处理, 但是因为懒, 一直也没了解其中的原理.
>
> 不过最近使用[RxActivityResult](https://github.com/VictorAlbertos/RxActivityResult), 发现有些小地方用得不是特别顺心, 提了issues, 作者也没给个满意的答复, 索性fork了一遍, clone下来试着自己改一下, 顺便读一遍源码.

<!--more-->

先声明一下, 以下内容仅仅包含RxActivityResult 的基本原理与被我精简过的源码, 具体内容可以自己去[RxActivityResult](https://github.com/VictorAlbertos/RxActivityResult)中看源码.

# 使用方法

先提一下RxActivityResult 的基本使用方法, 方便在稍后分析中验证

```java
RxActivityResult.on(mActivityA)
        .startIntent(new Intent(mActivityA, ActivityB.class)
                .addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION) /*移除Activity启动时的动画*/)
        .subscribe(new Action1<Result>() {
            @Override
            public void call(Result result) {
                if (result.getData() != null) {
                    result.data().getIntExtra("key", 0);
                }
            }
        });
```

简简单单的一步就实现的startActivityForResult() 的整个流程

# 流程与原理

RxActivityResult 通过启动一个代理Activity--`HolderActivity`来作为两个Activity 之间数据交互的桥梁, 先在Activity A告诉RxActivityResult 所需要启动的目标Activity, 然后RxActivityResult 代为启动HolderActivity, HolderActivity 启动Activity B, 然后接受Activity B 传回的result, 然后通过回调方法

![img](https://imgur.com/bgjf1M1.png)

# 源码分析

先放上三个基础的类, 会在后面被多次使用到

```java
/*
 * 最终返回给调用者的结果
 */
class Result<T> {
    T mActivity;
    int mResultCode;
    Intent mData;
}

/*
 * 提供给HolderActivity 在获取到数据后来调用的接口
 */
interface OnResult {
    void response(int resultCode, @Nullable Intent data);
}

/*
 * 打包了启动B Activity 的intent 和回调接口的类
 * 到时候会中启动HolderActivity 之前保存到HolderActivity 当中
 */
class Request {
    Intent mIntent;
    OnResult mOnResult;
}
```



```java
public class RxActivityResult {
  	// ActivitiesLifecycleCallbacks 和整个流程关系不大, 用处就是注册中application 中,
    // 来获得当前应用的最顶层 Activity, 感兴趣的可以在后面看到
    private static ActivitiesLifecycleCallbacks mActivitiesLifecycleCallbacks;

    public static void register(final Application application) {
        mActivitiesLifecycleCallbacks = new ActivitiesLifecycleCallbacks(application);
    }

    // 获取一个RxActivityResult的Builder
    public static <T extends Activity> Builder<T> on(T activity) {
        return new Builder<>(activity);
    }

    // RxActivityResult核心
    public static class Builder<T extends Activity> {
        final Class mClass;
        // 一个Subject, 用于提供给外界订阅
        final PublishSubject<Result<T>> mSubject = PublishSubject.create();

        public Builder(T activity) {
            if (mActivitiesLifecycleCallbacks == null) {
                throw new IllegalStateException("not registered");
            }

            mClass = activity.getClass();
        }

        // 提供给外界来启动intent, 本质上是将intent 打包在Request 当中,
        // 启动HolderActivity 并将Request 提供给HolderActivity
        public Observable<Result<T>> startIntent(Intent intent) {
            return startHolderActivity(new Request(intent));
        }

        private Observable<Result<T>> startHolderActivity(Request request) {
            request.setOnResult(mOnResultActivity);
            HolderActivity.setRequest(request);
            mActivitiesLifecycleCallbacks.getLiveActivity() // 获取当前应用顶层的Activity
                .subscribe(new Action1<Activity>() {
                    @Override
                    public void call(Activity activity) {
                        activity.startActivity(new Intent(activity, HolderActivity.class)
                                .addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION));
                    }
                });

            return mSubject.asObservable();
        }

        // 一个回调接口, 当HolderActivity 接受到数据后会调用这个接口
        private OnResult mOnResultActivity = new OnResult() {
            @Override
            public void response(int resultCode, @Nullable Intent data) {
                if (mActivitiesLifecycleCallbacks.getLiveActivityOrNull() == null
                        || mActivitiesLifecycleCallbacks.getLiveActivityOrNull()
                        .getClass() != mClass) {
                    return;
                }
                Activity activity = mActivitiesLifecycleCallbacks.getLiveActivityOrNull();
                // 通知subject 的订阅者, 将Activity Result 传递过去
                mSubject.onNext(new Result<>((T) activity, resultCode, data));
                // subject 的使命已完成, 同时这一次RxActivityResult 的流程结束
                mSubject.onCompleted();
            }
        };
    }
}
```



```java
/*
 * HolderActivity, 作为中间的桥梁来传递数据
 */
public class HolderActivity extends Activity {
    private static Request mRequest;

    // 被 A Activity调用, 用于存储回调
    public static void setRequest(Request request) {
        mRequest = request;
    }

    private int mResultCode;
    private Intent mData;
    private OnResult mOnResult;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 验证回调是否存在
        if (mRequest == null) {
            finish();
            return;
        }

        mOnResult = mRequest.getOnResult();

        // 确保是第一次打开, 防止B Activity被多次打开
        if (savedInstanceState != null) {
            return;
        }

        // 打开B Activity
        startActivityForResult(mRequest.getIntent(), 0);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        // 接收到结果, 直接关闭这个界面
        mResultCode = resultCode;
        mData = data;
        finish();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        // 在被结束前执行回调方法
        if (mOnResult != null) {
            mOnResult.response(mResultCode, mData);
        }
    }
}
```

```java
public class ActivitiesLifecycleCallbacks {
    final Application mApplication;
    volatile Activity mLiveActivityOrNull;
    Application.ActivityLifecycleCallbacks mActivityLifecycleCallbacks;

    public ActivitiesLifecycleCallbacks(Application application) {
        mApplication = application;
        registerActivityLiftcycle();
    }

    private void registerActivityLiftcycle() {
        if (mActivityLifecycleCallbacks != null) {
            mApplication.unregisterActivityLifecycleCallbacks(mActivityLifecycleCallbacks);
        }
        mActivityLifecycleCallbacks = new SimpleActivityLifecycleCallbacks() {
            @Override
            public void onActivityCreated(Activity activity, Bundle bundle) {
                mLiveActivityOrNull = activity;
            }

            @Override
            public void onActivityResumed(Activity activity) {
                mLiveActivityOrNull = activity;
            }

            @Override
            public void onActivityPaused(Activity activity) {
                mLiveActivityOrNull = null;
            }
        };

        mApplication.registerActivityLifecycleCallbacks(mActivityLifecycleCallbacks);
    }

    Activity getLiveActivityOrNull() {
        return mLiveActivityOrNull;
    }

    volatile boolean mEmitted = false;

    Observable<Activity> getLiveActivity() {
        mEmitted = false;
        return Observable.interval(50, 50, TimeUnit.MILLISECONDS)
                .map(new Func1<Long, Activity>() {
                    @Override
                    public Activity call(Long aLong) {
                        return mLiveActivityOrNull;
                    }
                })
                .takeWhile(new Func1<Activity, Boolean>() {
                    @Override
                    public Boolean call(Activity activity) {
                        boolean continueEmitting = !mEmitted;
                        mEmitted = activity != null;
                        return continueEmitting;
                    }
                })
                .filter(new Func1<Activity, Boolean>() {
                    @Override
                    public Boolean call(Activity activity) {
                        return activity != null;
                    }
                });
    }
}
```

# 结语

其实分析下来, 发现并没有特别深奥, 就是一开始理解的时候不是很容易理顺其中的逻辑.

类似的库还有[RxPermissions](https://github.com/tbruyelle/RxPermissions), 一个使用RxJava来简化Android 6.0+系统中权限申请的流程, 应该也是通过启动一个透明的中间Activity 并在这个Activity 中申请权限, 得到申请结果后, 然后通过回调告诉订阅者, 具体代码暂时不分析了, 可以去源码库中查看.