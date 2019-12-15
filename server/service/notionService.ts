import moment from 'moment'
import { Article, ArticleMeta, BlockNode, BlockValue, RecordValue } from '../../api/types'
import { getFullBlockId, getSignedFileUrls, loadPageChunk, queryCollection } from './notionClient'

const propertiesMap = {
  name: 'R>;m',
  tags: 'X<$7',
  publish: '{JfZ',
  date: ',n,"',
}

const getPageRecords = async (pageId: string, limit = 50): Promise<Map<string, RecordValue>> => {
  const result = new Map<string, RecordValue>()
  let cursor = { stack: [] }
  let chunkNumber = 0
  do {
    const pageChunk = await loadPageChunk(chunkNumber++, pageId, limit, cursor)
    for (const id of Object.keys(pageChunk.recordMap.block)) {
      if (pageChunk.recordMap.block.hasOwnProperty(id)) {
        const item = pageChunk.recordMap.block[id]
        if (item.value.alive) {
          result.set(id, item)
        }
      }
    }
    cursor = pageChunk.cursor
  } while (cursor.stack.length > 0)
  return result
}

const loadTablePageBlocks = async (collectionId: string, collectionViewId: string) => {
  const pageChunkValues = await loadPageChunk(0, collectionId, 100)
  const recordMap = pageChunkValues.recordMap
  const tableView = recordMap.collection_view[getFullBlockId(collectionViewId)]
  const collection = recordMap.collection[Object.keys(recordMap.collection)[0]]
  return queryCollection(
    collection.value.id,
    collectionViewId,
    tableView.value.query)
}

type DicNode = {
  children: Map<string, DicNode>,
  record: RecordValue
}

const _recordListToDic = (recordList: RecordValue[]): Map<string, DicNode> => {
  const findNode = (dic: Map<string, DicNode>, id: string): DicNode | null => {
    if (dic.has(id)) {
      const result = dic.get(id)
      return result ? result : null
    }
    for (const [, v] of dic) {
      const find = findNode(v.children, id)
      if (find !== null) {
        return find
      }
    }
    return null
  }
  const creche = new Map<string, DicNode>()

  recordList.forEach((item: RecordValue, _) => {
    const itemId = item.value.id
    const itemParentId = item.value.parent_id

    const node = {
      record: item,
      children: new Map<string, DicNode>(),
    }
    creche.forEach((entryValue, key) => {
      if (entryValue.record.value.parent_id === itemId) {
        node.children.set(key, entryValue)
      }
    })
    node.children.forEach((_, k) => {
      creche.delete(k)
    })
    const parent = findNode(creche, itemParentId)
    if (parent !== null) {
      parent.children.set(itemId, node)
    } else {
      creche.set(itemId, node)
    }
  })
  return creche
}

const _convertDicNodeToBlockNode = (dicNode: DicNode): BlockNode => {
  const result: BlockNode[] = []
  dicNode.children.forEach(v => {
    result.push(_convertDicNodeToBlockNode(v))
  })
  return {
    value: dicNode.record.value,
    children: result,
  }
}

const recordValueListToBlockNodes = (list: RecordValue[]) => {
  const dicTree = _recordListToDic(list)
  const result: BlockNode[] = []
  dicTree.forEach(v => {
    result.push(_convertDicNodeToBlockNode(v))
  })
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
    title: block.properties ? block.properties.title![0][0] : '',
    createdDate: moment(block.created_time).unix(),
    lastModifiedDate: moment(block.last_edited_time).unix(),
    cover: block.format,
  }
}

const getArticle = async (pageId: string): Promise<Article> => {
  const chunk = await getPageRecords(pageId)
  const recordList = Array.from(chunk.values())
  const tree = recordValueListToBlockNodes(recordList)
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

export default { getArticle, getArticleMetaList, getSignedFileUrls }
