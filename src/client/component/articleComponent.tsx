import React from 'react'
import { Article } from '../api/types'
import PageHeaderBlock from './notion/pageHeaderBlock'
import NotionBlockList from './notion/base/notionBlockList'
import blogConfig from '../../config'
import styled from 'styled-components'

const Content = styled.section`
  max-width: 100%;
  display: flex;
  flex-direction: column;
  margin: 24px;
`

const CoverImage = styled.img`
  width: 100%;
  border-width: 0;
  border-radius: 0;
  height: 30vh;
  object-fit: cover;
  object-position: center 0;
`

const Comment = styled.div`
  margin-top: 40px;
`

function renderCover(article: Article): React.ReactNode {
  const format = article.meta.cover
  if (format === undefined || format.page_cover.length === 0) {
    return null
  }
  const getRealImageUrl = (url: string): string => {
    if (url.startsWith('/')) {
      return 'https://www.notion.so' + url
    }
    return url
  }

  const coverUrl = getRealImageUrl(format.page_cover)
  const pageCoverPosition = format.page_cover_position
  if (pageCoverPosition >= 0) {
    return (
      <CoverImage
        src={coverUrl}
        style={{
          objectPosition: `center ${(1 - pageCoverPosition) * 100}%`,
        }}
      />
    )
  }
  return <CoverImage src={coverUrl} />
}

function renderTitle(article: Article): React.ReactNode {
  return <PageHeaderBlock title={article.meta.title} pubDate={article.meta.date} />
}

function renderPage(article: Article): React.ReactNode {
  const blockData = article.blocks
  return (
    <div>
      <NotionBlockList blocks={blockData} />
    </div>
  )
}

function renderComment(article: Article): React.ReactNode {
  if (!blogConfig.disqusConfig.enable) {
    return <div />
  }

  const name = article.meta.name
  const title = article.meta.title
  const shortName = blogConfig.disqusConfig.shortName
  const disqusConfig = {
    url: `https://blog.sorcererxw.com/post/${name}`,
    identifier: name,
    title,
  }

  const disqus = require('disqus-react')
  const { DiscussionEmbed } = disqus

  return (
    <Comment>
      <DiscussionEmbed shortname={shortName} config={disqusConfig} />
    </Comment>
  )
}

function render(article: Article | undefined | null) {
  if (article) {
    return (
      <div>
        {renderCover(article)}
        <Content>
          {renderTitle(article)}
          {renderPage(article)}
          {renderComment(article)}
        </Content>
      </div>
    )
  }
  return null
}

interface Props {
  // tslint:disable-next-line:react-unused-props-and-state
  article: Article | undefined | null
}

const ArticleComponent: React.FunctionComponent<Props> = (props: Props) => render(props.article)

export default ArticleComponent
