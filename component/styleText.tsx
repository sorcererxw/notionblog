import React from 'react'
import styled from 'styled-components'
import { Color } from 'csstype'
import { RichText } from '../api/types'

const Bold = styled.strong`
`

const Italic = styled.i`
`

const Code = styled.code`
  background: rgba(0,0,0,.05);
  margin: 0 2px;
  align-self: center;
  padding: 2px 4px;
  border-radius: 3px;
  max-width: 100%;
  word-break: break-word;
`

const Link = styled.a`
`

const Deleted = styled.del`
`

interface HighlightInfo {
    type: 'none' | 'background' | 'text',
    color: Color
}

interface IProps {
    text: string
    bold?: boolean
    code?: boolean
    italic?: boolean
    link?: string
    deleted?: boolean
    highlight?: HighlightInfo
}

class StyleText extends React.Component<IProps, {}> {
    public static defaultProps = {
        bold: false,
        deleted: null,
        code: false,
        italic: false,
        link: false,
        text: '',
    }

    static fromRichText(text: RichText) {
        const value = text[0]
        const styles = text[1]

        let bold = false
        let italic = false
        let code = false
        let deleted = false
        let link: string | undefined
        const highlight: HighlightInfo = { type: 'none', color: 'default' }

        if (styles !== undefined) {
            for (const p of styles) {
                if (p[0] === 'b') {
                    bold = true
                } else if (p[0] === 'i') {
                    italic = true
                } else if (p[0] === 'c') {
                    code = true
                } else if (p[0] === 'a') {
                    link = p[1]
                } else if (p[0] === 's') {
                    deleted = true
                } else if (p[0] === 'h') {
                    if (p[1] === undefined || p[1].length === 0) {
                        continue
                    }
                    const colors: { name: string, color: Color }[] = [
                        { name: 'grey', color: 'grey' },
                        { name: 'brown', color: 'brown' },
                        { name: 'orange', color: 'orange' },
                        { name: 'yellow', color: 'yellow' },
                        { name: 'green', color: 'green' },
                        { name: 'blue', color: 'blue' },
                        { name: 'purple', color: 'purple' },
                        { name: 'pink', color: 'pink' },
                        { name: 'red', color: 'red' },
                    ]
                    const splits = p[1].toLowerCase().split('_')
                    for (const c of colors) {
                        if (c.name !== splits[0]) {
                            continue
                        }
                        highlight.color = splits[0]
                        highlight.type = splits[1] === 'background' ? 'background' : 'text'
                        break
                    }
                }
            }
        }

        return <StyleText
            bold={bold}
            deleted={deleted}
            code={code}
            italic={italic}
            link={link}
            highlight={highlight}
            text={value}/>
    }

    constructor(props: any) {
        super(props)
    }

    public render(): React.ReactNode {
        const isEmptyString = (s: string | undefined | null): boolean =>
            s === undefined || s === null || s.length === 0

        const boldify = (node: React.ReactNode): React.ReactNode =>
            this.props.bold ? <Bold>{node}</Bold> : node
        const italicify = (node: React.ReactNode): React.ReactNode =>
            this.props.italic ? <Italic>{node}</Italic> : node
        const codify = (node: React.ReactNode): React.ReactNode =>
            this.props.code ? <Code>{node}</Code> : node
        const deletedify = (node: React.ReactNode): React.ReactNode =>
            this.props.deleted ? <Deleted>{node}</Deleted> : node
        const linkify = (node: React.ReactNode): React.ReactNode =>
            (isEmptyString(this.props.link)) ? node
                : <Link href={this.props.link} target='_blank'>{node}</Link>
        const highlightify = (node: React.ReactNode): React.ReactNode => {
            const { highlight } = this.props
            if (highlight === undefined) {
                return node
            }
            if (highlight.type === 'background') {
                return <span style={{ background: highlight.color }}>node</span>
            }
            if (highlight.type === 'text') {
                return <span style={{ color: highlight.color }}>node</span>
            }
            return node
        }
        return highlightify(linkify(deletedify(codify(italicify(boldify(
            <span>{this.props.text}</span>,
        ))))))
    }
}

export default StyleText
