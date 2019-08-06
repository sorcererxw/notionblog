import React from 'react'
import styled from 'styled-components'
import config from '../config'
import { Desktop, Mobile } from './responsive'

const Container = styled.div`
  width: 100%;
`

const Content = styled.div`
  width: 768px;
  margin: auto;
  padding-top: 20px;
  padding-bottom: 20px;
  flex-direction: row;
  display: flex;
  align-items: center;
  max-width: 90%;
`

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;

  > a {
    color: var(--head-color);
    text-decoration: none;
  }
`

interface State {
  expandMenu: boolean
}

export default class AppHeader extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)
    this.state = {
      expandMenu: false,
    }
  }

  public render(): React.ReactNode {
    return (
      <div>
        <Desktop>{this.renderDesktop()}</Desktop>
        <Mobile>{this.renderMobile()}</Mobile>
      </div>
    )
  }

  private renderDesktop(): React.ReactNode {
    return (
      <Container>
        <Content>
          <Logo>
            <a href={'/blog'}>{config.blogName}</a>
          </Logo>
          <div style={{ flex: 1 }} />
          {/*<a>About</a>*/}
        </Content>
      </Container>
    )
  }

  private renderMobile(): React.ReactNode {
    const menu = !this.state.expandMenu ? null : (
      <div>
        <a>About</a>
      </div>
    )

    return (
      <Container>
        <Content
          style={{
            marginLeft: 24,
            marginRight: 24,
          }}
        >
          <Logo>
            <a href={'/blog'}>{config.blogName}</a>
          </Logo>
          <div style={{ flex: 1 }} />
          {/*<button onClick={() => this.setState({expandMenu: !this.state.expandMenu})}>*/}
          {/*menu*/}
          {/*</button>*/}
        </Content>
        {menu}
      </Container>
    )
  }
}
