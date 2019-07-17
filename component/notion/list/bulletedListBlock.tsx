import React from 'react'
import styled from 'styled-components'
import { BlockNode } from '../../../api/types'
import HierarchyListBlock from './hierarchyListBlock'

const Symbol = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 6px;
  background: currentcolor;
`

interface IProps {
  value: BlockNode
}

class BulletedListBlock extends React.Component<IProps, {}> {
  public render(): React.ReactNode {
    return <HierarchyListBlock value={this.props.value} symbol={<Symbol />} />
  }
}

export default BulletedListBlock
