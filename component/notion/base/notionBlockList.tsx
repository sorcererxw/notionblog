import React from 'react'
import styled from 'styled-components'
import { BlockNode } from '../../../api/types'
import NotionBlock from './notionBlock'

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`

interface IProps {
  blocks: BlockNode[]
}

class NotionBlockList extends React.Component<IProps, {}> {
  constructor(props: any) {
    super(props)
  }

  public render(): React.ReactNode {
    const blocks = this.props.blocks
    const result: React.ReactNode[] = []
    let lastType = ''
    let sameTypeCnt = 0
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]
      if (block.value.type === lastType) {
        sameTypeCnt += 1
      } else {
        sameTypeCnt = 1
        lastType = block.value.type
      }
      result.push(<NotionBlock block={block} indexOfSameType={sameTypeCnt} key={i}/>)
    }
    return <Container>{result}</Container>
  }
}

export default NotionBlockList
