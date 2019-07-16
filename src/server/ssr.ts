import { IncomingMessage, ServerResponse } from 'http'
import Koa from 'koa'
import next from 'next'

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

    app.context.handle = async function(req: IncomingMessage, res: ServerResponse) {
        await handle(req, res)
    }
    return app
}
