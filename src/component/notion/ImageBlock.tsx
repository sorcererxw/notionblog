import * as React from 'react'
import styled from "styled-components";
import {IRecordValue} from "../../api/notion";

const Container = styled.div`
  max-width: 100%;
`;

const Image = styled.img`
 height: ${props => props.height};
 width: ${props => props.width};
 max-width: 100%;
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
        if (format !== undefined) {
            return <Container>
                <Image
                    width={format.block_width}
                    height={format.block_width * format.block_aspect_ratio}
                    src={format.display_source}/>
            </Container>
        } else if (properties !== undefined) {
            return <Container>
                <Image
                    src={properties.source[0]}/>
            </Container>
        } else {
            return <div/>
        }
    }
}

export default ImageBlock