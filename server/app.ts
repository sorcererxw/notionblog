import Koa from 'koa'
import Router from 'koa-router'
import send from 'koa-send'
import next from 'next'
import nodeSchedule from 'node-schedule'
import koaBody from 'koa-body'
import { getPost, getPosts, getSignedFileUrls } from './provider'
import { ArticleMeta } from '../api/types'
import isBot from './middleware/isBot'

const port = parseInt(process.env.PORT || '3000', 10)
const env = process.env.NODE_ENV
const dev = env !== 'production'

const ROOT_URL = dev ? `http://localhost:${port}` : 'https://sorcererxw.com'

console.log(`dev: ${dev}`)

const app = next({ dev })
const handle = app.getRequestHandler()

let blogList: ArticleMeta[] = []

app
  .prepare()
  .then(async () => {
    const server = new Koa()
    const router = new Router()
    const apiRouter = new Router()

    router.get('/robots.txt', async ctx =>
      send(ctx, 'robots.txt', {
        root: __dirname + '/',
      }),
    )

    router.get('/sitemap.xml', async ctx => {
      ctx.set('Content-Type', 'application/xml')
      ctx.response.body = await getSiteMap()
    })

    router.get('/post/:name', isBot(), async ctx => {
      const { res, req } = ctx

      const getIdByName = (name: string): string | null => {
        for (const post of blogList) {
          if (post.name === name) {
            return post.id
          }
        }
        return null
      }
      const pageId = getIdByName(ctx.params.name) || ''
      if (pageId.length === 0) {
        res.statusCode = 404
        await app.render(req, res, '/_error')
      }
      await app.render(req, res, '/post', {
        ssr: ctx.state.isBot,
        pageId,
      })
      ctx.respond = false
    })

    // path: /api/**

    apiRouter.get('/blog', async ctx => {
      ctx.response.type = 'application/json'
      ctx.response.body = blogList
    })

    apiRouter.get('/blog/:id', async ctx => {
      const id = ctx.params.id
      const result = await getPost(id)

      ctx.response.type = 'application/json'
      ctx.response.body = result
    })

    apiRouter.post('/notion/getSignedFileUrls', koaBody(), async ctx => {
      const signedUrls = await getSignedFileUrls(ctx.request.body)
      ctx.response.type = 'application/json'
      ctx.response.body = signedUrls
    })

    router.use('/api', apiRouter.routes(), apiRouter.allowedMethods())

    router.get('*', async ctx => {
      const { res, req } = ctx

      await handle(req, res)
      ctx.respond = false
    })

    server.use(async (ctx, next) => {
      ctx.res.statusCode = 200
      await next()
    })
    server.use(router.routes())

    getPosts()
      .then(it => (blogList = it))
      .catch(e => console.log(e))
    nodeSchedule.scheduleJob('* * * * *', async () => {
      console.log('update blog')
      blogList = await getPosts()
    })

    server.listen(port)
    console.log(`> Ready on ${ROOT_URL} [${env}]`)
  })
  .catch(err => {
    console.log('An error occurred, unable to start the server')
    console.log(err)
  })

async function getSiteMap() {
  const siteMap = require('sitemap').createSitemap({
    hostname: 'https://sorcererxw.com',
    cacheTime: 600000, // 600 sec - cache purge period
  })

  for (const item of blogList) {
    const name = item.name
    siteMap.add({
      url: `/post/${name}`,
      changefreq: 'always',
      priority: 0.9,
    })
  }
  return siteMap.toString()
}
