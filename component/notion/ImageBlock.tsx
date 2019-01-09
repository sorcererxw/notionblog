import * as React from 'react'
import styled from "styled-components";
import {BlockValue} from "../../api/notion";
import FigureCaptionNode from "./FigureCaptionNode";

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

interface IProps {
    value: BlockValue
}

interface IState {
    _: undefined
}

class ImageBlock extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        const format = this.props.value.format;
        const properties = this.props.value.properties;

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
            captionNode = <FigureCaptionNode caption={properties.caption}/>
        }
        return <Container>
            {imageNode}
            {captionNode}
        </Container>
    }
}

export default ImageBlock