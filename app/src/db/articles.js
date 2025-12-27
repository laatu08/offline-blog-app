import { fetchArticles } from "../api/blogApi";
import { dbPromise } from "./db";

// const CACHE_TTL = 1000 * 60 * 60; // 1 hour
const CACHE_TTL = 5000; 

export async function getAllArticles() {
    const db=await dbPromise;
    return db.getAll('articles');
}

export async function saveArticles(articles) {
    const db=await dbPromise;
    const tx=db.transaction('articles','readwrite');

    for(const article of articles){
        tx.store.put(article);
    }

    await tx.done;
}

export async function clearArticles() {
  const db = await dbPromise;
  await db.clear('articles');
}

export function isArticleCacheValid(article) {
  return Date.now() - article.cachedAt < CACHE_TTL;
}

export async function loadArticlesOfflineFirst(isOnline) {
    const cached=await getAllArticles();

    let finalArticles=cached;

    if(isOnline){
        try{
            const fresh=await fetchArticles();
            await saveArticles(fresh);
            finalArticles=fresh;
        }
        catch{
            console.warn('Network failed, using cache');
        }
    }

    return finalArticles;
}

export async function searchByTitle(query) {
  const db = await dbPromise;
  const tx = db.transaction('articles', 'readonly');
  const index = tx.store.index('title');

  const results = [];
  let cursor = await index.openCursor();

  while (cursor) {
    if (cursor.key.toLowerCase().includes(query.toLowerCase())) {
      results.push(cursor.value);
    }
    cursor = await cursor.continue();
  }

  return results;
}

export async function searchByAuthor(author) {
  const db = await dbPromise;
  return db.getAllFromIndex('articles', 'author', author);
}


export function isCacheStale(articles) {
  if (!articles.length) return true;

  const oldest = Math.min(...articles.map(a => a.cachedAt));
  return Date.now() - oldest > CACHE_TTL;
}


export function getLastUpdatedTime(articles) {
  if (!articles.length) return null;
  return Math.max(...articles.map(a => a.cachedAt));
}



export async function refreshArticles() {
  const fresh = await fetchArticles();
  await saveArticles(fresh);
  return fresh;
}