import * as React from 'react'
import styled from "styled-components";
import {BlockNode} from "../../../api/notion";
import NotionBlock from "../NotionBlock";

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
            {
                this.props.block.children.map((v, k) => <NotionBlock block={v} key={k}/>)
            }
        </Container>
    }
}

export default ColumnBlock