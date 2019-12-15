import Koa from 'koa'

declare namespace proxy {
  export interface Options {
    target?: string,
    changeOrigin?: boolean,
    logs?: boolean

    rewrite?(path: string): string
  }
}

declare function proxy(context: string, options?: proxy.Options): Koa.Middleware

export = proxy
