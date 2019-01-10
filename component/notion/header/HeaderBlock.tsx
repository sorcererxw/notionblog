import * as React from 'react'
import styled from "styled-components";
import {BlockNode} from "../../../api/notion";

const Header = styled.h2`
  font-size: 32px;
  margin: 0;
`;

interface IProps {
    value: BlockNode
}

interface IState {
    _: undefined
}

class HeaderBlock extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        const properties = this.props.value.value.properties;
        if (properties === undefined) {
            return null;
        }
        return <Header>{properties.title}</Header>
    }
}

export default HeaderBlock