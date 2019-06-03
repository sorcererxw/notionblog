import Router from 'koa-router'
import postService from '../service/postService'

const router = new Router()

router.get('/sitemap.xml', async ctx => {
    ctx.set('Content-Type', 'application/xml')
    ctx.response.body = await getSiteMap()
})

async function getSiteMap() {
    const siteMap = require('sitemap').createSitemap({
        hostname: 'https://sorcererxw.com',
        cacheTime: 600000, // 600 sec - cache purge period
    })

    const posts = await postService.getPostList()
    for (const item of posts) {
        const name = item.name
        siteMap.add({
            url: `/post/${name}`,
            changefreq: 'always',
            priority: 0.9,
        })
    }
    return siteMap.toString()
}

export default router
