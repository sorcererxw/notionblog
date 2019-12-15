import axios from 'axios'
import { Collection, PageChunk, RecordValue, UnsignedUrl } from '../../api/types'

async function post<T>(url: string, data: any): Promise<T> {
  return axios.post(`https://www.notion.so/api/v3${url}`, data)
    .then(async res => res.data)
}

export const getFullBlockId = (blockId: string): string => {
  if (blockId.match('^[a-zA-Z0-9]+$')) {
    return [blockId.substr(0, 8),
      blockId.substr(8, 4),
      blockId.substr(12, 4),
      blockId.substr(16, 4),
      blockId.substr(20, 32)].join('-')
  }
  return blockId
}

export async function loadPageChunk(
  chunkNumber: number, pageId: string, count = 50, cursor = { stack: [] },
): Promise<PageChunk> {
  const data = {
    chunkNumber,
    cursor,
    limit: count,
    pageId: getFullBlockId(pageId),
    verticalColumns: false,
  }
  return post<PageChunk>('/loadPageChunk', data)
}

export const queryCollection = async (
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

export const getSignedFileUrls = async (data: UnsignedUrl) => {
  return post('/getSignedFileUrls', data)
}

export async function getReordValues(
  requests: { table: string, id: string }[],
): Promise<{ results: RecordValue[] }> {
  return post('/getRecordValues', { requests })
}
