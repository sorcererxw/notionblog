import fetch from 'node-fetch'
import { Article, ArticleMeta, SignedFileUrls, UnsignedUrl } from './types'

const BASE_URL = 'http://localhost:3000'

async function post<T>(url: string, data: any): Promise<T> {
    return fetch(`${BASE_URL}${url}`,
        {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
            method: 'POST',
        },
    ).then(res => res.json())
}

async function get<T>(url: string): Promise<T> {
    return fetch(`${BASE_URL}${url}`,
        {
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
            method: 'GET',
        },
    ).then(async res => {
        console.log(res)
        return res.json()
    })
}

async function getArticleMetaList(): Promise<ArticleMeta[]> {
    return get('/api/blog')
}

async function getArticle(id: string): Promise<Article> {
    return get(`/api/blog/${id}`)
}

async function getSignedFileUrls(urls: UnsignedUrl[]): Promise<SignedFileUrls> {
    return post('/api/notion/getSignedFileUrls', { urls })
}

export default {
    getArticleMetaList,
    getArticle,
    getSignedFileUrls,
}
