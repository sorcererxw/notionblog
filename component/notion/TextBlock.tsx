import * as React from 'react'
import {BlockNode} from "../../api/notion";
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
                const value = it[0];
                const textProperties = it[1];

                let bold = false;
                let italic = false;
                let highlight = false;
                let deleted = false;
                let link = null;

                if (textProperties !== undefined) {
                    for (const p of textProperties) {
                        if (p[0] === 'b') {
                            bold = true;
                        } else if (p[0] === 'i') {
                            italic = true;
                        } else if (p[0] === 'c') {
                            highlight = true;
                        } else if (p[0] === 'a') {
                            link = p[1];
                        } else if (p[0] === 's') {
                            deleted = true;
                        }
                    }
                }
                return <StyleText
                    key={idx}
                    bold={bold}
                    deleted={deleted}
                    highlight={highlight}
                    italic={italic}
                    link={link}
                    text={value}/>
            })
        }
        </div>
    }
}

export default TextBlock