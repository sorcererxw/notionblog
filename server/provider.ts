import service from './api'
import config from '../config'

const pageId = config.blogTablePageId
const viewId = config.blogTableViewId

export const getPosts = () => {
    return service.getArticleMetaList(pageId, viewId)
}

export const getPost = (id: string) => {
    return service.getArticle(id)
}

export const getSignedFileUrls = (data: any) => {
    return service.getSignedFileUrls(data)
}
