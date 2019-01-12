import * as React from 'react';
import styled from "styled-components";
import '../style/index.css';
import AppLayout from "../component/AppLayout";
import {
    BlockValue,
    loadTablePageBlocks,
    SchemeValue, RecordValue
} from "../api/notion";
import blogConfig from '../blog.config'
import ArchiveItem from "../component/ArchiveItem";
import MetaHead from "../component/MetaHead";

const Content = styled.div`
  width: 768px;
  max-width: 90%;
  margin: auto;
`;

const Panel = styled.div`
  margin: 3em 0;
`;

interface IProps {
    data: BlockValue[],
    scheme: SchemeValue[]
}

interface IState {
    data: BlockValue[],
    scheme: SchemeValue[]
}

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
        // const result = await loadTablePageBlocks(blogConfig.blog_table_page_id, blogConfig.blog_table_view_id);
        // let collection: RecordValue;
        // for (let key in result.recordMap.collection) {
        //     collection = result.recordMap.collection[key];
        //     break;
        // }
        // const schemes = [];
        // for (let key in collection.value.schema) {
        //     schemes.push(collection.value.schema[key])
        // }
        // this.setState({
        //     data: result.result.blockIds.map(it => result.recordMap.block[it].value),
        //     scheme: schemes
        // });
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
            return <ArchiveItem blockValue={it} key={idx}/>
        });

        return (
            <div>{list}</div>
        );
    }

}

export default Index;
