import Koa from 'koa'
import next from 'next'
import Router from 'koa-router'

export default async function setupSSR(app: Koa): Promise<Koa> {
    const nextEngine = next({ dev: true })
    const handle = nextEngine.getRequestHandler()
    await nextEngine.prepare()

    app.context.render = async function(path: string, props: any = {}, options?: any) {
        const html = await nextEngine.render(
            this.req,
            this.res,
            path,
            props,
            options,
        )
        this.body = html
        return html
    }

    const router = new Router()
    router.get('/_next/*', async ctx => {
        ctx.respond = false
        await handle(ctx.req, ctx.res)
    })
    // router.get('*', async (ctx, next) => {
    //     await next()
    //     await nextEngine.handleRequest(ctx.req, ctx.res)
    // })
    // app.use(router.routes)
    return app
}
