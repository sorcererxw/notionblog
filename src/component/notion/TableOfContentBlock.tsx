import * as React from 'react'
import {BlockValue} from "../../notion/type";

interface IProps {
    value: BlockValue
}

interface IState {
    _: undefined
}

class TableOfContentBlock extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        return null
    }
}

export default TableOfContentBlock
