const {createServer} = require('http')
const {parse} = require('url')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()

app.prepare().then(() => {
    createServer((req, res) => {
        const parsedUrl = parse(req.url, true)
        const {pathname, query} = parsedUrl
        if (pathname.match("^/post/[a-zA-Z0-9]+$")) {
            const pageId = /\/post\/([a-zA-Z0-9]+)/.exec(pathname)[1]
            app.render(req, res, '/post', {
                block: pageId
            })
        } else {
            handle(req, res, parsedUrl)
        }
    }).listen(port, err => {
        if (err) {
            console.log(err)
            throw err
        }
        console.log(`> Ready on http://localhost:${port}`)
    })
})