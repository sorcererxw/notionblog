import * as moment from 'moment';
import * as React from 'react'
import styled from "styled-components";
import {BlockValue} from "../../api/notion";

const Container = styled.div`
  margin:32px 0;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  margin: 0 0 4px;
`;

const PubDate = styled.div`
  font-size: 0.8em;
  opacity: 0.8;
`;

interface IProps {
    value: BlockValue
}

interface IState {
    _: undefined
}

export default class PageHeaderBlock extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        const properties = this.props.value.properties;
        if (properties === undefined) {
            return null;
        }
        const pubData = moment(this.props.value.created_time).format("YYYY-MM-DD");
        return <Container>
            <Title>{properties.title}</Title>
            <PubDate>{pubData}</PubDate>
        </Container>
    }
}

