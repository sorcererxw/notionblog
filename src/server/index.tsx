import Koa from 'koa'
import helmet from 'koa-helmet'
import serve from 'koa-static'
import proxy from 'koa-proxies'
import router from './router'

function createServer() {
  const server = new Koa()

  server.use(helmet())
    .use(serve(process.env.RAZZLE_PUBLIC_DIR!))
    .use(proxy('/notion', {
      target: 'https://www.notion.so/api/v1',
      changeOrigin: true,
      rewrite: path => path.replace(/^\/notion/, ''),
      logs: true,
    }))
    .use(async (ctx, next) => {
      ctx.res.statusCode = 200
      await next()
    })
    .use(router.routes())
  return server
}

export default createServer()
