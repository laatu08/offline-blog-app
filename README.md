# Offline Blog Reader

A Progressive Web App (PWA) that fetches articles from dev.to and provides full offline reading capabilities. The app intelligently caches content and works seamlessly whether you're online or offline.

## Features

### Core Functionality

- **Offline-First Architecture**: Articles are cached locally using IndexedDB, allowing full functionality without an internet connection
- **Smart Content Caching**: Automatically downloads and stores article previews and full content for offline access
- **Real-time Online/Offline Detection**: Visual indicator shows your current connection status
- **Full Article Reading**: Click any article to read complete content with images and formatting
- **Infinite Scroll**: Load more articles on-demand with pagination support
- **Search Functionality**: Search articles by title even when offline
- **Cache Staleness Detection**: Alerts you when cached data is outdated and offers one-click refresh

### User Experience

- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Clean Interface**: Modern, minimalist design with excellent readability
- **Progressive Enhancement**: Gracefully degrades features when offline
- **Fast Performance**: IndexedDB provides instant local data access
- **PWA Benefits**: Install as a standalone app on any device

## Technologies Used

### Frontend Framework & Build Tools

- **React 19.2**: Modern React with latest features
- **Vite 7.2**: Lightning-fast development and optimized production builds
- **Tailwind CSS 4.1**: Utility-first CSS framework for rapid UI development

### Data & Storage

- **IndexedDB**: Browser-native database for offline data persistence
- **idb 8.0**: Promise-based IndexedDB wrapper for cleaner async code

### PWA Features

- **vite-plugin-pwa**: Service worker generation and PWA manifest configuration
- **Service Worker**: Automatic caching and offline support

### Code Quality

- **ESLint**: Code linting with React-specific rules
- **React Hooks ESLint Plugin**: Ensures proper hooks usage
- **Tailwind Typography**: Enhanced styling for article content

## Installation

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Setup Steps

1. Clone the repository or navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Create optimized production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## How It Works

### Data Flow

1. **Initial Load (Online)**:
   - App fetches articles from dev.to API
   - Stores article previews in IndexedDB
   - Displays articles with metadata (title, author, preview text)

2. **Article Reading**:
   - When you click an article, app checks if full content is cached
   - If cached: Opens immediately with full HTML content
   - If not cached: Fetches full article from API and saves to IndexedDB
   - Offline: Only shows articles with cached full content

3. **Offline Mode**:
   - App detects when you go offline
   - Filters article list to only show fully cached articles
   - Search continues to work on cached data
   - Displays informational banner about offline status

4. **Cache Management**:
   - Articles older than 1 hour are marked as stale
   - Yellow banner prompts you to refresh when online
   - Refresh fetches latest articles and updates cache

### IndexedDB Schema

**Database**: `offline-blog-db`
**Version**: 2

**Object Store**: `articles`
- **Key Path**: `id`
- **Indexes**:
  - `updatedAt` - For sorting by modification time
  - `cachedAt` - For cache expiration checks
  - `title` - For efficient title-based search
  - `author` - For author-based filtering

**Article Object Structure**:
```javascript
{
  id: number,              // Unique article ID from dev.to
  title: string,           // Article title
  preview: string,         // Short description/excerpt
  bodyHtml: string,        // Full HTML content (when cached)
  author: string,          // Author name
  coverImage: string,      // Cover image URL
  publishedAt: string,     // ISO date string
  cachedAt: number,        // Timestamp when cached
  hasFullContent: boolean  // Whether full article is available
}
```

## Project Structure

```
app/
├── src/
│   ├── api/
│   │   └── blogApi.js           # dev.to API integration
│   ├── components/
│   │   └── ArticleList.jsx      # (Reserved for future use)
│   ├── db/
│   │   ├── db.js                # IndexedDB setup and configuration
│   │   └── articles.js          # Article CRUD operations
│   ├── hooks/
│   │   └── useOnlineStatus.js   # Online/offline detection hook
│   ├── App.jsx                  # Main application component
│   ├── main.jsx                 # React app entry point
│   ├── index.css                # Global styles (Tailwind imports)
│   └── reader.css               # Article content typography styles
├── public/
│   └── [PWA icons and assets]
├── index.html                   # HTML entry point
├── vite.config.js               # Vite and PWA configuration
├── eslint.config.js             # ESLint configuration
└── package.json                 # Dependencies and scripts
```

## Key Components & Modules

### App.jsx

Main application component that handles:
- Article list rendering
- Search functionality
- Online/offline status display
- Article detail view
- Pagination
- Cache staleness alerts
- Refresh mechanism

### api/blogApi.js

Functions for interacting with dev.to API:
- `fetchArticles(page)` - Fetch article previews with pagination
- `fetchFullArticle(id)` - Fetch complete article content with HTML

### db/articles.js

IndexedDB operations for article management:
- `getAllArticles()` - Retrieve all cached articles
- `saveArticles(articles)` - Save or update articles (with merge logic)
- `loadArticlesOfflineFirst(isOnline)` - Smart loading based on connection
- `searchByTitle(query)` - Search articles by title
- `getOfflineReadableArticles()` - Filter fully cached articles
- `loadNextPage(page)` - Fetch and cache next page of articles
- `refreshArticles()` - Force refresh from API
- `isCacheStale(articles)` - Check if cache is older than 1 hour
- `getLastUpdatedTime(articles)` - Get most recent cache timestamp

