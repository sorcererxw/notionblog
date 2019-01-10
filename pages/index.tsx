import * as React from 'react';
import styled from "styled-components";
import '../style/index.css';
import AppLayout from "../component/AppLayout";
import {getDisplayBlockId, Collection, loadTable, BlockValue, loadTablePageBlocks} from "../api/notion";
import * as moment from 'moment';
import blogConfig from '../blog.config'
import MetaHead from "../component/MetaHead";

const Content = styled.div`
  width: 768px;
  max-width: 90%;
  margin: auto;
`;

const ItemTitle = styled.a`
  font-weight: 600;
  font-size: 18px;
  max-width: 50%;
  text-decoration-line: none;
`;

const Panel = styled.div`
  margin: 3em 0;
`;

const PostItem = styled.div`
    margin: 16px 0;
    display: flex;
    flex-direction: row;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
`;

const PubDate = styled.span`
   color:rgb(187, 187, 187);
   font-size: 18px;
   font-weight: 500;
`;

interface IProps {
    data: BlockValue[],
    table: Collection
}

interface IState {
}

const PostLink = (props: { page: string, title: string }) => (
    <ItemTitle href={`/post/${props.page}`}> {props.title}</ItemTitle>
);

class Index extends React.Component<IProps, IState> {
    static async getInitialProps() {
        const table = await loadTable(blogConfig.blog_table_page_id, blogConfig.blog_table_view_id);
        const data = await loadTablePageBlocks(blogConfig.blog_table_page_id, blogConfig.blog_table_view_id);

        return {
            table: table,
            data: data.map(it => it.value)
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
            const date = moment(it.created_time).format("MMM DD, YYYY");
            return <PostItem key={idx}>
                <PostLink page={getDisplayBlockId(it.id)} title={it.properties.title[0]}/>
                <div style={{flex: 1}}/>
                <PubDate>{date}</PubDate>
            </PostItem>
        });

        return (
            <div>{list}</div>
        );
    }

}

export default Index;
