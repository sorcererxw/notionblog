import axios from 'axios'
import { Article, ArticleMeta, SignedFileUrls, UnsignedUrl } from './types'

const client = axios.create()

const getArticleMetaList = (): Promise<ArticleMeta[]> => {
    return client.get('/api/blog')
        .then(it => it.data)
}

const getArticle = (id: string): Promise<Article> => {
    return client.get(`/api/blog/${id}`)
        .then(it => it.data)
}

const getSignedFileUrls = (urls: UnsignedUrl[]): Promise<SignedFileUrls> => {
    return client.post('/api/notion/getSignedFileUrls', { urls })
        .then(it => it.data)
}

export default {
    getArticleMetaList,
    getArticle,
    getSignedFileUrls,
}
