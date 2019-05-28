import moment from "moment";
import {loadPageChunk, queryCollection} from './client'
import {Article, ArticleMeta, BlockNode, BlockValue, PageChunk, RecordValue, UnsignedUrl} from "./type";

const getFullBlockId = (blockId: string): string => {
    if (blockId.match("^[a-zA-Z0-9]+$")) {
        return blockId.substr(0, 8) + "-"
            + blockId.substr(8, 4) + "-"
            + blockId.substr(12, 4) + "-"
            + blockId.substr(16, 4) + "-"
            + blockId.substr(20, 32)
    } else {
        return blockId
    }
};

const propertiesMap = {
    name: 'R>;m',
    tags: 'X<$7',
    publish: '{JfZ',
    date: ',n,"'
};


const getPageRecords = async function (pageId: string): Promise<RecordValue[]> {
    const limit = 100;
    const result = [];
    let cursor = {stack: []};
    do {
        const pageChunk = await loadPageChunk(pageId, limit, cursor);
        for (const id in pageChunk.recordMap.block) {
            if (pageChunk.recordMap.block.hasOwnProperty(id)) {
                const item = pageChunk.recordMap.block[id];
                if (item.value.alive) {
                    result.push(item)
                }
            }
        }
        cursor = pageChunk.cursor
    } while (cursor.stack.length > 0);
    return result
};

const loadTablePageBlocks = async (collectionId: string, collectionViewId: string) => {
    const pageChunkValues = await loadPageChunk(collectionId, 100);
    const recordMap = pageChunkValues.recordMap;
    const tableView = recordMap.collection_view[getFullBlockId(collectionViewId)];
    const collection = recordMap.collection[Object.keys(recordMap.collection)[0]];
    return await queryCollection(
        getFullBlockId(collection.value.id),
        getFullBlockId(collectionViewId),
        tableView.value.query)
};

const recordValueListToBlockNodes = (list: BlockValue[]): BlockNode[] => {
    type DicNode = Map<string, {
        record: RecordValue,
        children: Map<string, DicNode>
    }>

    const recordLstToDic = (list: BlockValue[]): Map<string, DicNode> => {
        const findNode = (dic: Map<string, DicNode>, id: string): DicNode | null => {
            if (dic.has(id)) {
                const result = dic.get(id);
                return result ? result : null
            }
            for (let [, entryValue] of dic) {
                const find = findNode(entryValue.children, id);
                if (find != null) {
                    return find
                }
            }
            return null
        };
        const dic = new Map();

        list.forEach(item => {
            const itemId = item.id;
            const itemParentId = item.parent_id;
            const node = {
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

    const convertDicNodeToBlockNode = (dicNode) => {
        const result = [];
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
    return result
};

const getNameFromBlockValue = (value: BlockValue) => {
    const properties = value.properties;
    if (properties === undefined) {
        return "";
    }
    const nameValue = properties[propertiesMap.name];
    if (nameValue !== undefined && nameValue.length > 0) {
        return nameValue[0][0]
    }
};

const getDateFromBlockValue = (value) => {
    let mom = moment(value.created_time);
    const properties = value.properties;
    if (properties !== undefined) {
        const dateValue = properties[propertiesMap.date];
        if (dateValue !== undefined) {
            const dateString = dateValue[0][1][0][1]['start_date'];
            mom = moment(dateString, "YYYY-MM-DD")
        }
    }
    return mom.unix()
};

const getTagsFromBlockValue = (value) => {
    let result = [];
    const properties = value.properties;
    if (properties !== undefined) {
        const tagValue = properties[propertiesMap.tags];
        if (tagValue !== undefined && tagValue.length > 0) {
            result = tagValue[0][0].split(",")
        }
    }
    return result
};

const blockValueToArticleMeta = (block: BlockValue): ArticleMeta => {
    return {
        name: getNameFromBlockValue(block),
        tags: getTagsFromBlockValue(block),
        date: getDateFromBlockValue(block),
        id: block.id,
        title: block.properties.title[0][0],
        createdDate: moment(block.created_time).unix(),
        lastModifiedDate: moment(block.last_edited_time).unix(),
        cover: block.format
    }
};

export const getArticle = async (pageId: string): Promise<Article> => {
    const chunk = await getPageRecords(pageId);
    const tree = recordValueListToBlockNodes(chunk);
    const meta = blockValueToArticleMeta(tree[0].value);
    return {
        meta: meta,
        blocks: tree[0].children
    }
}

export const getArticleMetaList = async (tableId: string, viewId: string): Promise<ArticleMeta[]> => {
    const result = await loadTablePageBlocks(tableId, viewId);
    const blockIds = result.result.blockIds;
    const recordMap = result.recordMap;
    return blockIds
        .map(it => recordMap.block[it].value)
        .map(it => blockValueToArticleMeta(it))
};
