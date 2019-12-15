import service from './client'
import config from '../../config'
import { UnsignedUrl } from './types'

const pageId = config.blogTablePageId
const viewId = config.blogTableViewId

async function getPosts() {
  return service.getArticleMetaList(pageId, viewId)
}

async function getPost(id: string) {
  return service.getArticle(id)
}

async function getSignedFileUrls(data: UnsignedUrl) {
  return service.getSignedFileUrls(data)
}

export default {
  getPosts, getPost, getSignedFileUrls,
}
