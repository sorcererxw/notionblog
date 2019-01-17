const moment = require("moment")
const fetch = require("node-fetch")

function post(url, data) {
    return fetch(`https://www.notion.so/api/v3${url}`,
        {
            body: JSON.stringify(data),
            headers: {'content-type': 'application/json;charset=UTF-8'},
            method: 'POST',
        }
    ).then(res => res.json())
}

const propertiesMap = {
    name: 'R>;m',
    tags: 'X<$7',
    publish: '{JfZ',
    date: ',n,"'
}

const getFullBlockId = (blockId) => {
    if (typeof blockId !== 'string') {
        throw Error(`blockId: ${typeof blockId} must be string`)
    }
    if (blockId.match("^[a-zA-Z0-9]+$")) {
        return blockId.substr(0, 8) + "-"
            + blockId.substr(8, 4) + "-"
            + blockId.substr(12, 4) + "-"
            + blockId.substr(16, 4) + "-"
            + blockId.substr(20, 32)
    } else {
        return blockId
    }
}

const getRecordValues = function (...blockIds) {
    const data = {
        requests: blockIds.map(blockId => {
            return {
                id: getFullBlockId(blockId),
                table: 'block'
            }
        })
    }
    return post("/getRecordValues", data)
}

const loadPageChunk = function (pageId, count, cursor = {stack: []}) {
    const data = {
        cursor: cursor,
        limit: count,
        pageId: getFullBlockId(pageId),
        verticalColumns: false
    }
    return post("/loadPageChunk", data)
}

const queryCollection = function (collectionId, collectionViewId, query) {
    const data = {
        collectionId: getFullBlockId(collectionId),
        collectionViewId: getFullBlockId(collectionViewId),
        loader: {
            type: 'table'
        }
    }
    if (query != null) {
        data['query'] = query
    }
    return post("/queryCollection", data)
}

const getPageRecords = async function (pageId) {
    const limit = 100
    const result = []
    let cursor = {stack: []}
    do {
        const pageChunk = (await Promise.resolve(loadPageChunk(pageId, limit, cursor)))
        for (const id in pageChunk.recordMap.block) {
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

const loadTablePageBlocks = async (collectionId, collectionViewId) => {
    const pageChunkValues = await loadPageChunk(collectionId, 100)
    const recordMap = pageChunkValues.recordMap
    const tableView = recordMap.collection_view[getFullBlockId(collectionViewId)]
    const collection = recordMap.collection[Object.keys(recordMap.collection)[0]]
    return await queryCollection(
        collection.value.id,
        collectionViewId,
        tableView.value.query)
}

const recordValueListToBlockNodes = (list) => {
    const recordLstToDic = (list) => {
        const findNode = (dic, id) => {
            if (dic.has(id)) {
                const result = dic.get(id)
                return result ? result : null
            }
            for (let [, entryValue] of dic) {
                const find = findNode(entryValue.children, id)
                if (find != null) {
                    return find
                }
            }
            return null
        }
        const dic = new Map()

        list.forEach(item => {
            const itemId = item.value.id
            const itemParentId = item.value.parent_id
            const node = {
                record: item,
                children: new Map()
            }
            dic.forEach((entryValue, key) => {
                if (entryValue.record.value.parent_id === itemId) {
                    node.children.set(key, entryValue)
                    dic.delete(key)
                }
            })
            const parent = findNode(dic, itemParentId)
            if (parent != null) {
                parent.children.set(itemId, node)
            } else {
                dic.set(itemId, node)
            }
        })
        return dic
    }

    const convertDicNodeToBlockNode = (dicNode) => {
        const result = []
        dicNode.children.forEach((v) => {
            result.push(convertDicNodeToBlockNode(v))
        })
        return {
            value: dicNode.record.value,
            children: result
        }
    }
    const dicTree = recordLstToDic(list)
    const result = []
    dicTree.forEach((v) => {
        result.push(convertDicNodeToBlockNode(v))
    })
    return result
}

const getNameFromBlockValue = (value) => {
    const properties = value.properties
    if (properties !== undefined) {
        const nameValue = properties[propertiesMap.name]
        if (nameValue !== undefined && nameValue.length > 0) {
            return nameValue[0][0]
        }
    }
    return ""
}

const getDateFromBlockValue = (value) => {
    let mom = moment(value.created_time)
    const properties = value.properties
    if (properties !== undefined) {
        const dateValue = properties[propertiesMap.date]
        if (dateValue !== undefined) {
            const dateString = dateValue[0][1][0][1]['start_date']
            mom = moment(dateString, "YYYY-MM-DD")
        }
    }
    return mom.unix()
}

const getTagsFromBlockValue = (value) => {
    let result = []
    const properties = value.properties
    if (properties !== undefined) {
        const tagValue = properties[propertiesMap.tags]
        if (tagValue !== undefined && tagValue.length > 0) {
            result = tagValue[0][0].split(",")
        }
    }
    return result
}

const blockValueToArticleMeta = (block) => {
    return {
        name: getNameFromBlockValue(block),
        tags: getTagsFromBlockValue(block),
        date: getDateFromBlockValue(block),
        id: block.id,
        title: block.properties.title[0],
        createdDate: moment(block.created_time).unix(),
        lastModifiedDate: moment(block.last_edited_time).unix(),
        cover: block.format
    }
}

const getArticle = async (pageId) => {
    const chunk = await getPageRecords(pageId)
    const tree = recordValueListToBlockNodes(chunk)
    const meta = blockValueToArticleMeta(tree[0].value)
    return {
        meta: meta,
        blocks: tree[0].children
    }
}

const getArticleMetaList = async (tableId, viewId) => {
    const result = await loadTablePageBlocks(tableId, viewId)
    const blockIds = result.result.blockIds
    const recordMap = result.recordMap
    return blockIds
        .map(it => recordMap.block[it].value)
        .map(it => blockValueToArticleMeta(it))
}

module.exports = {getArticle, getArticleMetaList}