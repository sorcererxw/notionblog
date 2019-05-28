import * as React from 'react'
import Document, {DefaultDocumentIProps, NextDocumentContext} from 'next/document'
import {ServerStyleSheet} from 'styled-components'

class MyDocument extends Document {
    static async getInitialProps(ctx: NextDocumentContext): Promise<DefaultDocumentIProps> {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
                });

            const initialProps: DefaultDocumentIProps = await Document.getInitialProps(ctx);
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                )
            }
        } finally {
            sheet.seal()
        }
    }
}


export default MyDocument
