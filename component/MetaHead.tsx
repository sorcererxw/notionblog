import * as React from 'react';
import Head from 'next/head';
import * as Config from '../blog.config'

interface IProps {
    title: string
}

interface IState {
}

export default class MetaHead extends React.Component<IProps, IState> {
    static defaultProps = {
        title: Config.blog_name
    };

    public render(): React.ReactNode {
        return <Head>
            <title>{this.props.title}</title>
            <link rel='shortcut icon' href={Config.blog_favicon}/>
            <meta name="theme-color" content="#000000"/>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
            <link rel="manifest" href={Config.site_manifest}/>
        </Head>
    }
}