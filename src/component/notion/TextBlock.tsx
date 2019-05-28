import * as React from 'react'
import {BlockNode} from "../../notion/type";
import StyleText from "../StyleText";

interface IProps {
    value: BlockNode
}

interface IState {
    _: undefined
}

class TextBlock extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        const block = this.props.value;
        const properties = block.value.properties;
        if (properties === undefined || properties.title === undefined) {
            return null;
        }
        return <div>{
            properties.title.map((it, idx) => {
                const styleText = StyleText.fromRichText(it);
                styleText.key = idx;
                return styleText;
            })
        }
        </div>
    }
}

export default TextBlock
