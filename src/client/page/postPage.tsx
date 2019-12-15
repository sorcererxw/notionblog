import React from 'react'
import styled from 'styled-components'
import { Article } from '../api/types'
import AppLayout from '../component/appLayout'
import api from '../api'
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
  pageId: string
}

interface State {
  article: Article | undefined
}

export default class PostPage extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      article: undefined,
    }
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      article: await api.getArticle(this.props.pageId),
    })
  }

  public render(): React.ReactNode {
    const article = this.state.article
    console.log(article)

    return (
      <div>
        <AppLayout>
          <CardBox>
            <ArticleComponent article={article}/>
          </CardBox>
        </AppLayout>
      </div>
    )
  }
}
