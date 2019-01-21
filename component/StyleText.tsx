import * as React from 'react'
import styled from "styled-components";

const Bold = styled.strong`
`;

const Italic = styled.i`
`;

const Highlight = styled.code`
  background: rgba(0,0,0,.05);
  margin: 0 2px;
  align-self: center;
  padding: 2px 4px;
  border-radius: 3px; 
  max-width: 100%;
  word-break: break-word;
`;

const Link = styled.a`
`;

const Deleted = styled.del`
`;

interface IProps {
    text: string
    bold: boolean
    highlight: boolean
    italic: boolean
    link: string
    deleted: boolean
}

class StyleText extends React.Component<IProps, {}> {
    public static defaultProps = {
        bold: false,
        deleted: null,
        highlight: false,
        italic: false,
        link: false,
        text: ""
    };

    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        const isEmptyString = (s: string): boolean =>
            s === undefined || s == null || s.length === 0;

        const boldify = (node: React.ReactNode): React.ReactNode =>
            this.props.bold ? <Bold>{node}</Bold> : node;
        const italicify = (node: React.ReactNode): React.ReactNode =>
            this.props.italic ? <Italic>{node}</Italic> : node;
        const highlightify = (node: React.ReactNode): React.ReactNode =>
            this.props.highlight ? <Highlight>{node}</Highlight> : node;
        const deletedify = (node: React.ReactNode): React.ReactNode =>
            this.props.deleted ? <Deleted>{node}</Deleted> : node;
        const linkify = (node: React.ReactNode): React.ReactNode =>
            (isEmptyString(this.props.link)) ? node
                : <Link href={this.props.link} target='_blank'>{node}</Link>;

        return linkify(deletedify(highlightify(italicify(boldify(
            <span>{this.props.text}</span>
        )))))
    }
}

export default StyleText