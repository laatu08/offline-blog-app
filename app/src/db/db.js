import { openDB } from "idb";

export const DB_NAME = 'offline-blog-db';
export const DB_VERSION = 2;

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion) {
    const store =
      oldVersion < 1
        ? db.createObjectStore('articles', { keyPath: 'id' })
        : db.transaction.objectStore('articles');

    if (oldVersion < 1) {
      store.createIndex('updatedAt', 'updatedAt');
      store.createIndex('cachedAt', 'cachedAt');
    }

    if (oldVersion < 2) {
      store.createIndex('title', 'title');
      store.createIndex('author', 'author');
    }
  }
});
