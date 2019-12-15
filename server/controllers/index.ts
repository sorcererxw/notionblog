import postService from '../service/postService'
import { Context } from 'koa'

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

export async function getSitemap(ctx: Context) {
  ctx.set('Content-Type', 'application/xml')
  ctx.body = await getSiteMap()
}
