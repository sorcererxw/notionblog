import * as React from 'react';
import styled from "styled-components";
import '../style/index.css';
import AppLayout from "../component/AppLayout";
import {getDisplayBlockId, RecordValue, loadFullPageChunk} from "../api/notion";
import * as moment from 'moment';
import blogConfig from '../blog.config'
import MetaHead from "../component/MetaHead";

const Content = styled.div`
  width: 768px;
  max-width: 90%;
  margin: auto;
`;

const Panel = styled.div`
  margin: 3em 0;
`;

const PostItem = styled.div`
    margin: 8px 0;
`;

const PubDate = styled.span`
   color:#666;
   margin-right: 2em;
`;

interface IProps {
    data: RecordValue[]
}

interface IState {
}

const PostLink = (props: { page: string, title: string }) => (
    <a href={`/post/${props.page}`}> {props.title}</a>
);

class Index extends React.Component<IProps, IState> {
    static async getInitialProps() {
        const list = await loadFullPageChunk(blogConfig.blog_archive_page_id);
        return {
            data: list.filter((it) => it.value.type === 'page').slice(1)
        }
    }

    public render(): React.ReactNode {

        return (
            <div>
                <MetaHead/>
                <AppLayout>
                    <Content>
                        <Panel>
                            {this.renderList()}
                        </Panel>
                    </Content>
                </AppLayout>
            </div>
        );
    }


    private renderList(): React.ReactNode {
        const list = this.props.data.map((it, idx) => {
            if (it.value.properties === undefined) {
                return null
            }
            const date = moment(it.value.created_time).format("YYYY-MM-DD");
            return <PostItem key={idx}>
                <PubDate>{date}</PubDate>
                <PostLink page={getDisplayBlockId(it.value.id)} title={it.value.properties.title[0]}/>
            </PostItem>
        });

        return (
            <div>{list}</div>
        );
    }

}

export default Index;
