import * as React from 'react'
import styled from "styled-components";
import {BlockValue} from "../../../api/types";

const Subheader = styled.h3`
   font-size: 22px;
   margin: 0;
   margin-top: 8px;
`;

interface Props {
    value: BlockValue
}

interface State {
}

class SubHeaderBlock extends React.Component<Props, State> {
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