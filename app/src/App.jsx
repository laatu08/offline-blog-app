import { useEffect, useState } from "react";
import { loadArticlesOfflineFirst, searchByTitle } from "./db/articles";
import { useOnlineStatus } from "./hooks/useOnlineStatus";

export default function App() {
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState("");

  const online = useOnlineStatus();

  useEffect(() => {
    async function load() {
      const data = await loadArticlesOfflineFirst(online);
      setArticles(data);
    }
    load();
  }, [online]);

  async function handleSearch(e) {
    const value = e.target.value;
    setQuery(value);

    if (!value) {
      const data = await loadArticlesOfflineFirst(online);
      setArticles(data);
      return;
    }

    const results = await searchByTitle(value);
    setArticles(results);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">
            Offline Blog Reader
          </h1>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
              online ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {online ? "Online" : "Offline"}
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-5 py-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search articles (works offline)"
          value={query}
          onChange={handleSearch}
          className="w-full mb-6 px-4 py-3 rounded-lg border border-slate-300 
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     text-sm"
        />

        {/* Empty State */}
        {articles.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p className="text-sm">No articles available</p>
            {!online && (
              <p className="mt-1 text-xs">
                Go online once to cache content
              </p>
            )}
          </div>
        )}

        {/* Articles */}
        <div className="space-y-4">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white border border-slate-200 rounded-xl p-5"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {article.title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {article.body}
              </p>

              <div className="text-xs text-slate-500">
                {article.author}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
