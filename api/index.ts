import axios from 'axios'
import {Article, ArticleMeta, SignedFileUrls} from "./types";

const client = axios.create();

export const getArticleMetaList = (): Promise<ArticleMeta[]> => {
    return client.get(`/api/blog`)
        .then(it => it.data)
};

export const getArticle = (id: string): Promise<Article> => {
    return client.get(`/api/blog/${id}`)
        .then(it => it.data)
};

export const getSignedFileUrls = (urls: string[]): Promise<SignedFileUrls> => {
    return client.post(`/api/notion/getSignedFileUrls`, {urls: urls})
        .then(it => it.data)
};