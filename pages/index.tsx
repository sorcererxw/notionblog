import * as React from 'react';
import styled from "styled-components";
import AppFooter from "../component/AppFooter";
import AppHeader from "../component/AppHeader";
import '../style/index.css';
// import * as NextApp from "next/app"

// import ArchivePage from "./container/ArchivePage";
// const NextContainer = NextApp.Container;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex:1;
`;


class Index extends React.Component {

    public render(): React.ReactNode {
        return (
            <Container>
                <AppHeader/>
                <Content>
                </Content>
                <AppFooter/>
            </Container>
        );
    }
}


export default Index;
