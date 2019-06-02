import React from 'react'
import styled from 'styled-components'
import { BlockNode } from '../../../api/types'
import StyleText from '../../styleText'
import WrapComponent from '../../wrapComponent'

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
        const properties = this.props.value.value.properties
        if (properties === undefined) {
            return null
        }
        return <Header>
            {
                properties.title!.map((it, idx) => {
                    const styleText = StyleText.fromRichText(it)
                    return (
                        <WrapComponent key={idx}>
                            {styleText}
                        </WrapComponent>
                    )
                })
            }
        </Header>
    }
}

export default HeaderBlock
