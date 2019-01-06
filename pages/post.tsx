import * as React from 'react';
import styled from "styled-components";
import {getRecordValues} from "./api/notion";
import PageBlock from "../component/notion/PageBlock";

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
    match: {
        params: {
            page: string
        }
    }
}

interface IState {
    coverUrl: string,
    hasCover: boolean,
    pageCoverPosition: number
}

export default class Post extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            coverUrl: "",
            hasCover: false,
            pageCoverPosition: 0
        }
    }

    public componentDidMount(): void {
        this.loadPageInfo().then()
    }

    public render(): React.ReactNode {
        const coverImage = this.state.hasCover ?
            <CoverImage
                src={this.state.coverUrl}
            /> : null;
        return <Content>
            {coverImage}
            <PageBlock pageId={this.props.match.params.page}/>
        </Content>
    }

    private loadPageInfo = async () => {
        const record = (await getRecordValues(this.props.match.params.page)).data.results[0].value;
        const format = record.format;
        if (format !== undefined && format.page_cover !== undefined && format.page_cover.length > 0) {
            this.setState({
                coverUrl: this.getRealImageUrl(format.page_cover),
                hasCover: true,
                pageCoverPosition: format.page_cover_position === undefined ? 0 : format.page_cover_position
            })
        }
    };

    private getRealImageUrl = (url: string): string => {
        if (url.startsWith("/")) {
            return "https://www.notion.so" + url;
        } else {
            return url;
        }
    }
}