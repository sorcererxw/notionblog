/**
 * PageChunk 文章信息集合
 */
export interface PageChunk {
    cursor: {
        stack: []
    }
    recordMap: RecordMap
}

/**
 * Collection
 */
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

/**
 * 每个 Block 的属性
 */
export interface RecordValue {
    role: "reader" | "comment_only" | "editor",
    value: BlockValue
}

export interface BlockValue {
    id: string,
    content: string[]
    version: number, // 版本号
    type: string, // 类型
    properties?: BlockProperties,
    format?: BlockFormat
    created_time: number, // 创建时间戳
    last_edited_time: number, // 最后更新时间戳
    parent_id: string, // 父节点 id
    parent_table: "block",
    alive: boolean,
    query?: object,
}

export interface CollectionQueryRule {
    aggregate: [],
    filter: FilterRule[],
    filter_operator: 'and' | 'or' // filter 之间关系，只有可能是 and 和 or，如果是 and，就是全 and, 如果是 or 就是全 or
    sort: SortRule[]
}

export interface FilterRule {
    comparator: "checkbox_is"
    id: string
    property: string // 列名
    type: string
    value: string
}

export interface SortRule {
    id: string,
    property: string, // 排序基于的列名
    type: string,
    direction: "descending" | "ascending"
}

/**
 * Block 的具体数据
 */
export interface BlockProperties {
    caption?: RichText[],
    language?: string[],
    title?: RichText[],
    source?: string[]
}

/**
 * Block 样式信息
 */
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

/**
 * 树形化后节点
 */
export interface BlockNode {
    value: BlockValue,
    children: BlockNode[]
}

/**
 * 文章元信息
 */
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

/**
 * 文章信息
 */
export interface Article {
    meta: ArticleMeta,
    blocks: BlockNode[]
}

/**
 * 获取真实的文件url的返回格式
 */
export interface SignedFileUrls {
    signedUrls: string[]
}

/**
 * 获取真实的文件url的上传格式
 */
export interface UnsignedUrl {
    url: string,
    permissionRecord: { id: string, table: string }
}

export type TextContent = string
export type TextStyle = string[]
export type RichText = [TextContent, TextStyle[]]
