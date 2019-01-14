const fetch = require("node-fetch")
const blogConfig = require('../config')

function post(url, data) {
    return fetch(`https://www.notion.so/api/v3${url}`,
        {
            body: JSON.stringify(data),
            headers: {'content-type': 'application/json;charset=UTF-8'},
            method: 'POST',
        }
    ).then(res => res.json())
}

const loadTable = (collectionId, collectionViewId, query) => {
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


function loadPageChunk(pageId, count, cursor) {
    const data = {
        "cursor": cursor,
        limit: count,
        pageId: getFullBlockId(pageId),
        verticalColumns: false
    }
    return post("/loadPageChunk", data)
}

const loadTablePageBlocks = async (collectionId, collectionViewId) => {
    const pageChunkValues = await loadPageChunk(collectionId, 100)
    const tableView = pageChunkValues.recordMap.collection_view[collectionViewId]
    let collection
    for (let c in pageChunkValues.recordMap.collection) {
        collection = pageChunkValues.recordMap.collection[c]
    }
    return await loadTable(
        collection.value.id,
        collectionViewId,
        tableView.value.query)
}

function getFullBlockId(blockId) {
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

function getName(value) {
    const properties = value.properties
    if (properties !== undefined) {
        const nameValue = properties[propertiesMap.name]
        if (nameValue !== undefined && nameValue.length > 0) {
            return nameValue[0][0]
        }
    }
    return ""
}

const propertiesMap = {
    name: 'R>;m',
    tags: 'X<$7',
    publish: '{JfZ',
    date: ',n,"'
}

const getPosts = async () => {
    const result = await loadTablePageBlocks(
        blogConfig.blogTablePageId,
        blogConfig.blogTableViewId
    )
    return result.result.blockIds
        .map(it => result.recordMap.block[it].value)
        .map(record => getName(record))
}

module.exports = getPosts