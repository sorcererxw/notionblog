import React from 'react'
import styled from 'styled-components'
import { BlockNode } from '../../api/types'
import TextBlock from './TextBlock'

const Container = styled.div`
`

const Quote = styled.blockquote`
  border-left: 3px solid rgb(55, 53, 47);
  margin: 0 0;
  padding: 1px 1em;

`

interface IProps {
    value: BlockNode
}

class QuoteBlock extends React.Component<IProps, {}> {
    constructor(props: any) {
        super(props)
    }

    public render(): React.ReactNode {
        return <Container>
            <Quote>
                <TextBlock value={this.props.value}/>
            </Quote>
        </Container>
    }
}

export default QuoteBlock
