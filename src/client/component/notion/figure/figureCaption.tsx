import React from 'react'
import styled from 'styled-components'
import StyleText from '../../styleText'
import WrapComponent from '../../wrapComponent'

const Caption = styled.figcaption`
  line-height: 1.4;
  opacity: 0.68;
  color: var(--caption-color);
  margin-top: 8px;
  font-size: 14px;
`

interface IProps {
    caption: any[]
}

class FigureCaption extends React.Component<IProps> {
    constructor(props: any) {
        super(props)
    }

    public render(): React.ReactNode {
        return <Caption>
            {this.props.caption.map((it, idx) => {
                const styleText = StyleText.fromRichText(it)
                return <WrapComponent key={idx}>{styleText}</WrapComponent>
            })}
        </Caption>
    }
}

export default FigureCaption
