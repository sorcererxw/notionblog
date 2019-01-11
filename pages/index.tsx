import * as React from 'react';
import styled from "styled-components";
import '../style/index.css';
import AppLayout from "../component/AppLayout";
import {
    getDisplayBlockId,
    BlockValue,
    loadTablePageBlocks,
    SchemeValue, RecordValue, getDate, getTags
} from "../api/notion";
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
    margin: 36px 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
`;

const ItemTitleBar = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    max-width: 100%;
    box-sizing: border-box;
`;

const ItemTagBar = styled.div`
  margin-top: 4px;
  display: flex;
  flex-direction: row;
`;

const Tag = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 8px;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  text-align: center;
  color:rgb(187, 187, 187);
  align-self: baseline;
`;

const PubDate = styled.span`
   color:rgb(187, 187, 187);
   font-size: 18px;
   font-weight: 500;
`;

interface IProps {
    data: BlockValue[],
    scheme: SchemeValue[]
}

interface IState {
    data: BlockValue[],
    scheme: SchemeValue[]
}

const PostLink = (props: { page: string, title: string }) => (
    <ItemTitle href={`/post/${props.page}`}> {props.title}</ItemTitle>
);

class Index extends React.Component<IProps, IState> {
    static async getInitialProps() {
        const result = await loadTablePageBlocks(blogConfig.blog_table_page_id, blogConfig.blog_table_view_id);
        let collection: RecordValue;
        for (let key in result.recordMap.collection) {
            collection = result.recordMap.collection[key];
            break;
        }
        return {
            scheme: collection.value.schema,
            data: result.result.blockIds.map(it => result.recordMap.block[it].value)
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            scheme: []
        }
    }

    async componentDidMount(): Promise<void> {
        const result = await loadTablePageBlocks(blogConfig.blog_table_page_id, blogConfig.blog_table_view_id);
        let collection: RecordValue;
        for (let key in result.recordMap.collection) {
            collection = result.recordMap.collection[key];
            break;
        }
        const schemes = [];
        for (let key in collection.value.schema) {
            schemes.push(collection.value.schema[key])
        }
        this.setState({
            data: result.result.blockIds.map(it => result.recordMap.block[it].value),
            scheme: schemes
        });
    }

    public render(): React.ReactNode {
        console.log(this.props.data);
        console.log(this.props.scheme);
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
            const properties = it.properties;
            if (properties === undefined) {
                return null
            }
            let date = getDate(it);

            const titleBar = <ItemTitleBar>
                <PostLink page={getDisplayBlockId(it.id)} title={it.properties.title[0]}/>
                <div style={{flex: 1}}/>
                <PubDate>{date}</PubDate>
            </ItemTitleBar>;

            let tagBar = null;
            const tagItems = getTags(it);
            if (tagItems.length > 0) {
                tagBar = <ItemTagBar>
                    {tagItems.map((v, k) => <Tag key={k}>{v}</Tag>)}
                </ItemTagBar>;
            }

            return <PostItem key={idx}>
                {titleBar}
                {tagBar}
            </PostItem>
        });

        return (
            <div>{list}</div>
        );
    }

}

export default Index;
