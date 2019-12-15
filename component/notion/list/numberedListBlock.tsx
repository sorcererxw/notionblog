import React from 'react'
import { BlockNode } from '../../../api/types'
import HierarchyListBlock from './hierarchyListBlock'

interface IProps {
  value: BlockNode
  index: number
}

class NumberedListBlock extends React.Component<IProps, {}> {
  public render(): React.ReactNode {
    return <HierarchyListBlock value={this.props.value} symbol={<span>{this.props.index}.</span>}/>
  }
}

export default NumberedListBlock
