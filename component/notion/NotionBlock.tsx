import * as React from 'react'
import styled from "styled-components";
import {BlockNode} from "../../api/notion";
import BulletedListBlock from "./BulletedListBlock";
import CodeBlock from "./CodeBlock";
import CollectionViewBlock from "./CollectionViewBlock";
import ColumnBlock from "./ColumnBlock";
import ColumnListBlock from "./ColumnListBlock";
import DividerBlock from "./DividerBlock";
import HeaderBlock from "./HeaderBlock";
import ImageBlock from "./ImageBlock";
import QuoteBlock from "./QuoteBlock";
import SubHeaderBlock from "./SubHeaderBlock";
import TextBlock from "./TextBlock";
import VideoBlock from "./VideoBlock";

const Container = styled.div`
  width: 100%;
  line-height: 1.5;
  font-size: 16px;
  box-sizing: border-box;
  margin: 1px 0;
`;

interface IProps {
    block: BlockNode
}

interface IState {
}

class NotionBlock extends React.Component<IProps, IState> {
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
            return <BulletedListBlock value={block}/>;
        } else if (type === "column_list") {
            return <ColumnListBlock block={block}/>
        } else if (type === "column") {
            return <ColumnBlock block={block}/>
        }
        return null;
    }
}

export default NotionBlock