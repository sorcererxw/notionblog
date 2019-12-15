import React from 'react'
import App, { AppContext } from 'next/app'
import Router from 'next/router'
import { initGA, logPageView } from '../utils/analytics'

export default class MyApp extends App {
  static async getInitialProps(context: AppContext) {
    const {
      Component,
      ctx,
    } = context
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  componentDidMount() {
    initGA()
    logPageView()
    if (Router.router !== null) {
      Router.router.events.on('routeChangeComplete', logPageView)
    }
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <Component {...pageProps} />
    )
  }
}
