import * as React from 'react';
import styled from "styled-components";
import AppLayout from "../component/AppLayout";
import MetaHead from "../component/MetaHead";
import NotionBlockList from "../component/notion/base/NotionBlockList";
import PageHeaderBlock from "../component/notion/PageHeaderBlock";
import {loadFullPageChunk, recordListToTree, BlockNode} from "../api/notion";
import Disqus from 'disqus-react';

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
    data: BlockNode[]
}

interface IState {
}

export default class Post extends React.Component<IProps, IState> {
    static async getInitialProps({query}) {
        const pageId = query.block;
        return {
            data: recordListToTree(await loadFullPageChunk(pageId))
        }
    }

    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        console.log(this.props.data);
        return <div>
            <MetaHead title={this.getTitle()}/>
            <AppLayout>
                <Content>
                    {this.renderCover()}
                    {this.renderTitle()}
                    {this.renderPage()}
                </Content>
            </AppLayout>
        </div>

    }

    private getTitle(): string {
        const properties = this.props.data[0].value.properties;
        return properties.title[0]
    }

    private renderCover(): React.ReactNode {
        const data = this.props.data[0];
        if (data === undefined || data == null) {
            return null;
        }
        const item = data.value;
        const format = item.format;
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

    private renderTitle(): React.ReactNode {
        const titleBlock = this.props.data[0].value;
        return <PageHeaderBlock value={titleBlock}/>
    }

    private renderPage(): React.ReactNode {
        const blockData = this.props.data[0].children;
        return <div><NotionBlockList blocks={blockData}/></div>;
    }

    private renderComment(): React.ReactNode {
        const shortName = "";
        const config = {};
        return <div>
            <Disqus.CommentCount
                shortname={shortName}
                config={config}>
                Comments
            </Disqus.CommentCount>
            <Disqus.DiscussionEmbed
                shortname={shortName}
                config={config}/>
        </div>
    }
}