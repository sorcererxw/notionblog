import {Moment} from "moment";
import * as moment from 'moment';
import axios from 'axios'

const client = axios.create({
    baseURL: "/api",
    headers: {
        'content-type': 'application/json;charset=UTF-8',
        'User-Agent': ''
    },
});
client.defaults.headers.common["User-Agent"] = "";

const fetch = require("node-fetch");

const isBrowser = typeof window !== 'undefined';

function post<T>(url: string, data: object): Promise<T> {
    if (isBrowser) {
        fetch(`https://blog.sorcererxw.com/api${url}`,
            {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'accept-encoding': '',
                },
                method: 'POST',
            }
        ).then(res => res.json())
        // client.post(url, data).then(it => it.data)
    }
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
};

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

export interface BlockValue {
    id: string,
    content: string[]
    version: number,
    type: string,
    format?: BlockFormat
    properties?: BlockProperties,
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

export interface RecordValue {
    role: string,
    value: BlockValue
}

export interface RecordValues {
    results: RecordValue[]
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

export function getRecordValues(
    blockIds: string[]
): Promise<RecordValues> {
    const data = {
        requests: blockIds.map(blockId => {
            return {
                id: getFullBlockId(blockId),
                table: 'block'
            }
        })
    };
    return post<RecordValues>("/getRecordValues", data);
}

export function loadPageChunk(
    pageId: string, count: number, cursor = {stack: []}
): Promise<PageChunk> {
    const data = {
        "cursor": cursor,
        limit: count,
        pageId: getFullBlockId(pageId),
        verticalColumns: false
    };
    return post<PageChunk>("/loadPageChunk", data)
}

export const loadFullPageChunk = async (pageId: string): Promise<RecordValue[]> => {
    const limit = 100;
    const result: RecordValue[] = [];
    let cursor = {stack: []};
    do {
        const pageChunk = (await Promise.resolve(loadPageChunk(pageId, limit, cursor)));
        for (const id in pageChunk.recordMap.block) {
            if (pageChunk.recordMap.block.hasOwnProperty(id)) {
                const item = pageChunk.recordMap.block[id];
                if (item.value.alive) {
                    result.push(item)
                }
            }
        }
        cursor = pageChunk.cursor;
    } while (cursor.stack.length > 0);
    return result
};

export const loadTable = (collectionId: string, collectionViewId: string, query: object): Promise<Collection> => {
    const data = {
        collectionId: getFullBlockId(collectionId),
        collectionViewId: getFullBlockId(collectionViewId),
        loader: {
            type: 'table'
        }
    };
    if (query != null) {
        data['query'] = query;
    }
    return post<Collection>("/queryCollection", data)
};

export const loadTablePageBlocks = async (collectionId: string, collectionViewId: string): Promise<Collection> => {
    const pageChunkValues = await loadPageChunk(collectionId, 100);
    const tableView = pageChunkValues.recordMap.collection_view[collectionViewId];
    let collection;
    for (let c in pageChunkValues.recordMap.collection) {
        collection = pageChunkValues.recordMap.collection[c];
    }
    const queryResult = await loadTable(
        collection.value.id,
        collectionViewId,
        tableView.value.query);
    return queryResult
};

export const loadTablePageRecord = async (collectionId: string, collectionViewId: string): Promise<RecordMap> => {
    const pageChunkValues = await loadPageChunk(collectionId, 100);
    const tableView = pageChunkValues.recordMap.collection_view[collectionViewId];
    let collection;
    for (let c in pageChunkValues.recordMap.collection) {
        collection = pageChunkValues.recordMap.collection[c];
    }
    const queryResult = await loadTable(
        collection.value.id,
        collectionViewId,
        tableView.value.query);
    return queryResult.recordMap
};

interface DicNode {
    record: RecordValue,
    children: Map<String, DicNode>
}

export interface BlockNode {
    value: BlockValue,
    children: BlockNode[]
}

const recordLstToDic = (list: RecordValue[]): Map<string, DicNode> => {
    const findNode = (dic: Map<String, DicNode>, id: String): DicNode | null => {
        if (dic.has(id)) {
            const result = dic.get(id);
            return result ? result : null;
        }
        for (let [key, entryValue] of dic) {
            key;
            const find = findNode(entryValue.children, id);
            if (find != null) {
                return find
            }
        }
        return null
    };
    const dic: Map<string, DicNode> = new Map();

    list.forEach(item => {
        const itemId = item.value.id;
        const itemParentId = item.value.parent_id;
        const node: DicNode = {
            record: item,
            children: new Map()
        };
        dic.forEach((entryValue, key) => {
            if (entryValue.record.value.parent_id === itemId) {
                node.children.set(key, entryValue);
                dic.delete(key)
            }
        });
        const parent = findNode(dic, itemParentId);
        if (parent != null) {
            parent.children.set(itemId, node)
        } else {
            dic.set(itemId, node)
        }
    });
    return dic
};

export const recordListToTree = (list: RecordValue[]): BlockNode[] => {
    const convertDicNodeToBlockNode = (dicNode: DicNode): BlockNode => {
        const result: BlockNode[] = [];
        dicNode.children.forEach((v) => {
            result.push(convertDicNodeToBlockNode(v))
        });
        return {
            value: dicNode.record.value,
            children: result
        }
    };
    const dicTree = recordLstToDic(list);
    const result: BlockNode[] = [];
    dicTree.forEach((v) => {
        result.push(convertDicNodeToBlockNode(v))
    });
    return result;
};

export function getFullBlockId(blockId: string): string {
    if (blockId.match("^[a-zA-Z0-9]+$")) {
        return blockId.substr(0, 8) + "-"
            + blockId.substr(8, 4) + "-"
            + blockId.substr(12, 4) + "-"
            + blockId.substr(16, 4) + "-"
            + blockId.substr(20, 32)
    } else {
        return blockId;
    }
}

export function getDisplayBlockId(blockId: string): string {
    if (blockId.match("^[a-zA-Z0-9]{8}-([a-zA-Z0-9]{4}-){3}[a-zA-Z0-9]+$")) {
        return blockId.split("-").join("")
    } else {
        return blockId
    }
}

export function getName(value: BlockValue): string {
    const properties = value.properties;
    if (properties !== undefined) {
        const nameValue: string[] = properties[propertiesMap.name];
        if (nameValue !== undefined && nameValue.length > 0) {
            return nameValue[0][0];
        }
    }
    return ""
}

export function getDate(value: BlockValue): Moment {
    let mom = moment(value.created_time);
    const properties = value.properties;
    if (properties !== undefined) {
        const dateValue = properties[propertiesMap.date];
        if (dateValue !== undefined) {
            const dateString = dateValue[0][1][0][1]['start_date'];
            mom = moment(dateString, "YYYY-MM-DD")
        }
    }
    return mom
}

export function getTags(value: BlockValue): string[] {
    let result = [];
    const properties = value.properties;
    if (properties !== undefined) {
        const tagValue = properties[propertiesMap.tags];
        if (tagValue !== undefined && tagValue.length > 0) {
            result = tagValue[0][0].split(",");
        }
    }
    return result;
}

export async function getIdByName(name: string, tablePageId: string, tableViewId: string): Promise<string> {
    const result = await loadTablePageBlocks(tablePageId, tableViewId);
    const data = result.result.blockIds.map(it => result.recordMap.block[it].value);
    for (let item of data) {
        if (getName(item) === name) {
            return item.id
        }
    }
    return ""
}
