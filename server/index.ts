import koa from 'koa'
import router from './routers'

const port = parseInt(process.env.PORT || '3000', 10)

new koa()
  .use(router.middleware())
  .use(router.allowedMethods())
  .listen(port)

// tslint:disable-next-line:no-console
console.log(
  `> Server listening at http://localhost:${port}`,
)
