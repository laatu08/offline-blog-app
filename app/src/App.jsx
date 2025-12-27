import { useEffect, useState } from "react";
import {
  getLastUpdatedTime,
  isCacheStale,
  loadArticlesOfflineFirst,
  searchByTitle,
} from "./db/articles";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { fetchFullArticle } from "./api/blogApi";
import { saveArticles } from "./db/articles";

export default function App() {
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [stale, setStale] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const online = useOnlineStatus();

  useEffect(() => {
    async function load() {
      const data = await loadArticlesOfflineFirst(online);
      setArticles(data);
    }
    load();
  }, [online]);

  useEffect(() => {
    setStale(isCacheStale(articles));
    setLastUpdated(getLastUpdatedTime(articles));
  }, [articles]);

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

  async function handleRefresh() {
    if (!online) return;

    setRefreshing(true);
    try {
      const fresh = await refreshArticles();
      setArticles(fresh);
      setLastUpdated(Date.now());
      setStale(false);
    } finally {
      setRefreshing(false);
    }
  }

  function ArticleDetail({ article, onBack }) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-6">
        <button
          onClick={onBack}
          className="mb-6 text-sm text-blue-600 hover:underline"
        >
          ← Back to articles
        </button>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {article.title}
        </h1>

        <div className="text-sm text-slate-500 mb-6">
          {article.author}
          {article.publishedAt && (
            <> · {new Date(article.publishedAt).toLocaleDateString()}</>
          )}
        </div>

        {/* FULL BLOG CONTENT WITH IMAGES */}
        {article.bodyHtml ? (
                  <div
                    className="prose prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
                  />
                ) : (
                  <p className="text-slate-500">
                    Full content not available offline. Go online once to cache
                    this article.
                  </p>
                )}

                {article.coverImage && (
                  <img
                    src={article.coverImage}
                    alt=""
                    className="mb-3 rounded-lg"
                  />
                )}
                </div>
    );
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
      {selectedArticle ? (
        <ArticleDetail
          article={selectedArticle}
          onBack={() => setSelectedArticle(null)}
        />
      ) : (
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

          {stale && (
            <div
              className="mb-4 flex items-center justify-between rounded-lg border 
                      border-yellow-300 bg-yellow-50 px-4 py-3 text-sm"
            >
              <span className="text-yellow-800">
                You’re viewing cached data
              </span>

              <button
                onClick={handleRefresh}
                disabled={!online || refreshing}
                className="rounded-md bg-yellow-600 px-3 py-1 text-white text-xs
                     disabled:opacity-50"
              >
                {refreshing ? "Refreshing…" : "Refresh"}
              </button>
            </div>
          )}

          {lastUpdated && (
            <p className="mb-4 text-xs text-slate-500">
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </p>
          )}

          {articles.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm">No articles available</p>
              {!online && (
                <p className="mt-1 text-xs">Go online once to cache content</p>
              )}
            </div>
          )}

          <div className="space-y-4">
            {articles.map((article) => (
              <article
                key={article.id}
                onClick={async () => {
                  // If already cached with full content → open directly
                  if (article.hasFullContent) {
                    setSelectedArticle(article);
                    return;
                  }

                  try {
                    const full = await fetchFullArticle(article.id);

                    // Save full article to IndexedDB
                    await saveArticles([full]);

                    setSelectedArticle(full);
                  } catch {
                    // Offline fallback: open preview-only article
                    setSelectedArticle(article);
                  }
                }}
                className="bg-white border border-slate-200 rounded-xl p-5
                     cursor-pointer hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {article.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {article.preview || article.body}
                </p>

                <div className="text-xs text-slate-500">{article.author}</div>
              </article>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
