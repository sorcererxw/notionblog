import React from 'react'
import styled from 'styled-components'
import { BlockValue } from '../../../api/types'

const SubSubheader = styled.h4`
   font-size: 18px;
   margin: 6px 0 0;
`

interface Props {
    value: BlockValue
}

class SubSubHeaderBlock extends React.Component<Props, {}> {
    constructor(props: any) {
        super(props)
    }

    public render(): React.ReactNode {
        const properties = this.props.value.properties
        if (properties === undefined) {
            return null
        }
        return <SubSubheader>{properties.title}</SubSubheader>
    }
}

export default SubSubHeaderBlock
