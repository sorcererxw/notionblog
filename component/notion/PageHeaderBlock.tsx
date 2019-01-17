import * as moment from "moment";
import * as React from 'react'
import styled from "styled-components";

const Container = styled.div`
  margin:16px 0;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 40px;
  margin: 0 0 4px;
`;

const MetaContainer = styled.div`
  margin: 4px 0;
`;

const PubDate = styled.div`
  font-size: 16px;
  color: rgb(187, 187, 187);
  font-weight: 600;
  line-height: 1.2;
`;

interface IProps {
    title: string,
    pubDate: number
}

interface IState {
}

export default class PageHeaderBlock extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        const pubData = moment.unix(this.props.pubDate).format("MMM DD, YYYY");
        return <Container>
            <Title>{this.props.title}</Title>
            <MetaContainer>
                <PubDate>{pubData}</PubDate>
            </MetaContainer>
        </Container>
    }
}

