import React from 'react'
import { BlockValue } from '../../api/types'

interface IProps {
    value: BlockValue
}

interface IState {
    _: undefined
}

export default class CollectionViewBlock extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props)
    }

    public render(): React.ReactNode {
        return <div>collection</div>
    }
}
