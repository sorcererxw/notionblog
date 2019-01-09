import * as React from 'react'
import {BlockNode} from "../../api/notion";

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
        return <h2>{properties.title}</h2>
    }
}

export default HeaderBlock