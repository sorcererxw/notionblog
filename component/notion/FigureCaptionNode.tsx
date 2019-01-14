import * as React from 'react'
import styled from "styled-components";
import StyleText from "../StyleText";

const Caption = styled.figcaption`
  line-height: 1.4;
  opacity: 0.68;
  font-size: 0.8em;
`;

interface IProps {
    caption: any[]
}

interface IState {
    _: undefined
}

class FigureCaptionNode extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        return <Caption>
            {this.props.caption.map((it, idx) => this.renderCaption(it, idx))}
        </Caption>
    }

    private renderCaption = (caption: {}, idx: number): React.ReactNode => {
        const value = caption[0];
        const textProperties = caption[1];

        let bold = false;
        let italic = false;
        let highlight = false;
        let deleted = false;
        let link = undefined;

        if (textProperties !== undefined) {
            for (const p of textProperties) {
                if (p[0] === 'b') {
                    bold = true;
                } else if (p[0] === 'i') {
                    italic = true;
                } else if (p[0] === 'c') {
                    highlight = true;
                } else if (p[0] === 'a') {
                    link = p[1];
                } else if (p[0] === 's') {
                    deleted = true;
                }
            }
        }

        return <StyleText
            key={idx}
            bold={bold}
            deleted={deleted}
            highlight={highlight}
            italic={italic}
            link={link}
            text={value}/>
    }

}

export default FigureCaptionNode