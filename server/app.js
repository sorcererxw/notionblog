const express = require('express')
const next = require('next')
const proxyMiddleware = require('http-proxy-middleware')
const path = require('path')
const sm = require('sitemap')
const getPosts = require("./provider").getPosts
const getPost = require("./provider").getPost

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

    if (reverseProxy && false) {
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

    server.all("/api/blog", async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        const result = await getPosts()
        res.send(JSON.stringify(result))
    })

    server.all("/api/blog/:id", async (req, res) => {
        const id = req.params.id
        res.setHeader('Content-Type', 'application/json')
        const result = await getPost(id)
        res.send(JSON.stringify(result))
    })

    server.all("/post/:name", async (req, res) => {
        const pageId = await getIdByName(req.params.name)
        return app.render(req, res, '/post', {
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

const nameMap = {}

const getIdByName = async (name) => {
    if (nameMap[name] !== undefined) return nameMap[name]
    const posts = await getPosts()
    for (let post of posts) {
        if (post.name === name) {
            nameMap[name] = post.id
            return post.id
        }
    }
    return ""
}

const getSitemap = async () => {
    const sitemap = sm.createSitemap({
        hostname: 'https://blog.sorcererxw.com',
        cacheTime: 600000 // 600 sec - cache purge period
    })

    const posts = await getPosts()
    for (let i = 0; i < posts.length; i += 1) {
        const name = posts[i].name
        sitemap.add({
            url: `/post/${name}`,
            changefreq: 'always',
            priority: 0.9
        })
    }

    return sitemap.toString()
}