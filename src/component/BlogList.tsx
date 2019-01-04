import {AxiosResponse} from "axios";
import * as moment from 'moment';
import * as React from 'react'
import styled from "styled-components";
import {getDisplayBlockId, getRecordValues, IRecordValue, IRecordValues} from "../api/notion";
import * as NotionApi from "../api/notion";

const PostItem = styled.div`
    margin: 8px 0;
`;

const PubDate = styled.span`
   color:#666;
   margin-right: 2em;
`;

interface IProps {
    pageId: string
}

interface IState {
    data: IRecordValue[]
}

class BlogList extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            data: []
        }
    }

    public componentDidMount(): void {
        getRecordValues(this.props.pageId)
            .then((res: AxiosResponse<IRecordValues>) => {
                console.log(res);
                if (res.data.results !== undefined) {
                    this.loadList(res.data.results[0].value.content)
                }
            })
    }

    public render(): React.ReactNode {
        const list = this.state.data.map((it, idx) => {
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

    private loadList = (itemIds: string[]): void => {
        NotionApi.getRecordValues(...itemIds)
            .then((res: AxiosResponse<IRecordValues>) => {
                this.setState({
                    data: res.data.results
                })
            })
    }
}

export default BlogList