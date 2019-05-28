import * as React from 'react'
import styled from "styled-components";
import {BlockNode} from "../../../notion/type";
import HierarchyListBlock from "./HierarchyListBlock";

const Symbol = styled.div`
  width: 6px; 
  height: 6px; 
  border-radius: 6px; 
  background: currentcolor;
`;

interface IProps {
    value: BlockNode
}

interface IState {
}

class BulletedListBlock extends React.Component<IProps, IState> {

    public render(): React.ReactNode {
        return <HierarchyListBlock value={this.props.value} symbol={<Symbol/>}/>
    }
}

export default BulletedListBlock
