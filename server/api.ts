import fetch from 'node-fetch'
import moment from 'moment'
import {
    Article,
    ArticleMeta,
    BlockNode,
    BlockValue, Collection,
    PageChunk,
    RecordValue,
    UnsignedUrl,
} from '../api/types'

async function post<T>(url: string, data: any): Promise<T> {
    return fetch(`https://www.notion.so/api/v3${url}`,
        {
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json;charset=UTF-8' },
            method: 'POST',
        },
    ).then(res => res.json())
}

const propertiesMap = {
    name: 'R>;m',
    tags: 'X<$7',
    publish: '{JfZ',
    date: ',n,"',
}

const getFullBlockId = (blockId: string): string => {
    if (blockId.match('^[a-zA-Z0-9]+$')) {
        return [blockId.substr(0, 8),
            blockId.substr(8, 4),
            blockId.substr(12, 4),
            blockId.substr(16, 4),
            blockId.substr(20, 32)].join('-')
    }
    return blockId

}

const loadPageChunk = (
    pageId: string, count: number, cursor = { stack: [] },
): Promise<PageChunk> => {
    const data = {
        chunkNumber: 0,
        cursor,
        limit: count,
        pageId: getFullBlockId(pageId),
        verticalColumns: false,
    }
    return post('/loadPageChunk', data)
}

const queryCollection = (
    collectionId: string, collectionViewId: string, query: any,
): Promise<Collection> => {
    const data = {
        collectionId: getFullBlockId(collectionId),
        collectionViewId: getFullBlockId(collectionViewId),
        loader: {
            type: 'table',
        },
        query: undefined,
    }
    if (query !== null) {
        data.query = query
    }
    return post('/queryCollection', data)
}

const getPageRecords = async (pageId: string): Promise<RecordValue[]> => {
    const limit = 50
    const result = []
    let cursor = { stack: [] }
    do {
        const pageChunk = (await Promise.resolve(loadPageChunk(pageId, limit, cursor)))
        for (const id of Object.keys(pageChunk.recordMap.block)) {
            if (pageChunk.recordMap.block.hasOwnProperty(id)) {
                const item = pageChunk.recordMap.block[id]
                if (item.value.alive) {
                    result.push(item)
                }
            }
        }
        cursor = pageChunk.cursor
    } while (cursor.stack.length > 0)
    return result
}

const loadTablePageBlocks = async (collectionId: string, collectionViewId: string) => {
    const pageChunkValues = await loadPageChunk(collectionId, 100)
    const recordMap = pageChunkValues.recordMap
    const tableView = recordMap.collection_view[getFullBlockId(collectionViewId)]
    const collection = recordMap.collection[Object.keys(recordMap.collection)[0]]
    return queryCollection(
        collection.value.id,
        collectionViewId,
        tableView.value.query)
}

// tslint:disable-next-line:no-unused
const printTreeLevel = (root: {
    value: { id: string }
    children: []
}, level: number): void => {
    if (root === undefined) {
        return
    }
    let indent = ''
    for (let i = 0; i < level; i++) {
        indent += '  '
    }
    console.log(indent + root.value.id)
    for (const c of root.children) {
        printTreeLevel(c, level + 1)
    }
}

const countTreeNode = (root: BlockNode) => {
    if (root === undefined) {
        return 0
    }
    let count = 1
    for (const c of root.children) {
        count += countTreeNode(c)
    }
    return count
}

const recordValueListToBlockNodes = (list: RecordValue[]) => {
    type DicNode = {
        children: Map<string, DicNode>,
        record: RecordValue
    }

    const recordListToDic = (recordList: RecordValue[]): Map<string, DicNode> => {
        const findNode = (dic: Map<string, DicNode>, id: string): DicNode | null => {
            if (dic.has(id)) {
                const result = dic.get(id)
                return result ? result : null
            }
            for (const [, entryValue] of dic) {
                const find = findNode(entryValue.children, id)
                if (find !== null) {
                    return find
                }
            }
            return null
        }
        const dic = new Map()

        recordList.forEach((item, idx) => {
            const itemId = item.value.id
            const itemParentId = item.value.parent_id
            console.log(`${idx}: id: ${itemId} parent: ${itemParentId}`)

            const node = {
                record: item,
                children: new Map(),
            }
            dic.forEach((entryValue, key) => {
                if (entryValue.record.value.parent_id === itemId) {
                    node.children.set(key, entryValue)
                    dic.delete(key)
                }
            })
            const parent = findNode(dic, itemParentId)
            if (parent !== null) {
                parent.children.set(itemId, node)
            } else {
                dic.set(itemId, node)
            }
        })
        return dic
    }

    const convertDicNodeToBlockNode = (dicNode: DicNode): BlockNode => {
        const result: BlockNode[] = []
        dicNode.children.forEach(v => {
            result.push(convertDicNodeToBlockNode(v))
        })
        return {
            value: dicNode.record.value,
            children: result,
        }
    }

    const dicTree = recordListToDic(list)
    const result: BlockNode[] = []
    dicTree.forEach(v => {
        result.push(convertDicNodeToBlockNode(v))
    })

    console.log(result.map(it => countTreeNode(it)))

    return result
}

const getNameFromBlockValue = (value: BlockValue): string => {
    const properties = value.properties
    if (properties !== undefined) {
        const nameValue = properties[propertiesMap.name]
        if (nameValue !== undefined && nameValue.length > 0) {
            return nameValue[0][0]
        }
    }
    return ''
}

const getDateFromBlockValue = (value: BlockValue): number => {
    let mom = moment(value.created_time)
    const properties = value.properties
    if (properties !== undefined) {
        const dateValue = properties[propertiesMap.date]
        if (dateValue !== undefined) {
            const dateString = dateValue[0][1][0][1].start_date
            mom = moment(dateString, 'YYYY-MM-DD')
        }
    }
    return mom.unix()
}

const getTagsFromBlockValue = (value: BlockValue): string[] => {
    let result = []
    const properties = value.properties
    if (properties !== undefined) {
        const tagValue = properties[propertiesMap.tags]
        if (tagValue !== undefined && tagValue.length > 0) {
            result = tagValue[0][0].split(',')
        }
    }
    return result
}

const blockValueToArticleMeta = (block: BlockValue): ArticleMeta => {
    return {
        name: getNameFromBlockValue(block),
        tags: getTagsFromBlockValue(block),
        date: getDateFromBlockValue(block),
        id: block.id,
        title: block.properties ? block.properties.title[0] : undefined,
        createdDate: moment(block.created_time).unix(),
        lastModifiedDate: moment(block.last_edited_time).unix(),
        cover: block.format,
    }
}

const getArticle = async (pageId: string): Promise<Article> => {
    const chunk = await getPageRecords(pageId)
    const tree = recordValueListToBlockNodes(chunk)
    const meta = blockValueToArticleMeta(tree[0].value)
    return {
        meta,
        blocks: tree[0].children,
    }
}

const getArticleMetaList = async (tableId: string, viewId: string) => {
    const result = await loadTablePageBlocks(tableId, viewId)
    const blockIds = result.result.blockIds
    const recordMap = result.recordMap
    return blockIds
        .map((it: string) => recordMap.block[it].value)
        .map((it: BlockValue) => blockValueToArticleMeta(it))
}

const getSignedFileUrls = async (data: UnsignedUrl) => {
    return post('/getSignedFileUrls', data)
}

export default { getArticle, getArticleMetaList, getSignedFileUrls }
