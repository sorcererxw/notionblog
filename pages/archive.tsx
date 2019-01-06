import * as React from 'react';
import styled from "styled-components";
import '../style/index.css';
import {
    getDisplayBlockId,
    getRecordValues,
    IRecordValue
} from "./api/notion";
import * as moment from 'moment';

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
    data: IRecordValue[]
}

interface IState {
}

const pageId = "ba8f1c3a528043a995c3149cefff4c18";

class Archive extends React.Component<IProps, IState> {
    static async getInitialProps() {
        const response = await getRecordValues(pageId);
        console.log(response);
        if (response === undefined || response.results === undefined) return {data: []};
        const content = response.results[0].value.content;
        const contentRes = await getRecordValues(...content);
        return {
            data: contentRes.results
        }
    }

    public render(): React.ReactNode {

        return (
            <Content>
                <Panel>
                    {this.renderList()}
                </Panel>
            </Content>
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
                <a href={`/post/${getDisplayBlockId(it.value.id)}`}>{it.value.properties.title}</a>
            </PostItem>
        });

        return (
            <div>{list}</div>
        );
    }

}

export default Archive;
