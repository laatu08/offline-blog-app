import { useEffect } from 'react';
import { saveArticles, getAllArticles } from './db/articles';

export default function App() {
  useEffect(() => {
    async function testDB() {
      await saveArticles([
        {
          id: 1,
          title: 'Offline First',
          body: 'IndexedDB is the source of truth',
          author: 'You',
          updatedAt: new Date().toISOString(),
          cachedAt: Date.now()
        }
      ]);

      const articles = await getAllArticles();
      console.log('IndexedDB Articles:', articles);
    }

    testDB();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Offline Blog Reader</h1>
    </div>
  );
}
