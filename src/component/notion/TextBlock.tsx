import * as React from 'react'
import styled from "styled-components";
import {IRecordValue} from "../../api/notion";

const Bold = styled.strong`
`;

const Italic = styled.i`
`;

const Highlight = styled.code`
  background:#d7d9db;
  line-height: normal;
  font-size: 0.95em;
  padding: 0 0.4em;
  border-radius: 3px; 
`;

const Link = styled.a`
  color: inherit;
`;

const Deleted = styled.del`
`;

interface IProps {
    value: IRecordValue
}

interface IState {
    _: undefined
}

class TextBlock extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        const properties = this.props.value.value.properties;
        if (properties === undefined) {
            return null;
        }
        if (properties.title === undefined) {
            return null;
        }
        return <p>{
            properties.title.map((it, idx) => {
                const value = it[0];
                const textProperties = it[1];

                let element = <span>{value}</span>;

                if (textProperties !== undefined) {
                    for (const p of textProperties) {
                        if (p[0] === 'b') {
                            element = <Bold>{element}</Bold>
                        } else if (p[0] === 'i') {
                            element = <Italic>{element}</Italic>
                        } else if (p[0] === 'c') {
                            element = <Highlight>{element}</Highlight>
                        } else if (p[0] === 'a') {
                            element = <Link href={p[1]}>{element}</Link>
                        } else if (p[0] === 's') {
                            element = <Deleted>{element}</Deleted>
                        }
                    }
                }
                return <span key={idx}>{element}</span>
            })
        }</p>
    }
}

export default TextBlock