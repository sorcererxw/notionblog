import * as React from 'react'
import styled from "styled-components";
import {BlockValue} from "../../../api/types";
import FigureCaption from "./FigureCaption";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  object-fit: contain;
  width: ${props => props.width};
  max-width: 100%;
`;

interface Props {
    value: BlockValue
}

interface State {
}

class ImageBlock extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        const format = this.props.value.format;
        const properties = this.props.value.properties;

        console.log(format);
        console.log(properties);

        let imageNode: React.ReactNode | null = null;
        let captionNode: React.ReactNode | null = null;

        if (format !== undefined) {
            imageNode = <Image
                width={format.block_width}
                src={getImageUrl(format.display_source)}/>
        } else if (properties !== undefined) {
            imageNode = <Image src={getImageUrl(properties.source[0][0])}/>
        }

        if (properties !== undefined && properties.caption !== undefined) {
            captionNode = <FigureCaption caption={properties.caption}/>
        }
        return <Container>
            {imageNode}
            {captionNode}
        </Container>
    }
}

const getImageUrl = (url: string) => {
    if (url.match("/secure.notion-static.com/")) {
        return "https://www.notion.so/image/" + encodeURIComponent(url);
    }
    return url;
};

export default ImageBlock