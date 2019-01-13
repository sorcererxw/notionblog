const express = require('express')
const {parse} = require('url')
const next = require('next')
const proxyMiddleware = require('http-proxy-middleware')

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
console.log(`dev: ${dev}`)

const app = next({
    dir: '.',
    dev
})
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = express()
    if (devProxy) {
        Object.keys(devProxy).forEach(function (context) {
            server.use(proxyMiddleware(context, devProxy[context]))
        })
    }

    server.all("/post/:name", async (req, res) => {
        const pageId = req.params.name
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
        console.log(`> Ready on port ${port} [${env}]`)
    })
}).catch(err => {
    console.log('An error occurred, unable to start the server')
    console.log(err)
})