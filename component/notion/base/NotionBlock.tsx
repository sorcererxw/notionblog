import * as React from 'react'
import styled from "styled-components";
import {BlockNode} from "../../../api/notion";
import BulletedListBlock from "../list/BulletedListBlock";
import CodeBlock from "../CodeBlock";
import CollectionViewBlock from "../CollectionViewBlock";
import ColumnBlock from "../column/ColumnBlock";
import ColumnListBlock from "../column/ColumnListBlock";
import DividerBlock from "../DividerBlock";
import HeaderBlock from "../header/HeaderBlock";
import ImageBlock from "../figure/ImageBlock";
import NumberedListBlock from "../list/NumberedListBlock";
import QuoteBlock from "../QuoteBlock";
import SubHeaderBlock from "../header/SubHeaderBlock";
import TextBlock from "../TextBlock";
import VideoBlock from "../figure/VideoBlock";

const Container = styled.div`
  color: rgb(55, 53, 47);
  width: 100%;
  max-width: 100%;
  line-height: 1.5;
  font-size: 18px;
  margin: 1px 0;
  padding-top: 16px;
  box-sizing: border-box;
  display: block;
`;

interface IProps {
    block: BlockNode,
    indexOfSameType: number
}

interface IState {
}

class NotionBlock extends React.Component<IProps, IState> {
    static defaultProps = {
        indexOfSameType: 1
    };

    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        return <Container>{this.renderBlock()}</Container>
    }

    private renderBlock(): React.ReactNode {
        const block = this.props.block;
        const type = block.value.type;
        if (type === 'text') {
            return <TextBlock value={block}/>
        } else if (type === 'quote') {
            return <QuoteBlock value={block}/>
        } else if (type === 'header') {
            return <HeaderBlock value={block}/>
        } else if (type === 'sub_header') {
            return <SubHeaderBlock value={block.value}/>
        } else if (type === 'image') {
            return <ImageBlock value={block.value}/>
        } else if (type === 'code') {
            return <CodeBlock value={block.value}/>
        } else if (type === "collection_view") {
            return <CollectionViewBlock value={block.value}/>
        } else if (type === 'video') {
            return <VideoBlock value={block.value}/>
        } else if (type === 'divider') {
            return <DividerBlock/>
        } else if (type === 'bulleted_list') {
            return <BulletedListBlock value={block}/>;
        } else if (type === "numbered_list") {
            return <NumberedListBlock index={this.props.indexOfSameType} value={block}/>;
        } else if (type === "column_list") {
            return <ColumnListBlock block={block}/>
        } else if (type === "column") {
            return <ColumnBlock block={block}/>
        }
        return null;
    }
}

export default NotionBlock