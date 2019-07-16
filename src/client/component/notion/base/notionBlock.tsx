import React from 'react'
import styled from 'styled-components'
import { BlockNode } from '../../../api/types'
import LoomBlock from '../figure/loomBlock'
import SubSubHeaderBlock from '../header/subSubHeaderBlock'
import BulletedListBlock from '../list/bulletedListBlock'
import CodeBlock from '../codeBlock'
import CollectionViewBlock from '../collectionViewBlock'
import ColumnBlock from '../column/columnBlock'
import ColumnListBlock from '../column/columnListBlock'
import DividerBlock from '../dividerBlock'
import HeaderBlock from '../header/headerBlock'
import ImageBlock from '../figure/imageBlock'
import NumberedListBlock from '../list/numberedListBlock'
import QuoteBlock from '../quoteBlock'
import SubHeaderBlock from '../header/subHeaderBlock'
import TextBlock from '../textBlock'
import VideoBlock from '../figure/videoBlock'
import {
    BlockType,
    BulletedListBlockValue,
    CodeBlockValue,
    CollectionViewBlockValue,
    HeaderBlockValue,
    ImageBlockValue,
    LoomBlockValue,
    QuoteBlockValue,
    SubHeaderBlockValue,
    SubSubHeaderBlockValue,
    TextBlockValue,
    VideoBlockValue
} from 'notink'

const Container = styled.div`
  letter-spacing: 0.1px;
  color: var(--font-color);
  width: 100%;
  max-width: 100%;
  line-height: 1.5;
  font-size: 18px;
  margin: 1px 0;
  padding-top: 12px;
  box-sizing: border-box;
  display: block;
`

interface IProps {
    block: BlockNode<BlockType>,
    indexOfSameType: number
}

class NotionBlock extends React.Component<IProps> {
    static defaultProps = {
        indexOfSameType: 1,
    }

    constructor(props: any) {
        super(props)
    }

    public render(): React.ReactNode {
        return <Container>{this.renderBlock()}</Container>
    }

    private renderBlock(): React.ReactNode {
        const block = this.props.block
        const type = block.value.type
        if (type === BlockType.TEXT) {
            return <TextBlock value={block.value as TextBlockValue}/>
        }
        if (type === 'quote') {
            return <QuoteBlock value={block.value as QuoteBlockValue}/>
        }
        if (type === 'header') {
            return <HeaderBlock value={block.value as HeaderBlockValue}/>
        }
        if (type === 'sub_header') {
            return <SubHeaderBlock value={block.value as SubHeaderBlockValue}/>
        }
        if (type === 'sub_sub_header') {
            return <SubSubHeaderBlock value={block.value as SubSubHeaderBlockValue}/>
        }
        if (type === 'image') {
            return <ImageBlock value={block.value as ImageBlockValue}/>
        }
        if (type === 'code') {
            return <CodeBlock value={block.value as CodeBlockValue}/>
        }
        if (type === 'collection_view') {
            return <CollectionViewBlock value={block.value as CollectionViewBlockValue}/>
        }
        if (type === 'video') {
            return <VideoBlock value={block.value as VideoBlockValue}/>
        }
        if (type === 'loom') {
            return <LoomBlock value={block.value as LoomBlockValue}/>
        }
        if (type === 'divider') {
            return <DividerBlock/>
        }
        if (type === 'bulleted_list') {
            return <BulletedListBlock value={block}/>
        }
        if (type === 'numbered_list') {
            return <NumberedListBlock index={this.props.indexOfSameType} value={block}/>
        }
        if (type === 'column_list') {
            return <ColumnListBlock block={block}/>
        }
        if (type === 'column') {
            return <ColumnBlock block={block}/>
        }
        return null
    }
}

export default NotionBlock
