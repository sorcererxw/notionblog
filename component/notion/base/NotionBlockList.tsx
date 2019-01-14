import * as React from 'react'
import styled from "styled-components";
import {BlockNode} from "../../../api/notion";
import NotionBlock from "./NotionBlock";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

interface IProps {
    blocks: BlockNode[]
}

interface IState {
}

class NotionBlockList extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        const blocks = this.props.blocks;
        const result: React.ReactNode[] = [];
        let lastType: string = "";
        let sameTypeCnt = 0;
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            if (block.value.type === lastType) {
                sameTypeCnt += 1;
            } else {
                sameTypeCnt = 1;
                lastType = block.value.type;
            }
            result.push(<NotionBlock block={block} indexOfSameType={sameTypeCnt} key={i}/>)
        }
        return <Container>{result}</Container>
    }
}

export default NotionBlockList