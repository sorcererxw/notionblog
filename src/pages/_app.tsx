import React from 'react'
import App, {Container, DefaultAppIProps, NextAppContext} from 'next/app'
import Router from 'next/router'
import {initGA, logPageView} from '../utils/analytics'

class MyApp extends App {
    static async getInitialProps(context: NextAppContext): Promise<DefaultAppIProps> {
        const {Component, ctx} = context;

        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }

        return {pageProps}
    }

    componentDidMount() {
        initGA();
        logPageView();
        Router.router.events.on('routeChangeComplete', logPageView)
    }

    render() {
        const {Component, pageProps} = this.props;
        return (
            <Container>
                <Component {...pageProps} />
            </Container>
        )
    }
}

export default MyApp
