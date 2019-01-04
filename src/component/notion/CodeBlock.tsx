import * as React from 'react'
import SyntaxHighlighter, {} from 'react-syntax-highlighter';
import styled from "styled-components";
import {IRecordValue} from "../../api/notion";

const Container = styled.div`
    margin: 16px 0;
    width: 100%;
    background: rgb(242, 241, 238);
    padding: 16px;
    display: flex;
    flex-direction: column;
`;

const Pre = styled.pre`
    margin: 0;
`;

const Code = styled.code`
    tab-size: 4;
`;

const LanguageBar = styled.div`
    display: flex;
    flex-direction: row;
`;

const LanguageLabel = styled.code`
    font-size: 12px;
    color: rgba(55, 53, 47, 0.6);
`;

interface IProps {
    value: IRecordValue
}

interface IState {
    _: undefined
}

class CodeBlock extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        const properties = this.props.value.value.properties;
        if (properties === undefined) {
            return null;
        }
        const language = properties.language[0];
        const codeText: string = properties.title[0];

        return <Container>
            <SyntaxHighlighter
                PreTag={Pre}
                CodeTag={Code}
                children={codeText}/>
            <LanguageBar>
                <div style={{flex: 1}}/>
                <LanguageLabel>{language}</LanguageLabel>
            </LanguageBar>
        </Container>
    }
}

export default CodeBlock