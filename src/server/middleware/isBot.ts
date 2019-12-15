/**
 *  Thanks to https://github.com/duyetdev/koa-isbot
 */

import koa from 'koa'

const BOTS = [
  '\\+https:\\/\\/developers.google.com\\/\\+\\/web\\/snippet\\/',
  'googlebot',
  'baiduspider',
  'gurujibot',
  'yandexbot',
  'slurp',
  'msnbot',
  'bingbot',
  'facebookexternalhit',
  'linkedinbot',
  'twitterbot',
  'slackbot',
  'telegrambot',
  'applebot',
  'pingdom',
  'tumblr ',
]

const IS_BOT_REGEXP = new RegExp(`^.*(${BOTS.join('|')}).*$`)

export default function() {
  return async function(ctx: koa.Context, next: () => Promise<any>) {
    const source = ctx.request.headers['user-agent'] || ''

    const test = IS_BOT_REGEXP.exec(source.toLowerCase())
    let isBot: string | undefined
    if (test) {
      isBot = test[1]
    }
    ctx.state.isBot = isBot
    await next()
  }
}
