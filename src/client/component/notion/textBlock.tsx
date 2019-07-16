import React from 'react'
import StyleText from '../styleText'
import WrapComponent from '../wrapComponent'
import { TextBlockValue } from 'notink/dist/types/types'

interface IProps {
    value: TextBlockValue
}

class TextBlock extends React.Component<IProps> {
    constructor(props: any) {
        super(props)
    }

    public render(): React.ReactNode {
        const block = this.props.value
        const properties = block.properties
        if (properties === undefined || properties.title === undefined) {
            return null
        }
        return <div>{
            properties.title.map((it, idx) => {
                const styleText = StyleText.fromRichText(it)
                return (
                    <WrapComponent key={idx}>
                        {styleText}
                    </WrapComponent>
                )
            })
        }
        </div>
    }
}

export default TextBlock
