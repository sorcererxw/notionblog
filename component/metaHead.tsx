import React from 'react'
import Head from 'next/head'
import config from '../config'

interface IProps {
    title: string
}

export default class MetaHead extends React.Component<IProps, {}> {
    static defaultProps = {
        title: config.blogName,
    }

    public render(): React.ReactNode {
        return <Head>
            <title>{this.props.title}</title>
            <link rel='shortcut icon' href={config.blogFavicon}/>
            <meta name='theme-color' content='#ffffff'/>
            <meta charSet='utf-8'/>
            <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'/>
            <link rel='manifest' href={config.siteManifest}/>
        </Head>
    }
}
