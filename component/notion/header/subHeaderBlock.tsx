import React from 'react'
import styled from 'styled-components'
import { BlockValue } from '../../../api/types'

const Subheader = styled.h3`
  font-size: 24px;
  margin: 8px 0 0;
`

interface Props {
  value: BlockValue
}

class SubHeaderBlock extends React.Component<Props, {}> {
  constructor(props: any) {
    super(props)
  }

  public render(): React.ReactNode {
    const properties = this.props.value.properties
    if (properties === undefined) {
      return null
    }
    return <Subheader>{properties.title}</Subheader>
  }
}

export default SubHeaderBlock
