import * as React from 'react'
import YouTube from 'react-youtube';
import {IRecordValue} from "../../api/notion";

interface IProps {
    value: IRecordValue
}

interface IState {
    _: undefined
}

class VideoBlock extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        const format = this.props.value.value.format;
        if (format == null) {
            return null;
        }
        // language=RegExp
        if (format.display_source.match("^http(s)?://(www.)?youtube.com/.+$")) {
            const option = {
                height: (format.block_width * format.block_aspect_ratio).toString(),
                width: format.block_width.toString(),
            };
            return <YouTube
                opts={option}
                videoId={this.getYoutubeId(format.display_source)}/>
        }
        return <div/>
    }

    private getYoutubeId = (url: string): string => {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : "";
    }
}

export default VideoBlock