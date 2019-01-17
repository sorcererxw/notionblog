import * as React from 'react'
import styled from "styled-components";
import {BlockValue} from "../../../api/types";
import FigureBlockContainer from "./FigureBlockContainer";
import FigureCaption from "./FigureCaption";

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

        let imageNode: React.ReactNode | null = this.renderImage();
        let captionNode: React.ReactNode | null = this.renderCaption();

        return <FigureBlockContainer>
            {imageNode}
            {captionNode}
        </FigureBlockContainer>
    }

    private renderImage = (): React.ReactNode | null => {
        const format = this.props.value.format;
        const properties = this.props.value.properties;
        if (format !== undefined) {
            return <Image
                width={format.block_width}
                src={getImageUrl(format.display_source)}/>
        } else if (properties !== undefined) {
            return <Image src={getImageUrl(properties.source[0][0])}/>
        } else {
            return null;
        }
    };

    private renderCaption = (): React.ReactNode | null => {
        const properties = this.props.value.properties;
        if (properties !== undefined && properties.caption !== undefined) {
            return <FigureCaption caption={properties.caption}/>
        }
        return null;
    }
}

const getImageUrl = (url: string) => {
    if (url.match("/secure.notion-static.com/")) {
        return "https://www.notion.so/image/" + encodeURIComponent(url);
    }
    return url;
};

export default ImageBlock