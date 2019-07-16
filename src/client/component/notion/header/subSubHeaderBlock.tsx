import React from 'react'
import styled from 'styled-components'
import { BlockNode } from '../../../api/types'
import TextBlock from '../textBlock'

const Header = styled.h4`
   font-size: 18px;
   margin: 6px 0 0;
`

interface Props {
    value: BlockNode
}

class SubSubHeaderBlock extends React.Component<Props> {
    public render(): React.ReactNode {
        return <Header><TextBlock value={this.props.value}/></Header>
    }
}

export default SubSubHeaderBlock
