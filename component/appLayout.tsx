import React from 'react'
import styled from 'styled-components'
import AppFooter from './AppFooter'
import AppHeader from './AppHeader'
import '../style/index.css'

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  flex:1;
`

class AppLayout extends React.Component {
    public render(): React.ReactNode {
        return (
            <Container>
                <AppHeader/>
                <Content>
                    {this.props.children}
                </Content>
                <AppFooter/>
            </Container>
        )
    }
}

export default AppLayout
