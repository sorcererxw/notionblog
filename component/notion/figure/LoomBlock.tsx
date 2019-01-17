import * as React from "react";
import {BlockValue} from "../../../api/types";
import FigureBlockContainer from "./FigureBlockContainer";
import FigureCaption from "./FigureCaption";

interface Props {
    value: BlockValue
}

interface State {
}

export default class LoomBlock extends React.Component<Props, State> {
    render(): React.ReactNode {
        if (this.props.value === undefined
            || this.props.value.properties === undefined
            || this.props.value.properties.source === undefined) {
            return <div/>
        }
        const properties = this.props.value.properties;

        let captionNode: React.ReactNode | null = null;

        if (properties !== undefined && properties.caption !== undefined) {
            captionNode = <FigureCaption caption={properties.caption}/>
        }


        return <FigureBlockContainer>
            {this.renderLoom()}
            {captionNode}
        </FigureBlockContainer>
    }

    private renderLoom(): React.ReactNode | null {
        const format = this.props.value.format;
        const properties = this.props.value.properties;
        if (format != null) {
            const width = format.block_width;
            const ratio = format.block_aspect_ratio;
            return <div style={{
                position: 'relative',
                paddingBottom: `${ratio * 100}%`,
                height: 0,
                width: width,
                maxWidth: "100%"
            }}>
                <iframe
                    style={{
                        height: "100%",
                        width: "100%",
                        top: 0,
                        left: 0,
                        position: 'absolute'
                    }}
                    src={format.display_source}
                    frameBorder={0} allowFullScreen/>
            </div>
        } else if (properties != null) {
            const url = properties.source[0][0];
            const loomId = /^https:\/\/www.useloom.com\/share\/([0-9a-z]+)$/.exec(url)[1];
            return <div style={{
                maxWidth: '100%'
            }}>
                <iframe
                    src={`https://www.useloom.com/embed/${loomId}`}
                    frameBorder={0} allowFullScreen/>
            </div>
        } else {
            return null;
        }
    }
}