import express from "express";
import next from "next";
import path from "path";
import {provider} from "./provider";
import bodyParser from "body-parser";
import schedule from "node-schedule";

const sm = require("sitemap");

const port = parseInt(process.env.PORT || "3000", 10);
const env = process.env.NODE_ENV;
const dev = env !== 'production';

const ROOT_URL = dev ? `http://localhost:${port}` : 'https://sorcererxw.com';

console.log(`dev: ${dev}`);

const app = next({dev});
const handle = app.getRequestHandler();

let blogList: any[] = [];

app.prepare().then(() => {
    const server = express();
    server.use(bodyParser.urlencoded({extended: true}));
    server.use(bodyParser.json());

    schedule.scheduleJob("* * * * *", async () => {
        console.log("update blog");
        blogList = await provider.getPosts()
    });

    server.all('/robots.txt', (_, res) => {
        console.log(path.join(__dirname, '../static', 'robots.txt'));
        return res.sendFile(path.join(__dirname, '../static', 'robots.txt'))
    });

    server.all('/sitemap.xml', async (_, res) => {
        res.header('Content-Type', 'application/xml');
        res.send(await getSitemap())
    });

    server.all("/api/blog/:id", async (req, res) => {
        const id = req.params.id;
        res.setHeader('Content-Type', 'application/json');
        const result = await provider.getPost(id);
        res.send(JSON.stringify(result))
    });

    server.all('/((\\d+))/((\\d+))/((\\d+))/:name', async (req, res) => {
        res.redirect(301, `/post/${req.params.name}`)
    });

    server.all("/api/blog", async (_, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(blogList))
    });

    server.all("/post/:name", async (req, res) => {
        const getIdByName = (name) => {
            for (let post of blogList) {
                if (post.name === name) {
                    return post.id;
                }
            }
            return undefined
        };
        const pageId = getIdByName(req.params.name) || "";
        if (pageId.length === 0) {
            res.statusCode = 404;
            return app.render(req, res, "/_error")
        }
        const article = await provider.getPost(pageId);
        return app.render(req, res, '/post', {
            block: pageId,
            article: article
        })
    });

    server.all("/blog", async (req, res) => {
        return app.render(req, res, '/blog', {
            posts: blogList
        })
    });

    server.all('*', (req, res) => {
        return handle(req, res)
    });

    server.listen(port, (err) => {
        if (err) {
            throw err;
        }
        console.log(`> Ready on ${ROOT_URL} [${env}]`)
    })
}).catch(err => {
    console.log('An error occurred, unable to start the server');
    console.log(err)
});

const getSitemap = async () => {
    const sitemap = sm.createSitemap({
        hostname: 'https://sorcererxw.com',
        cacheTime: 600000 // 600 sec - cache purge period
    });

    for (let i = 0; i < blogList.length; i += 1) {
        const name = blogList[i].name;
        sitemap.add({
            url: `/post/${name}`,
            changefreq: 'always',
            priority: 0.9
        })
    }
    return sitemap.toString()
};
