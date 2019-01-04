import * as React from 'react'
import {IRecordValue} from "../../api/notion";

interface IProps {
    value: IRecordValue
}

interface IState {
    _: undefined
}

class SubHeaderBlock extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        const properties = this.props.value.value.properties;
        if (properties === undefined) {
            return null;
        }
        return <h3>{properties.title}</h3>
    }
}

export default SubHeaderBlock