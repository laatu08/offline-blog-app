import { useEffect, useState } from 'react';
import { loadArticlesOfflineFirst } from './db/articles';
import { useOnlineStatus } from './hooks/useOnlineStatus';

export default function App() {
  const [articles, setArticles] = useState([]);
  const online = useOnlineStatus();

  useEffect(() => {
    async function load() {
      const data = await loadArticlesOfflineFirst(online);
      setArticles(data);
    }

    load();
  }, [online]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Offline Blog Reader</h1>
      <p>Status: {online ? 'Online' : 'Offline'}</p>

      {articles.length === 0 && !online && (
        <p>No cached articles available</p>
      )}

      {articles.map(article => (
        <article key={article.id} style={{ marginBottom: 20 }}>
          <h3>{article.title}</h3>
          <p>{article.body}</p>
          <small>{article.author}</small>
        </article>
      ))}
    </div>
  );
}
