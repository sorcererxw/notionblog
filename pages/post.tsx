import * as React from 'react';
import styled from "styled-components";
import {Article} from "../api/types";
import AppLayout from "../component/AppLayout";
import MetaHead from "../component/MetaHead";
import NotionBlockList from "../component/notion/base/NotionBlockList";
import PageHeaderBlock from "../component/notion/PageHeaderBlock";
import {DiscussionEmbed} from 'disqus-react';

import * as blogConfig from '../config';

const Content = styled.div`
  width: 768px;
  max-width: 90%;
  margin: auto;
  display: flex;
  flex-direction: column;
`;

const CoverImage = styled.img`
  width: 100%;
  border-width: 0;
  border-radius: 4px;
  height: 30vh;
  object-fit: cover;
  object-position: center 0;
`;

const Comment = styled.div`
  margin-top: 40px;
`;

interface Props {
    blockQuery: string,
    article: Article
}

interface State {
    article: Article
}

export default class Post extends React.Component<Props, State> {
    static async getInitialProps({query}) {
        const pageId = query.block;
        const article = query.article;
        return {
            blockQuery: pageId,
            article: article
        }
    }

    constructor(props: any) {
        super(props);
        this.state = {
            article: undefined
        }
    }

    componentDidMount(): void {
        this.setState({
            article: this.props.article
        })
    }

    public render(): React.ReactNode {
        const article = this.state.article;

        if (article === undefined) {
            return <div>
                <MetaHead/>
                <AppLayout>
                </AppLayout>
            </div>
        }

        return <div>
            <MetaHead title={article.meta.title}/>
            <AppLayout>
                <Content>
                    {this.renderCover(article)}
                    {Post.renderTitle(article)}
                    {Post.renderPage(article)}
                    {Post.renderComment(article)}
                </Content>
            </AppLayout>
        </div>
    }

    private renderCover(article: Article): React.ReactNode {
        const format = article.meta.cover;
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
        const pageCoverPosition = format.page_cover_position === undefined ? -1 : format.page_cover_position;
        if (pageCoverPosition >= 0) {
            return <CoverImage src={coverUrl} style={{
                objectPosition: `center ${(1 - pageCoverPosition) * 100}%`
            }}/>
        }
        return <CoverImage src={coverUrl}/>
    }

    private static renderTitle(article: Article): React.ReactNode {
        return <PageHeaderBlock title={article.meta.title} pubDate={article.meta.date}/>
    }

    private static renderPage(article: Article): React.ReactNode {
        const blockData = article.blocks;
        return <div><NotionBlockList blocks={blockData}/></div>;
    }

    private static renderComment(article: Article): React.ReactNode {
        if (blogConfig.disqusConfig.enable == false) {
            return <div/>
        }

        const name = article.meta.name;
        const title = article.meta.title;
        const shortName = blogConfig.disqusConfig.shortName;
        const disqusConfig = {
            url: `https://blog.sorcererxw.com/post/${name}`,
            identifier: name,
            title: title,
        };

        return <Comment>
            <DiscussionEmbed shortname={shortName} config={disqusConfig}/>
        </Comment>

    }
}