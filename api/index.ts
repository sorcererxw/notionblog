import axios from 'axios'
import {Article, ArticleMeta} from "./types";

// const baseUrl = "https://blog.sorcererxw.com";
const baseUrl = "http://127.0.0.1:3000";

const client = axios.create();

export const getArticleMetaList = (): Promise<ArticleMeta[]> => {
    return client.get(`${baseUrl}/api/blog`)
        .then(it => it.data)
};

export const getArticle = (id: string): Promise<Article> => {
    return client.get(`${baseUrl}/api/blog/${id}`)
        .then(it => it.data)
};