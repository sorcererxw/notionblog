import * as React from 'react'
import SyntaxHighlighter, { } from 'react-syntax-highlighter';
import styled from "styled-components";
import { BlockValue } from "../../api/types";

const Container = styled.div`
    width: 100%;
    max-width: 100%;
    background: rgb(242, 241, 238);
    box-sizing: border-box;
    position: relative;
    text-align: left;
    display: block;
`;

const Pre = styled.pre`
    margin: 0;
`;

const Code = styled.code`
    tab-size: 4;
`;

const LanguageBar = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    height: 30px;
    justify-content: flex-end;
    display: flex;
    flex-direction: row;
    padding: 0 8px;
`;

const LanguageLabel = styled.code`
    font-size: 12px;
    color: rgba(55, 53, 47, 0.6);
    opacity: 0.4;
`;

interface IProps {
    value: BlockValue
}

interface IState {
    _: undefined
}

class CodeBlock extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        const properties = this.props.value.properties;
        if (properties === undefined) {
            return null;
        }
        const language = properties.language[0];
        const codeText: string = properties.title[0];

        return <Container>
            <SyntaxHighlighter
                customStyle={{
                    boxSizing: "border-box",
                    paddingTop: 24,
                    paddingBottom: 24,
                    paddingLeft: 20,
                    paddingRight: 20
                }}
                PreTag={Pre}
                CodeTag={Code}
                children={codeText} />
            <LanguageBar>
                <div style={{
                    maxWidth: '100%',
                    flex: 1
                }} />
                <LanguageLabel>{language}</LanguageLabel>
            </LanguageBar>
        </Container>
    }
}

export default CodeBlock