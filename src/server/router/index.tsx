import Router from 'koa-router'
import Koa from 'koa'
import { ServerStyleSheet } from 'styled-components'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from '../../client/app'
import React from 'react'

const router = new Router()

function redirectIntercept(ctx: Koa.Context, next: () => Promise<any>) {
  const context = {
    url: undefined,
  }
  const sheet = new ServerStyleSheet()

  ctx.state.markup = renderToString(
    sheet.collectStyles(
      <StaticRouter context={context} location={ctx.url}>
        <App/>
      </StaticRouter>,
    ),
  )
  ctx.state.styleTags = sheet.getStyleTags()
  return context.url ? ctx.redirect(context.url!) : next()
}

function responseHtml(ctx: Koa.Context) {
  const assets = require(process.env.RAZZLE_ASSETS_MANIFEST!)

  ctx.status = 200
  ctx.body = `
    <!doctype html>
    <html lang="">
      <head>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta charset="utf-8" />
          <title>SorcererXW Blog</title>
          <link rel="shortcut icon" type="image/png" href="/favicon.png"/>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          ${assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ''}
          ${
    process.env.NODE_ENV === 'production'
      ? `<script src="${assets.client.js}" defer></script>`
      : `<script src="${assets.client.js}" defer crossorigin></script>`
  }
          ${ctx.state.styleTags}
      </head>
      <body>
          <div id="root">${ctx.state.markup}</div>
      </body>
    </html>`
}

router.get('/*', redirectIntercept, responseHtml)

export default router
