---
title: RecyclerView 当中 item 无法 match 解决方案
date: 2015-12-29 08:12:47
tags:
---

# 方案

直接上解决方案, 后面作解释
在`Adapter`当中进行`inflat`的时候为view添加`parent view`
如下
```Java
pulic class MyAdapter extend RecyclerView.Adapter<MyAdapter.ViewHolder> {
    private Context mContext;
    private List<String> mDates;
    private RecyclerView mParent;

    .....

    public MyAdapter(Context context, List<String> data, RecyclerView parent) {
        mContext = context;
        mDates = dates;
        mParent = parent;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(mContext).inflate(R.layout.item, mParent, false);
        ViewHolder viewHolder = new ViewHolder(view);
        return viewHolder;
    }
    
    ......
}
```
## 解释
这段代码当中的关键语句是
```Java
View view = LayoutInflater.from(mContext).inflate(R.layout.item, mParent, false);
```
添加`parent`参数是为让`inflater`获取所需的`layoutparams`, 从而保证item符合父容器的布局
最后一个参数是`attachToRoot`是不让item成为父容器的root