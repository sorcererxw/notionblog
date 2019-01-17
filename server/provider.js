const config = require('../config')
const service = require('./api')

const pageId = config.blogTablePageId
const viewId = config.blogTableViewId

module.exports.getPosts = () => {
    return service.getArticleMetaList(pageId, viewId)
}

module.exports.getPost = (id) => {
    return service.getArticle(id)
}
