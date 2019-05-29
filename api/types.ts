export interface PageChunk {
    cursor: {
        stack: []
    }
    recordMap: RecordMap
}

export interface Collection {
    recordMap: RecordMap
    result: {
        blockIds: string[],
        total: number,
        type: string
    }
}

export interface RecordMap {
    block: {
        [blockId: string]: RecordValue
    },
    collection: {
        [blockId: string]: RecordValue
    },
    collection_view: {
        [blockId: string]: RecordValue
    }
}

export interface RecordValue {
    role: string,
    value: BlockValue
}

export interface BlockValue {
    id: string,
    content: string[]
    version: number,
    type: string,
    format?: BlockFormat
    properties?: BlockProperties & { [key: string]: any },
    created_time: number,
    last_edited_time: number,
    parent_id: string,
    parent_table: string,
    alive: boolean,
    query: object,
    schema: {
        [schemeId: string]: SchemeValue
    }
}

export interface BlockFormat {
    page_cover: string,
    page_cover_position: number,
    block_aspect_ratio: number
    block_full_width: boolean
    block_page_width: boolean
    block_preserve_scale: boolean
    block_width: number,
    block_height: number,
    display_source: string,
    column_ratio: number
}

export interface BlockProperties {
    caption: any[],
    language: string[],
    title: any[],
    source: string[]
}

export interface SchemeValue {
    name: string,
    type: string,
    options: []
}

export interface BlockNode {
    value: BlockValue,
    children: BlockNode[]
}

export interface ArticleMeta {
    name: string,
    tags: string[],
    date: number,
    createdDate: number,
    lastModifiedDate: number,
    id: string,
    title: string,
    cover?: BlockFormat
}

export interface Article {
    meta: ArticleMeta,
    blocks: BlockNode[]
}

export interface SignedFileUrls {
    signedUrls: string[]
}

export interface PermissionRecord {
    id: string,
    table: string
}

export interface UnsignedUrl {
    url: string,
    permissionRecord: PermissionRecord
}

export type TextContent = string
export type TextStyle = string[]
export type RichText = [TextContent, TextStyle[]]
