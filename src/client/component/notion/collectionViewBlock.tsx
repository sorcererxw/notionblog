import React from 'react'
import { CollectionViewBlockValue } from 'notink/dist/types/types'

interface IProps {
    value: CollectionViewBlockValue
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
