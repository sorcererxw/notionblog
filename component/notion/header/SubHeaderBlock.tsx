import * as React from 'react'
import styled from "styled-components";
import {BlockValue} from "../../../api/notion";

const Subheader = styled.h3`
   font-size: 24px;
   margin: 0;
`;

interface IProps {
    value: BlockValue
}

interface IState {
    _: undefined
}

class SubHeaderBlock extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        const properties = this.props.value.properties;
        if (properties === undefined) {
            return null;
        }
        return <Subheader>{properties.title}</Subheader>
    }
}

export default SubHeaderBlock