### hooks/useOnlineStatus.js

Custom React hook that:
- Monitors browser online/offline events
- Performs periodic internet connectivity checks (every 10 seconds)
- Returns boolean `online` status
- Uses Google favicon as lightweight connectivity test

## PWA Configuration

### Manifest Settings

- **Name**: Offline Blog Reader
- **Short Name**: BlogReader
- **Display**: Standalone (opens as a native-like app)
- **Theme Color**: White
- **Icons**: Multiple sizes (192x192, 512x512) for various devices

### Service Worker

- **Strategy**: Auto-update registration
- **Scope**: Full application
- **Precaching**: All build assets automatically cached

### Installation

Users can install the app on:
- **Android**: "Add to Home Screen" prompt
- **iOS**: "Add to Home Screen" via Safari share menu
- **Desktop**: Install prompt in Chrome/Edge address bar

## API Integration

### dev.to API

**Base URL**: `https://dev.to/api/articles`

**Endpoints Used**:

1. **List Articles** (GET `/articles`)
   - Parameters: `page`, `per_page` (20 articles per page)
   - Returns: Array of article previews

2. **Get Article** (GET `/articles/:id`)
   - Returns: Full article with HTML content

**Rate Limiting**: Respects dev.to API rate limits through caching strategy

**No Authentication**: Uses public endpoints (no API key required)

## Offline Features

### What Works Offline

✅ Browse previously cached articles
✅ Read full content of cached articles
✅ Search through cached articles
✅ View article metadata (author, date, cover images)
✅ Navigate between article list and detail views

### What Requires Connection

❌ Fetching new articles
❌ Loading articles not previously opened
❌ Refreshing stale cache
❌ Viewing full content of uncached articles

## Cache Strategy

### Automatic Caching

- Article previews cached on first load
- Full article content cached when opened
- Images referenced in articles loaded from original URLs

### Cache Duration

- **TTL**: 1 hour (configurable in `db/articles.js`)
- Visual indicator when cache becomes stale
- One-click refresh when online

### Smart Merging

When updating cached articles:
- Preserves full content if already cached
- Updates metadata (title, author, preview)
- Prevents data loss during refresh operations

## Browser Compatibility

### Minimum Requirements

- **Chrome/Edge**: Version 87+
- **Firefox**: Version 78+
- **Safari**: Version 14+
- **Opera**: Version 73+

### Required Browser APIs

- IndexedDB
- Service Workers
- Fetch API
- ES6+ JavaScript features

## Performance Optimizations

- **Lazy Loading**: Articles loaded on-demand with pagination
- **Incremental Caching**: Only fetches full content when needed
- **Index-based Search**: Fast title search using IndexedDB indexes
- **Minimal Re-renders**: Efficient React state management
- **Optimized Builds**: Vite's production optimization

## Styling Approach

### Tailwind CSS

- Utility-first CSS for rapid development
- Custom color palette using slate and blue tones
- Responsive breakpoints for mobile-first design

### Typography

Custom `.reader` class for article content:
- Clean, readable typography
- Proper heading hierarchy
- Styled code blocks and blockquotes
- Responsive images
- Syntax highlighting support

## Development Tips

### Modifying Cache TTL

Edit `CACHE_TTL` in `src/db/articles.js`:
```javascript
const CACHE_TTL = 1000 * 60 * 60; // 1 hour
```

### Testing Offline Mode

1. Open browser DevTools
2. Navigate to Network tab
3. Set throttling to "Offline"
4. Refresh the page

### Debugging IndexedDB

1. Open browser DevTools
2. Go to Application > Storage > IndexedDB
3. Expand `offline-blog-db` > `articles`
4. View stored data

### Changing API Source

Modify `ARTICLE_API` in `src/api/blogApi.js` to use different blog API

## Production Deployment

### Build Process

```bash
npm run build
```

Generates optimized files in `dist/` directory with:
- Minified JavaScript bundles
- Optimized CSS
- Service worker
- PWA manifest
- Compressed assets

### Deployment Platforms

Compatible with:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting
- Any static hosting service

### Environment Variables

No environment variables required - works out of the box!

## Future Enhancement Ideas

- Article categories and tags
- Bookmarking/favorites system
- Dark mode support
- Reading progress indicator
- Text-to-speech for articles
- Share functionality
- Author filtering
- Date range filtering
- Export articles for offline reading
- Background sync for automatic updates
- Push notifications for new articles

## Troubleshooting

### Articles Not Loading

1. Check browser console for errors
2. Verify internet connection
3. Clear IndexedDB and refresh
4. Check dev.to API status

### Service Worker Issues

1. Unregister old service workers in DevTools
2. Clear browser cache
3. Hard refresh (Ctrl/Cmd + Shift + R)

### Search Not Working

1. Ensure articles are cached
2. Check IndexedDB indexes exist
3. Verify database version is 2

## License

This project is open source and available for educational purposes.

## Credits

- **API**: [dev.to](https://dev.to) for providing free article API
- **Icons**: PWA icons included in public folder
- **Styling**: Tailwind CSS framework

---

Built with React, Vite, and IndexedDB. Designed for offline-first reading experiences.
