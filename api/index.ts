import axios from 'axios'
import { Article, ArticleMeta, SignedFileUrls, UnsignedUrl } from './types'

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://sorcererxw.com'
  : 'http://localhost:3000'

async function post<T>(url: string, data: any): Promise<T> {
  return axios.post(`${BASE_URL}${url}`, data)
    .then(res => res.data)
}

async function get<T>(url: string): Promise<T> {
  return axios.get(`${BASE_URL}${url}`).then(res => res.data)
}

const getArticleMetaList = (): Promise<ArticleMeta[]> => {
  return get('/api/blog')
}

const getArticle = (id: string): Promise<Article> => {
  return get(`/api/blog/${id}`)
}

const getSignedFileUrls = (urls: UnsignedUrl[]): Promise<SignedFileUrls> => {
  return post('/api/notion/getSignedFileUrls', { urls })
}

export default {
  getArticleMetaList,
  getArticle,
  getSignedFileUrls,
}
