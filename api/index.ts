import axios from 'axios'
import {Article, ArticleMeta} from "./types";

const client = axios.create();

const baseUrl = "http://localhost:3000";

export const getArticleMetaList = (): Promise<ArticleMeta[]> => {
    return client.get(`${baseUrl}/api/blog`)
        .then(it => it.data)
};

export const getArticle = (id: string): Promise<Article> => {
    return client.get(`${baseUrl}/api/blog/${id}`)
        .then(it => it.data)
};