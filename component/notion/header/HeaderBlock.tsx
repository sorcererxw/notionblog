import * as React from 'react'
import styled from "styled-components";
import {BlockNode} from "../../../api/types";

const Header = styled.h2`
  font-size: 32px;
  margin: 0;
  margin-top: 32px;
`;

interface Props {
    value: BlockNode
}

interface State {
}

class HeaderBlock extends React.Component<Props, State> {
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