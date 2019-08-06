import React from 'react'
import styled from 'styled-components'
import { Color } from 'csstype'
import {
  BACKGROUND_COLORS,
  COLORS,
  HighlightStyleType,
  LinkStyleType,
  RichText,
  TextStyleType,
} from 'notink'

const Bold = styled.strong``

const Italic = styled.i``

const Code = styled.code`
  background: rgba(0, 0, 0, 0.05);
  margin: 0 2px;
  align-self: center;
  padding: 2px 4px;
  border-radius: 3px;
  max-width: 100%;
  word-break: break-word;
`

const Link = styled.a``

const Deleted = styled.del``

interface HighlightInfo {
  type: 'none' | 'background' | 'text'
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

class StyleText extends React.Component<IProps> {
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

    if (styles === undefined) {
      return <StyleText text={value}/>
    }
    for (const p of styles) {
      if (!p || p.length <= 0) {
        continue
      }

      if (p[0] === TextStyleType.BOLD) {
        bold = true
      } else if (p[0] === TextStyleType.ITALIC) {
        italic = true
      } else if (p[0] === TextStyleType.CODE) {
        code = true
      } else if (p[0] === TextStyleType.LINK && p[1] !== undefined) {
        const style = p as LinkStyleType
        link = style[1]
      } else if (p[0] === TextStyleType.DELETED) {
        deleted = true
      } else if (p[0] === TextStyleType.HIGH_LIGHT && p[1] !== undefined) {
        const style = p as HighlightStyleType
        if (COLORS.some((it: string) => it === style[1])) {
          highlight.color = style[1]
          highlight.type = 'text'
        } else if (BACKGROUND_COLORS.some((it: string) => it === style[1])) {
          highlight.color = style[1].split('_')[0]
          highlight.type = 'background'
        }
      }
    }

    return (
      <StyleText
        bold={bold}
        deleted={deleted}
        code={code}
        italic={italic}
        link={link}
        highlight={highlight}
        text={value}
      />
    )
  }

  constructor(props: any) {
    super(props)
  }

  public render(): React.ReactNode {
    const boldify = (node: React.ReactNode): React.ReactNode =>
      this.props.bold ? <Bold>{node}</Bold> : node
    const italicify = (node: React.ReactNode): React.ReactNode =>
      this.props.italic ? <Italic>{node}</Italic> : node
    const codify = (node: React.ReactNode): React.ReactNode =>
      this.props.code ? <Code>{node}</Code> : node
    const deletedify = (node: React.ReactNode): React.ReactNode =>
      this.props.deleted ? <Deleted>{node}</Deleted> : node
    const linkify = (node: React.ReactNode): React.ReactNode => {
      if (this.props.link) {
        return (
          <Link href={this.props.link} target='_blank'>
            {node}
          </Link>
        )
      }
      return node
    }
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
    return highlightify(
      linkify(deletedify(codify(italicify(boldify(<span>{this.props.text}</span>))))),
    )
  }
}

export default StyleText
