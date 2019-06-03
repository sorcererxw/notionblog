import React from 'react'
import YouTube from 'react-youtube'
import { BlockValue, UnsignedUrl } from '../../../api/types'
import FigureBlockContainer from './figureBlockContainer'
import FigureCaption from './figureCaption'
import api from '../../../api/'
import 'video-react/dist/video-react.css'

interface IProps {
    value: BlockValue
}

interface IState {
    source: string | undefined,
    youtube: boolean
}

class VideoBlock extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            source: undefined,
            youtube: false,
        }
    }

    async componentDidMount(): Promise<void> {
        const { id, format } = this.props.value

        if (!format) {
            return
        }
        // TODO: migrate to video.js
        // language=RegExp
        if (format.display_source.match('^http(s)?://(www.)?youtube.com/.+$')) {
            this.setState({
                source: format.display_source,
                youtube: true,
            })
        } else if (format.display_source.match('^.*secure\.notion-static\.com.*$')) {
            const unsignedUrl: UnsignedUrl = {
                url: format.display_source,
                permissionRecord: {
                    id,
                    table: 'block',
                },
            }
            const signedFileUrls = await api.getSignedFileUrls([unsignedUrl])
            if (signedFileUrls.signedUrls.length > 0) {
                this.setState({
                    source: signedFileUrls.signedUrls[0],
                })
            }
        } else {
            this.setState({
                source: format.display_source,
            })
        }
    }

    public render(): React.ReactNode {
        const state = this.state
        const format = this.props.value.format
        const properties = this.props.value.properties
        if (state.source === undefined) {
            return null
        }
        let videoNode: React.ReactNode | null = null
        let captionNode: React.ReactNode | null = null

        if (state.youtube && format) {
            const option = {
                height: (format.block_width * format.block_aspect_ratio).toString(),
                width: format.block_width.toString(),
            }
            videoNode = <YouTube
                opts={option}
                className={'VideoFrame'}
                videoId={this.getYoutubeId(format.display_source)}/>
        } else {
            const Player = require('video-react').Player
            videoNode = <Player
                playsInline
                src={state.source}/>
        }
        if (properties !== undefined && properties.caption !== undefined) {
            captionNode = <FigureCaption caption={properties.caption}/>
        }
        return <FigureBlockContainer>
            {videoNode}
            {captionNode}
        </FigureBlockContainer>
    }

    private readonly getYoutubeId = (url: string): string => {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/
        const match = url.match(regExp)
        return (match && match[7].length === 11) ? match[7] : ''
    }
}

export default VideoBlock
