import React from 'react'
import { BlockNode } from '../../api/types'
import StyleText from '../styleText'
import WrapComponent from '../wrapComponent'

interface IProps {
  value: BlockNode
}

class TextBlock extends React.Component<IProps, {}> {
  constructor(props: any) {
    super(props)
  }

  public render(): React.ReactNode {
    const block = this.props.value
    const properties = block.value.properties
    if (properties === undefined || properties.title === undefined) {
      return null
    }
    return (
      <div>
        {properties.title.map((it, idx) => {
          const styleText = StyleText.fromRichText(it)
          return <WrapComponent key={idx}>{styleText}</WrapComponent>
        })}
      </div>
    )
  }
}

export default TextBlock
