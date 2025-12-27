const LIST_API = "https://dev.to/api/articles?per_page=20";
const ARTICLE_API = "https://dev.to/api/articles";

export async function fetchArticles() {
  const res = await fetch(LIST_API);
  if (!res.ok) throw new Error("Failed to fetch articles");

  const data = await res.json();

  return data.map(article => ({
    id: article.id,
    title: article.title,
    preview: article.description || "",
    author: article.user?.name || "Unknown",
    coverImage: article.cover_image,
    publishedAt: article.published_at,
    cachedAt: Date.now(),
    hasFullContent: false
  }));
}

export async function fetchFullArticle(id) {
  const res = await fetch(`${ARTICLE_API}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch article");

  const article = await res.json();

  return {
    id: article.id,
    title: article.title,
    bodyHtml: article.body_html, // ✅ NOW IT EXISTS
    author: article.user?.name || "Unknown",
    publishedAt: article.published_at,
    cachedAt: Date.now(),
    hasFullContent: true
  };
}
