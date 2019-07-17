import React, { Component, ReactNode } from 'react'
import MetaHead from '../component/metaHead'

class Index extends Component<{}, {}> {
  render() {
    const LinkWrapper = (props: { children: ReactNode | ReactNode[] }) => (
      <li
        style={{
          paddingBottom: 8,
        }}
      >
        <span
          style={{
            fontFamily: '"Noto Serif",serif',
            color: '#424242',
            fontSize: '1.2rem',
            alignItems: 'center',
            display: 'inline-flex',
          }}
        >
          <>{props.children}</>
        </span>
      </li>
    )
    const content = (
      <div
        style={{
          minHeight: '100vh',
          boxSizing: 'border-box',
          display: 'flex',
        }}
      >
        <div
          style={{
            padding: 16,
            paddingTop: '12em',
            width: 1024,
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
        >
          <h1
            style={{
              fontSize: '3rem',
              fontFamily: '"Noto Serif",serif',
              color: '#212121',
            }}
          >
            SorcererXW
          </h1>
          <ul
            style={{
              listStyleType: 'none',
              padding: 0,
            }}
          >
            <LinkWrapper>
              <a
                href={'/blog'}
                style={{
                  marginLeft: 16,
                  marginRight: 16,
                  color: '#424242',
                }}
              >
                Blog
              </a>
            </LinkWrapper>
            {/*<LinkWrapper>*/}
            {/*Projects*/}
            {/*</LinkWrapper>*/}
            <LinkWrapper>
              <a
                href={'https://github.com/sorcererxw'}
                target={'_blank'}
                rel='noopener noreferrer'
                style={{
                  marginLeft: 16,
                  marginRight: 16,
                  color: '#424242',
                }}
              >
                Github
              </a>
            </LinkWrapper>
          </ul>
        </div>
      </div>
    )
    return (
      <div>
        <MetaHead />
        {content}
      </div>
    )
  }
}

export default Index
