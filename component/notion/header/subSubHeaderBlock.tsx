import React from 'react'
import styled from 'styled-components'
import { BlockNode } from '../../../api/types'
import StyleText from '../../styleText'
import WrapComponent from '../../wrapComponent'

const Header = styled.h4`
   font-size: 18px;
   margin: 6px 0 0;
`

interface Props {
    value: BlockNode
}

class SubSubHeaderBlock extends React.Component<Props> {
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

export default SubSubHeaderBlock
