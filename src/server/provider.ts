import {api as service} from "../notion";
import config from "../config/index";

const pageId = config.blogTablePageId;
const viewId = config.blogTableViewId;

export class provider {
    static getPosts = (): Promise<> => {
        return service.getArticleMetaList(pageId, viewId)
    };

    static getPost = (id) => {
        return service.getArticle(id)
    };

    static getSignedFileUrls = (data) => {
        return service.getSignedFileUrls(data)
    };
}
