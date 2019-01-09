import * as React from 'react'
import YouTube from 'react-youtube';
import styled from "styled-components";
import {BlockValue} from "../../api/notion";
import FigureCaptionNode from "./FigureCaptionNode";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: center;
`;

interface IProps {
    value: BlockValue
}

interface IState {
    _: undefined
}

class VideoBlock extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        const format = this.props.value.format;
        const properties = this.props.value.properties;
        if (format == null) {
            return null;
        }
        let videoNode = null;
        let captionNode = null;
        // language=RegExp
        if (format.display_source.match("^http(s)?://(www.)?youtube.com/.+$")) {
            const option = {
                height: (format.block_width * format.block_aspect_ratio).toString(),
                width: format.block_width.toString(),
            };
            videoNode = <YouTube
                opts={option}
                videoId={this.getYoutubeId(format.display_source)}/>
        }
        if (properties !== undefined && properties.caption !== undefined) {
            captionNode = <FigureCaptionNode caption={properties.caption}/>
        }
        return <Container>
            {videoNode}
            {captionNode}
        </Container>
    }

    private getYoutubeId = (url: string): string => {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : "";
    };
}

export default VideoBlock