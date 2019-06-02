import React from 'react'
import { BlockValue } from '../../../api/types'
import FigureBlockContainer from './FigureBlockContainer'
import FigureCaption from './FigureCaption'

interface Props {
    value: BlockValue
}

export default class LoomBlock extends React.Component<Props> {
    render(): React.ReactNode {
        if (this.props.value.properties === undefined
            || this.props.value.properties.source === undefined) {
            return <div/>
        }
        const properties = this.props.value.properties

        let captionNode: React.ReactNode | null = null

        if (properties.caption !== undefined) {
            captionNode = <FigureCaption caption={properties.caption}/>
        }

        return <FigureBlockContainer>
            {this.renderLoom()}
            {captionNode}
        </FigureBlockContainer>
    }

    private renderLoom(): React.ReactNode | null {
        const format = this.props.value.format
        const properties = this.props.value.properties
        if (format) {
            const width = format.block_width
            const ratio = format.block_aspect_ratio
            return <div style={{
                position: 'relative',
                paddingBottom: `${ratio * 100}%`,
                height: 0,
                width,
                maxWidth: '100%',
            }}>
                <iframe
                    style={{
                        height: '100%',
                        width: '100%',
                        top: 0,
                        left: 0,
                        position: 'absolute',
                    }}
                    sandbox={''}
                    src={format.display_source}
                    frameBorder={0} allowFullScreen/>
            </div>
        }
        if (properties) {
            const url = properties.source![0][0]
            const test = /^https:\/\/www.useloom.com\/share\/([0-9a-z]+)$/.exec(url)
            if (test === null || test.length < 1) {
                return null
            }
            const loomId = test[1]
            return <div style={{
                maxWidth: '100%',
            }}>
                <iframe
                    sandbox={''}
                    src={`https://www.useloom.com/embed/${loomId}`}
                    frameBorder={0} allowFullScreen/>
            </div>
        }
        return null
    }
}
