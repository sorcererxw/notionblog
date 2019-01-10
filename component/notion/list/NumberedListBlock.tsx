import * as React from 'react'
import styled from "styled-components";
import {BlockNode} from "../../../api/notion";
import NotionBlock from "./BulletedListBlock";
import TextBlock from "../TextBlock";

const Container = styled.div`
`;

const ChildrenContainer = styled.div`
    max-width: 100%;
    box-sizing: border-box;
    padding-right: 16px;
`;

interface IProps {
    value: BlockNode
}

interface IState {
    _: undefined
}

class NumberedListBlock extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        return <Container>
            {this.renderItself()}
            {this.renderChildren()}
        </Container>
    }

    private renderItself(): React.ReactNode {
        return <span><TextBlock value={this.props.value}/></span>
    }

    private renderChildren(): React.ReactNode {
        const blockChildren = this.props.value.children;
        if (blockChildren.length === 0) {
            return null;
        }
        return <ChildrenContainer>
            {
                blockChildren.map((v, k) => <NotionBlock key={k} value={v}/>)
            }
        </ChildrenContainer>
    }
}

export default NumberedListBlock