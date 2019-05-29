import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  height: 13px;
  width: 100%;
  display: flex;
  justify-items: center;
  align-items: center;
`

const Divider = styled.div`
  border-width: 0;
  border-top-width: 1px;
  border-color: rgba(55, 53, 47, 0.09);
  border-style: solid;
  width: 100%;
`

class DividerBlock extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props)
    }

    public render(): React.ReactNode {
        return <Container>
            <Divider/>
        </Container>
    }
}

export default DividerBlock
