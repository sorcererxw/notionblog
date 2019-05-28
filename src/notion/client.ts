import fetch from "node-fetch";
import {Collection, PageChunk, UnsignedUrl} from "./type";

function post<T>(url: string, data: any): Promise<T> {
    return fetch(`https://www.notion.so/api/v3${url}`,
        {
            body: JSON.stringify(data),
            headers: {'content-type': 'application/json;charset=UTF-8'},
            method: 'POST',
        }
    ).then(res => res.json())
}

export const getSignedFileUrls = async (data: UnsignedUrl): Promise<any> => {
    return await post("/getSignedFileUrls", data)
};

export const loadPageChunk = function (pageId: string, count: number, cursor = {stack: []}): Promise<PageChunk> {
    const data = {
        chunkNumber: 0,
        cursor: cursor,
        limit: count,
        pageId: getFullBlockId(pageId),
        verticalColumns: false
    };
    return post("/loadPageChunk", data)
};

export const queryCollection = function (fullCollectionId: string, fullCollectionViewId: string, query: {}): Promise<Collection> {
    const data = {
        collectionId: fullCollectionId,
        collectionViewId: fullCollectionViewId,
        loader: {
            type: 'table'
        },
        query: query
    };
    return post("/queryCollection", data)
};
