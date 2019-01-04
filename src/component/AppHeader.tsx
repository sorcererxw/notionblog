import * as React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
`;

const Content = styled.div`
  width: 768px;
  margin: auto;
  padding-top: 20px;
  padding-bottom: 20px;
  flex-direction: row;
  display: flex;
  max-width: 90%;
`;

const Logo = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  
  >a{
    color: inherit; 
    text-decoration: none;
  }
`;

interface IProps {
    _?: any
}

interface IState {
    _: any
}

export default class AppHeader extends React.Component<IProps, IState> {

    public render(): React.ReactNode {
        return <Container>
            <Content>
                <Logo><a href={'/'}>SorcererXW's Blog</a></Logo>
                <div style={{flex: 1}}/>
            </Content>
        </Container>;
    }
}