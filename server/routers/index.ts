import Router from 'koa-router'
import api from './api'
import { getSitemap } from '../controllers'
import next from 'next'
import isBot from '../middleware/isBot'
import postService from '../service/postService'

const app = next({ dev: process.env.NODE_ENV !== 'production' })
app.prepare()

const router = new Router()

router.use('/api', api.routes(), api.allowedMethods())
router.get('/sitemap.xml', getSitemap)
router.get('/post/:name', isBot(), async ctx => {
  const { res } = ctx

  const getIdByName = async (name: string): Promise<string | null> => {
    const posts = await postService.getPostList()
    for (const post of posts) {
      if (post.name === name) {
        return post.id
      }
    }
    return null
  }
  const pageId = await getIdByName(ctx.params.name)
  if (pageId) {
    await app.render(
      ctx.req, ctx.res,
      '/post',
      { ssr: ctx.state.isBot, pageId })
  } else {
    res.statusCode = 404
    await app.render(ctx.req, ctx.res, '/_error')
  }
  ctx.respond = false
})

router.all('*', async ctx => {
  await app.getRequestHandler()(ctx.req, ctx.res)
  ctx.respond = false
})

export default router
