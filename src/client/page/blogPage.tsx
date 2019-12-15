import React from 'react'
import styled from 'styled-components'
import { ArticleMeta } from '../api/types'
import AppLayout from '../component/appLayout'
import ArchiveItem from '../component/archiveItem'
import moment from 'moment'
import api from '../api'

const Content = styled.div`
  width: 768px;
  max-width: 90%;
  margin: auto;
`

const YearHeader = styled.div`
  color: var(--head-color);
  font-weight: 700;
  font-size: 32px;
  margin-top: 48px;
`

interface State {
  data: ArticleMeta[]
}

class BlogPage extends React.Component<{}, State> {
  state: Readonly<State> = {
    data: [],
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      data: await api.getPosts(),
    })
  }

  render(): React.ReactNode {
    return (
      <div>
        <AppLayout>
          <Content>{this.renderList()}</Content>
        </AppLayout>
      </div>
    )
  }

  private renderList(): React.ReactNode {
    const list: React.ReactNode[] = []
    let lastYear = 3000
    let key = 0

    this.state.data.forEach(it => {
      const year = moment.unix(it.date).year()
      if (year !== lastYear) {
        list.push(<YearHeader key={key++}>{year}</YearHeader>)
        lastYear = year
      }
      list.push(<ArchiveItem meta={it} key={key++}/>)
    })

    return <div>{list}</div>
  }
}

export default BlogPage
