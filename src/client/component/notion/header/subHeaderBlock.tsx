import React from 'react'
import styled from 'styled-components'
import { BlockNode } from '../../../api/types'
import TextBlock from '../textBlock'

const Header = styled.h3`
   font-size: 24px;
   margin: 8px 0 0;
`

interface Props {
    value: BlockNode
}

class SubHeaderBlock extends React.Component<Props> {
    constructor(props: any) {
        super(props)
    }

    public render(): React.ReactNode {
        return <Header><TextBlock value={this.props.value}/></Header>
    }
}

export default SubHeaderBlock
