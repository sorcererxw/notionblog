import * as React from 'react'
import styled from "styled-components";
import {IRecordValue} from "../../api/notion";
import StyleText from "../StyleText";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  object-fit: contain;
  height: ${props => props.height};
  width: ${props => props.width};
  max-width: 100%;
`;

const Caption = styled.figcaption`
  line-height: 1.4;
  opacity: 0.68;
  font-size: 0.8em;
`;

interface IProps {
    value: IRecordValue
}

interface IState {
    _: undefined
}

class ImageBlock extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        const format = this.props.value.value.format;
        const properties = this.props.value.value.properties;

        let imageNode = null;
        let captionNode = null;

        if (format !== undefined) {
            imageNode = <Image
                width={format.block_width}
                height={format.block_width * format.block_aspect_ratio}
                src={format.display_source}/>
        } else if (properties !== undefined) {
            imageNode = <Image src={properties.source[0]}/>
        }

        if (properties !== undefined && properties.caption !== undefined) {
            captionNode = <Caption>
                {
                    properties.caption.map((it, idx) => this.renderCaption(it, idx))
                }
            </Caption>
        }
        return <Container>
            {imageNode}
            {captionNode}
        </Container>
    }

    private renderCaption = (caption: {}, idx: number): React.ReactNode => {
        const value = caption[0];
        const textProperties = caption[1];

        let bold = false;
        let italic = false;
        let highlight = false;
        let deleted = false;
        let link = null;

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

export default ImageBlock