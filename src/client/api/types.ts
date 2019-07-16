import { BlockNode } from 'notink'

export interface ArticleMeta {
    name: string,
    tags: string[],
    date: number,
    createdDate: number,
    lastModifiedDate: number,
    id: string,
    title: string,
    cover?: string
}

export interface Article {
    meta: ArticleMeta,
    page: BlockNode
}
