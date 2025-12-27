import { openDB } from "idb";

export const DB_NAME = 'offline-blog-db';
export const DB_VERSION = 1;

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
        if (oldVersion < 1) {
            const store = db.createObjectStore('articles', {
                keyPath: 'id'
            });

            store.createIndex('updatedAt', 'updatedAt');
            store.createIndex('cachedAt', 'cachedAt');
        }
    }
})