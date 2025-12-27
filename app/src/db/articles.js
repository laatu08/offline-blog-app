import { fetchArticles } from "../api/blogApi";
import { dbPromise } from "./db";

const CACHE_TTL = 1000 * 60 * 60; // 1 hour

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

    const validCached=cached.filter(isArticleCacheValid);

    let finalArticles=validCached;

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