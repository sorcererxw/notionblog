import { Article, ArticleMeta } from '../../client/api/types'
import { BlockValue, loadBlockTree, PageBlockValue } from 'notink'

function getMetaFromPageBlock(value: PageBlockValue): ArticleMeta {
    return {
        name: value.properties.title[0][0],
        tags: string[],
        date: number,
        createdDate: number,
        lastModifiedDate: number,
        id: string,
        title: string,
        cover? : string
    }
}

const getArticle = async (pageId: string): Promise<Article> => {
    const tree = await loadBlockTree(pageId)
    const meta = getMetaFromPageBlock(tree.value)
    return { meta, page: tree, }
}

const getArticleMetaList = async (tableId: string, viewId: string): Promise<ArticleMeta[]> => {
    const result = await loadTablePageBlocks(tableId, viewId)
    const blockIds = result.result.blockIds
    const recordMap = result.recordMap
    return blockIds
        .map((it: string) => recordMap.block[it].value)
        .map((it: BlockValue) => blockValueToArticleMeta(it))
}

export default { getArticle, getArticleMetaList }
