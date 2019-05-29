import path from 'path'
import Koa from 'koa'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import statics from 'koa-static'
import router from './router'
import setupSSR from './ssr'

export default async function createApp(): Promise<Koa> {
    // const app = new Koa()

    const app = await setupSSR(new Koa())
    // const app = new (require('koa'))()
    app.use(logger())
    app.use(bodyParser())
    app.use(statics(path.join(__dirname, '..', 'static')))

    app.use(router.routes())

    app.use(async (ctx, next) => {
        console.log(ctx.body)
        try {
            await next()
        } catch (e) {
            console.error(e)
        }
    })
    return app
}
