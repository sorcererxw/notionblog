import * as React from 'react';
import {Redirect, Route, Switch} from "react-router";
import styled from "styled-components";
import AppFooter from "./component/AppFooter";
import AppHeader from "./component/AppHeader";
import ArchivePage from "./container/ArchivePage";
import PostPage from "./container/PostPage";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex:1;
`;


class App extends React.Component {

    public render(): React.ReactNode {
        return (
            <Container>
                <AppHeader/>
                <Content>
                    <Switch>
                        <Route exact={true} path={'/'} component={ArchivePage}/>
                        <Route path={'/post/:page'} component={PostPage}/>
                        <Route render={this.renderHomePage}/>
                    </Switch>
                </Content>
                <AppFooter/>
            </Container>
        );
    }

    private renderHomePage = () => {
        return <Redirect to={'/'}/>
    }
}


export default App;
