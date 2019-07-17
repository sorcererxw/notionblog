import service from './api'
import config from '../config'
import { UnsignedUrl } from '../api/types'

const pageId = config.blogTablePageId
const viewId = config.blogTableViewId

export const getPosts = () => {
  return service.getArticleMetaList(pageId, viewId)
}

export const getPost = (id: string) => {
  return service.getArticle(id)
}

export const getSignedFileUrls = (data: UnsignedUrl) => {
  return service.getSignedFileUrls(data)
}
