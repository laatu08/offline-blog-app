import { dbPromise } from "./db";

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