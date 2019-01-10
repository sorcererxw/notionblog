import * as React from 'react'
import {BlockNode} from "../../../api/notion";
import HierarchyListBlock from "./HierarchyListBlock";

interface IProps {
    value: BlockNode,
    index: number
}

interface IState {
}

class NumberedListBlock extends React.Component<IProps, IState> {

    public render(): React.ReactNode {
        return <HierarchyListBlock value={this.props.value} symbol={
            <span>{this.props.index}.</span>
        }/>
    }
}

export default NumberedListBlock