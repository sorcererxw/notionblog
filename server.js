const express = require('express')
const {parse} = require('url')
const next = require('next')

const devProxy = {
    '/api': {
        target: "https://www.notion.so/api/v3/",
        pathRewrite: {'^/api': '/'},
        changeOrigin: true
    }
}

const port = parseInt(process.env.PORT, 10) || 3000
const env = process.env.NODE_ENV
const dev = process.env.NODE_ENV !== 'production'
const app = next({
    dir: '.',
    dev
})
const handle = app.getRequestHandler()


app.prepare().then(() => {
    const server = express()
    if (dev && devProxy) {
        const proxyMiddleware = require('http-proxy-middleware')
        Object.keys(devProxy).forEach(function (context) {
            server.use(proxyMiddleware(context, devProxy[context]))
        })
    }

    server.all('*', (req, res) => {
        const parsedUrl = parse(req.url, true)
        const {pathname, query} = parsedUrl
        if (pathname.match("^/post/[a-zA-Z0-9]+$")) {
            const pageId = /\/post\/([a-zA-Z0-9]+)/.exec(pathname)[1]
            return app.render(req, res, '/post', {
                block: pageId
            })
        } else {
            return handle(req, res, parsedUrl)
        }
    })

    server.listen(port, err => {
        if (err) {
            throw err
        }
        console.log(`> Ready on port ${port} [${env}]`)
    })
}).catch(err => {
    console.log('An error occurred, unable to start the server')
    console.log(err)
})