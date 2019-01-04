import * as React from 'react';
import styled from "styled-components";
import BlogList from "../component/BlogList";

const Content = styled.div`
  width: 768px;
  max-width: 90%;
  margin: auto;
`;

const Panel = styled.div`
  margin: 3em 0;
`;

class ArchivePage extends React.Component {

    public render(): React.ReactNode {
        return (
            <Content>
                <Panel>
                    <BlogList
                        pageId={"ba8f1c3a528043a995c3149cefff4c18"}/>
                </Panel>
            </Content>
        );
    }
}


export default ArchivePage;
