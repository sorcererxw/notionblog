import * as React from 'react';
import styled from "styled-components";
import '../style/index.css';
import AppLayout from "../component/AppLayout";
import {getDisplayBlockId, Collection, loadTable, BlockValue} from "../api/notion";
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
    data: BlockValue[],
    table: Collection
}

interface IState {
}

const PostLink = (props: { page: string, title: string }) => (
    <a href={`/post/${props.page}`}> {props.title}</a>
);

class Index extends React.Component<IProps, IState> {
    static async getInitialProps() {
        const table = await loadTable(blogConfig.blog_table_id, blogConfig.blog_table_view_id);
        const data = table.result.blockIds
            .map(id => table.recordMap.block[id])
            .filter(it => it.value !== undefined
                && it.value.properties !== undefined
                && it.value.properties["{JfZ"] !== undefined
                && it.value.properties["{JfZ"].length > 0)
            .map(it=>it.value);

        return {
            table: table,
            data: data
        }
    }

    public render(): React.ReactNode {
        console.log(this.props.table);
        console.log(this.props.data);
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
            if (it.properties === undefined) {
                return null
            }
            const date = moment(it.created_time).format("YYYY-MM-DD");
            return <PostItem key={idx}>
                <PubDate>{date}</PubDate>
                <PostLink page={getDisplayBlockId(it.id)} title={it.properties.title[0]}/>
            </PostItem>
        });

        return (
            <div>{list}</div>
        );
    }

}

export default Index;
