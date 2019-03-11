import * as React from 'react';
import styled from "styled-components";
import {ArticleMeta} from "../api/types";
import AppLayout from "../component/AppLayout";
import ArchiveItem from "../component/ArchiveItem";
import MetaHead from "../component/MetaHead";

import * as moment from "moment";

const Content = styled.div`
  width: 768px;
  max-width: 90%;
  margin: auto;
`;

const YearHeader = styled.div`
  color: var(--head-color);
  font-weight: 700;
  font-size: 32px;
  margin-top: 48px;
`;

interface Props {
    data: ArticleMeta[],
}

interface State {
    data: ArticleMeta[],
}

class Blog extends React.Component<Props, State> {
    static async getInitialProps({query}) {
        return {
            data: query.posts
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    async componentDidMount(): Promise<void> {
        this.setState({
            data: this.props.data
        })
    }

    public render(): React.ReactNode {
        return (
            <div>
                <MetaHead/>
                <AppLayout>
                    <Content>
                        {this.renderList()}
                    </Content>
                </AppLayout>
            </div>
        );
    }


    private renderList(): React.ReactNode {
        const list: React.ReactNode[] = [];
        let lastYear = 3000;
        let key = 0;

        this.state.data.forEach(it => {
            const year = moment.unix(it.date).year();
            if (year !== lastYear) {
                list.push(<YearHeader key={key++}>{year}</YearHeader>);
                lastYear = year;
            }
            list.push(<ArchiveItem meta={it} key={key++}/>)
        });

        return (
            <div>{list}</div>
        );
    }

}

export default Blog;
