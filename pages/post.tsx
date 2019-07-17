import React from 'react'
import styled from 'styled-components'
import { Article } from '../api/types'
import AppLayout from '../component/appLayout'
import MetaHead from '../component/metaHead'
import api from '../api'
import { NextContext } from 'next'
import ArticleComponent from '../component/articleComponent'

const CardBox = styled.article`
  width: 768px;
  max-width: 100%;
  background-color: #ffffff;
  box-sizing: border-box;
  border-radius: 8px;
  border-color: #dadce0;
  border-style: solid;
  border-width: 1px;
  margin: auto;
  display: flex;
  background-repeat: no-repeat;
  flex-direction: column;
  overflow: hidden;
`

interface Props {
  article: Article | undefined
  pageId: string
  ssr: boolean
}

interface State {
  article: Article | undefined
}

export default class Post extends React.Component<Props, State> {
  static async getInitialProps({ query }: NextContext) {
    const pageId = query.pageId
    const ssr = query.ssr
    if (ssr && typeof pageId === 'string') {
      const article = await api.getArticle(pageId)
      return { article, ssr, pageId }
    }
    return { pageId, ssr }
  }

  constructor(props: any) {
    super(props)
    this.state = {
      article: undefined,
    }
  }

  async componentDidMount(): Promise<void> {
    if (this.props.ssr && this.props.article) {
      this.setState({
        article: this.props.article,
      })
    } else {
      this.setState({
        article: await api.getArticle(this.props.pageId),
      })
    }
  }

  public render(): React.ReactNode {
    const article = this.state.article
    console.log(article)

    return (
      <div>
        <MetaHead title={article ? article.meta.title : 'loading'} />
        <AppLayout>
          <CardBox>
            <ArticleComponent article={article} />
          </CardBox>
        </AppLayout>
      </div>
    )
  }
}
