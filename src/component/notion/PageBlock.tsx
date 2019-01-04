import * as React from 'react';
import {IRecordValue, loadPageChunk} from "../../api/notion";
import BulletedListBlock from "./BulletedListBlock";
import CodeBlock from "./CodeBlock";
import CollectionViewBlock from "./CollectionViewBlock";
import DividerBlock from "./DividerBlock";
import HeaderBlock from "./HeaderBlock";
import ImageBlock from "./ImageBlock";
import NumberedListBlock from "./NumberedListBlock";
import PageHeaderBlock from "./PageHeaderBlock";
import QuoteBlock from "./QuoteBlock";
import SubHeaderBlock from "./SubHeaderBlock";
import TextBlock from "./TextBlock";
import VideoBlock from "./VideoBlock";

interface IProps {
    pageId: string
}

interface IState {
    data: IRecordValue[]
}

export default class PageBlock extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {data: []}
    }

    public componentDidMount(): void {
        this.loadPageData().then()
    }

    public render(): React.ReactNode {
        const content = [];
        for (let i = 0; i < this.state.data.length; i++) {
            const item = this.state.data[i];
            const type = item.value.type;
            if (i === 0) {
                content.push(<PageHeaderBlock key={i} value={item}/>)
            } else if (i === 1) {
                continue
            } else {
                if (type === 'text') {
                    content.push(<TextBlock key={i} value={item}/>)
                } else if (type === 'quote') {
                    content.push(<QuoteBlock key={i} value={item}/>)
                } else if (type === 'header') {
                    content.push(<HeaderBlock key={i} value={item}/>)
                } else if (type === 'sub_header') {
                    content.push(<SubHeaderBlock key={i} value={item}/>)
                } else if (type === 'image') {
                    content.push(<ImageBlock key={i} value={item}/>)
                } else if (type === 'code') {
                    content.push(<CodeBlock key={i} value={item}/>)
                } else if (type === "collection_view") {
                    content.push(<CollectionViewBlock key={i} value={item}/>)
                } else if (type === 'video') {
                    content.push(<VideoBlock value={item} key={i}/>)
                } else if (type === 'divider') {
                    content.push(<DividerBlock key={i}/>)
                } else if (type === 'bulleted_list') {
                    const list = [];
                    const originParent = item.value.parent_id;
                    for (; i < this.state.data.length; i++) {
                        const listItem = this.state.data[i];
                        if (listItem.value.type !== type
                            && listItem.value.parent_id === originParent) {
                            break
                        } else {
                            list.push(listItem);
                        }
                    }
                    content.push(<BulletedListBlock key={i} values={list}/>);
                    // content.push(<li key={i}>{properties.title}</li>)
                } else if (type === "numbered_list") {
                    const list = [];
                    for (; i < this.state.data.length; i++) {
                        const listItem = this.state.data[i];
                        if (listItem.value.type === 'numbered_list') {
                            list.push(listItem)
                        } else {
                            i--;
                            break
                        }
                    }
                    content.push(<NumberedListBlock key={i} values={list}/>);
                }
            }
        }
        return <div>{content}</div>;
    }


    private loadPageData = async () => {
        const pageId = this.props.pageId;
        const limit = 50;
        const result = [];
        let cursor = {stack: []};
        do {
            const pageChunk = (await Promise.resolve(loadPageChunk(pageId, limit, cursor))).data;
            for (const id in pageChunk.recordMap.block) {
                if (pageChunk.recordMap.block.hasOwnProperty(id)) {
                    const item = pageChunk.recordMap.block[id];
                    if (item.value.alive) {
                        result.push(item)
                    }
                }
            }
            cursor = pageChunk.cursor;
        } while (cursor.stack.length > 0);
        console.log(result);
        this.setState({
            data: result
        })
    }
}