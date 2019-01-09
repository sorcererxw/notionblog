import * as React from 'react'
import {BlockValue} from "../../api/notion";

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
        return <h3>{properties.title}</h3>
    }
}

export default SubHeaderBlock