import * as React from 'react'
import styled from "styled-components";
import {BlockNode} from "../../../api/notion";
import NotionBlockList from "../base/NotionBlockList";

const Container = styled.div`
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

interface Props {
    block: BlockNode
}

class ColumnBlock extends React.Component<Props, {}> {
    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        return <Container>
            <NotionBlockList blocks={this.props.block.children}/>
        </Container>
    }
}

export default ColumnBlock