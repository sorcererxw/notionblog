const express = require('express')
const next = require('next')
const proxyMiddleware = require('http-proxy-middleware')
const LRUCache = require('lru-cache')
const path = require('path')
const getPosts = require("./posts")
const sm = require('sitemap')

const ssrCache = new LRUCache({
    max: 100,
    maxAge: 1000 * 60 * 60 // 1hour
})

const reverseProxy = {
    '/api': {
        target: "https://www.notion.so/api/v3/",
        pathRewrite: {'^/api': '/'},
        changeOrigin: true
    }
}

const port = parseInt(process.env.PORT, 10) || 3000
const env = process.env.NODE_ENV
const dev = process.env.NODE_ENV !== 'production'

const ROOT_URL = dev ? `http://localhost:${port}` : 'https://blog.sorcererxw.com'

console.log(`dev: ${dev}`)

const app = next({dev})
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = express()

    if (reverseProxy) {
        Object.keys(reverseProxy).forEach(function (context) {
            server.use(proxyMiddleware(context, reverseProxy[context]))
        })
    }

    server.all('/robots.txt', (_, res) => {
        console.log(path.join(__dirname, '../static', 'robots.txt'))
        return res.sendFile(path.join(__dirname, '../static', 'robots.txt'))
    })

    server.all('/sitemap.xml', async (_, res) => {
        console.log("get sitemap")
        res.header('Content-Type', 'application/xml')
        console.log(await getSitemap())

        res.send(await getSitemap())
    })

    server.all("/post/:name", async (req, res) => {
        const pageId = req.params.name
        return renderAndCache(req, res, '/post', {
            block: pageId
        })
    })

    server.all('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(port, err => {
        if (err) {
            throw err
        }
        console.log(`> Ready on ${ROOT_URL} [${env}]`)
    })
}).catch(err => {
    console.log('An error occurred, unable to start the server')
    console.log(err)
})

async function getSitemap() {
    const sitemap = sm.createSitemap({
        hostname: 'https://blog.sorcererxw.com',
        cacheTime: 600000 // 600 sec - cache purge period
    })

    const posts = await getPosts()
    for (let i = 0; i < posts.length; i += 1) {
        const post = posts[i]
        sitemap.add({
            url: `/post/${post}`,
            changefreq: 'always',
            priority: 0.9
        })
    }

    return sitemap.toString()
}

/*
 * NB: make sure to modify this to take into account anything that should trigger
 * an immediate page change (e.g a locale stored in req.session)
 */
function getCacheKey(req) {
    return `${req.url}`
}

async function renderAndCache(req, res, pagePath, queryParams) {
    const key = getCacheKey(req)

    // If we have a page in the cache, let's serve it
    if (ssrCache.has(key)) {
        res.setHeader('x-cache', 'HIT')
        res.send(ssrCache.get(key))
        return
    }

    try {
        // If not let's render the page into HTML
        const html = await app.renderToHTML(req, res, pagePath, queryParams)

        // Something is wrong with the request, let's skip the cache
        if (res.statusCode !== 200) {
            res.send(html)
            return
        }

        // Let's cache this page
        ssrCache.set(key, html)

        res.setHeader('x-cache', 'MISS')
        res.send(html)
    } catch (err) {
        app.renderError(err, req, res, pagePath, queryParams)
    }
}