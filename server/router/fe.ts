import Router from 'koa-router'
import isBot from '../middleware/isBot'
import postService from '../service/postService'

const router = new Router()

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
    const pageId = getIdByName(ctx.params.name)
    if (pageId) {
        await ctx.render('/post', {
            ssr: ctx.state.isBot,
            pageId,
        })
    } else {
        res.statusCode = 404
        await ctx.render('/_error')
    }
    ctx.respond = false
})

export default router
