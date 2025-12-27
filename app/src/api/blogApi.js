const API_URL = 'https://jsonplaceholder.typicode.com/posts';

export async function fetchArticles() {
    const res = await fetch(API_URL);

    if (!res.ok) {
        throw new Error('Failed to fetch articles');
    }

    const data = await res.json();

    return data.slice(0, 20).map(post => ({
        id: post.id,
        title: post.title,
        body: post.body,
        author: `User ${post.userId}`,
        updatedAt: new Date().toISOString(),
        cachedAt: Date.now()
    }));
}