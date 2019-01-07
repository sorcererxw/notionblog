import * as React from 'react';
import styled from "styled-components";
import AppLayout from "../component/AppLayout";
import BulletedListBlock from "../component/notion/BulletedListBlock";
import CodeBlock from "../component/notion/CodeBlock";
import CollectionViewBlock from "../component/notion/CollectionViewBlock";
import DividerBlock from "../component/notion/DividerBlock";
import HeaderBlock from "../component/notion/HeaderBlock";
import ImageBlock from "../component/notion/ImageBlock";
import NumberedListBlock from "../component/notion/NumberedListBlock";
import PageHeaderBlock from "../component/notion/PageHeaderBlock";
import QuoteBlock from "../component/notion/QuoteBlock";
import SubHeaderBlock from "../component/notion/SubHeaderBlock";
import TextBlock from "../component/notion/TextBlock";
import VideoBlock from "../component/notion/VideoBlock";
import {IRecordValue, loadFullPageChunk} from "./api/notion";

const Content = styled.div`
  width: 768px;
  max-width: 90%;
  margin: auto;
`;

const CoverImage = styled.img`
  width: 100%;
  height: 30vh;
  object-fit: cover;
  object-position: center 0;
`;

interface IProps {
    data: IRecordValue[]
}

interface IState {

}

export default class Post extends React.Component<IProps, IState> {
    static async getInitialProps({query}) {
        const pageId = query.block;
        return {
            data: await loadFullPageChunk(pageId)
        }
    }

    constructor(props: any) {
        super(props);
        this.state = {
            coverUrl: "",
            hasCover: false,
            pageCoverPosition: 0
        }
    }

    public render(): React.ReactNode {
        return <AppLayout>
            <Content>
                {this.renderCover()}
                {this.renderPage()}
            </Content>
        </AppLayout>
    }

    private renderCover(): React.ReactNode {
        const data = this.props.data;
        if (data === undefined || data == null || data.length === 0) {
            return null;
        }
        const item = data[0];
        const format = item.value.format;
        if (format === undefined || format.page_cover === undefined || format.page_cover.length === 0) {
            return null;
        }
        const getRealImageUrl = (url: string): string => {
            if (url.startsWith("/")) {
                return "https://www.notion.so" + url;
            } else {
                return url;
            }
        };

        const coverUrl = getRealImageUrl(format.page_cover);
        // const pageCoverPosition = format.page_cover_position === undefined ? 0 : format.page_cover_position;
        return <CoverImage src={coverUrl}/>
    }

    public renderPage(): React.ReactNode {
        const blockData = this.props.data;
        const content = [];
        for (let i = 0; i < blockData.length; i++) {
            const item = blockData[i];
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
                    for (; i < blockData.length; i++) {
                        const listItem = blockData[i];
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
                    for (; i < blockData.length; i++) {
                        const listItem = blockData[i];
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

}