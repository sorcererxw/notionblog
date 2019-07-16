import React from 'react'
import styled from 'styled-components'
import { BlockNode } from '../../../api/types'
import TextBlock from '../textBlock'

const Header = styled.h2`
  font-size: 32px;
  margin: 32px 0 0;
`

interface Props {
    value: BlockNode
}

class HeaderBlock extends React.Component<Props> {
    constructor(props: any) {
        super(props)
    }

    public render(): React.ReactNode {
        return <Header><TextBlock value={this.props.value}/></Header>
    }
}

export default HeaderBlock
