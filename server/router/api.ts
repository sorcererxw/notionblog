import Router from 'koa-router'
import koaBody from 'koa-body'
import postService from '../service/postService'
import notionService from '../service/notionService'

const router = new Router()

router.get('/blog', async ctx => {
    const blogList = await postService.getPostList()
    console.log(blogList)
    ctx.response.type = 'application/json'
    ctx.response.body = blogList
})

router.get('/blog/:id', async ctx => {
    const id = ctx.params.id
    const result = await postService.getPost(id)

    ctx.response.type = 'application/json'
    ctx.response.body = result
})

router.post('/notion/getSignedFileUrls', koaBody(), async ctx => {
    const signedUrls = await notionService.getSignedFileUrls(ctx.request.body)
    ctx.response.type = 'application/json'
    ctx.response.body = signedUrls
})

export default router
