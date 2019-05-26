const Koa = require('koa')
const Router = require('koa-router')
const KoaStatic = require('koa-static')
const next = require('next')
const path = require('path')
const sm = require('sitemap')
const getPost = require("./provider").getPost
const getSignedFileUrls = require("./provider").getSignedFileUrls
const schedule = require('node-schedule')
const getPosts = require("./provider").getPosts
const send = require('koa-send');

const port = parseInt(process.env.PORT, 10) || 3000
const env = process.env.NODE_ENV
const dev = env !== 'production'

const ROOT_URL = dev ? `http://localhost:${port}` : 'https://sorcererxw.com'

console.log(`dev: ${dev}`)

const app = next({dev})
const handle = app.getRequestHandler()

let blogList = []

app.prepare().then(async () => {
    const server = new Koa()
    const router = new Router()
    const apiRouter = new Router()

    router.get('/robots.txt', async (ctx) => (
        await send(ctx, 'robots.txt', {
            root: __dirname + '/',
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8',
            }
        })
    ))

    router.get('/sitemap.xml', async (ctx) => {
        ctx.set('Content-Type', 'application/xml')
        ctx.response.body = await getSiteMap()
    })

    router.get("/post/:name", async (ctx) => {
        const {res, req} = ctx

        const getIdByName = (name) => {
            for (let post of blogList)
                if (post.name === name) return post.id
            return undefined
        }
        const pageId = getIdByName(ctx.params.name) || ""
        if (pageId.length === 0) {
            res.statusCode = 404
            return app.render(req, res, "/_error")
        }
        const article = await getPost(pageId)
        await app.render(req, res, '/post', {
            block: pageId,
            article: article
        })
        ctx.response = false
    })

    router.get("/blog", async (ctx) => {
        const {res, req} = ctx

        await app.render(req, res, '/blog', {
            posts: blogList
        })
        ctx.response = false
    })

    router.get('*', async (ctx) => {
        const {res, req} = ctx

        await handle(req, res)
        ctx.response = false
    })

    // path: /api/**

    apiRouter.get('/blog', async (ctx) => {
        const {res, req} = ctx

        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify(blogList))
    })

    apiRouter.get('/blog/:id', async (ctx) => {
        const {res, req} = ctx

        const id = ctx.params.id
        res.setHeader('Content-Type', 'application/json')
        const result = await getPost(id)
        res.send(JSON.stringify(result))
    })

    apiRouter.get('/notion/getSignedFileUrls', async (ctx) => {
        const {res, req} = ctx

        const signedUrls = await getSignedFileUrls(req.body)
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify(signedUrls))
    })

    router.use("/api", apiRouter.routes(), apiRouter.allowedMethods())

    // server.use(bodyParser.urlencoded({extended: true}))
    // server.use(bodyParser.json())
    server.use(async (ctx, next) => {
        ctx.res.statusCode = 200
        await next()
    })
    server.use(router.routes())

    getPosts().then(it => blogList = it).catch(e => console.log(e))
    schedule.scheduleJob("* * * * *", async () => {
        console.log("update blog")
        blogList = await getPosts()
    })

    server.listen(port, err => {
        if (err) throw err
        console.log(`> Ready on ${ROOT_URL} [${env}]`)
    })
}).catch(err => {
    console.log('An error occurred, unable to start the server')
    console.log(err)
})

const getSiteMap = async () => {
    const siteMap = sm.createSitemap({
        hostname: 'https://sorcererxw.com',
        cacheTime: 600000 // 600 sec - cache purge period
    })

    for (let i = 0; i < blogList.length; i += 1) {
        const name = blogList[i].name
        siteMap.add({
            url: `/post/${name}`,
            changefreq: 'always',
            priority: 0.9
        })
    }
    return siteMap.toString()
}