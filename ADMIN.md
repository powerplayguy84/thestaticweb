# Admin Panel

The admin panel provides a web-based interface to manage your content without directly editing markdown files. It features a full-screen article editor with a content library for managing categories and articles.

## Accessing the Admin Panel

1. Navigate to `/admin` in your browser (e.g., `http://localhost:3000/admin`)
2. Enter the admin password (default: `admin123`)
3. The password is stored in `content/settings.md`

## Features

### Article Editor (Main View)

The main view displays a full markdown editor where you can:

- **Write/Edit Content**: Large textarea with monospace font for markdown editing
- **Set Metadata**: Category, index, and slug for the article
- **Preview Filename**: See the exact filename that will be created
- **Save**: Create new articles or update existing ones

#### Editor Layout

```
┌─────────────────────────────────────────────────────────┐
│ Article Editor                    [Content Library] [⎗] │
│ Editing: article-name / Create or edit markdown         │
├─────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────┐    │
│ │ Create New Article                                │    │
│ │ Write your content in markdown with frontmatter   │    │
│ ├──────────────────────────────────────────────────┤    │
│ │ Category: [guides ▼]  Index: [01]  Slug: [my...] │    │
│ │ 📄 content/guides/01-my-article.md                │    │
│ │                                                    │    │
│ │ Markdown Content                                   │    │
│ │ ┌────────────────────────────────────────────┐    │    │
│ │ │---                                          │    │    │
│ │ │title: "Article Title"                       │    │    │
│ │ │description: "..."                           │    │    │
│ │ │---                                          │    │    │
│ │ │                                             │    │    │
│ │ │# My Article                                 │    │    │
│ │ │                                             │    │    │
│ │ │Content goes here...                         │    │    │
│ │ └────────────────────────────────────────────┘    │    │
│ │                                                    │    │
│ │ [💾 Create Article]                                │    │
│ └──────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Content Library (Sheet Panel)

Click the "Content Library" button to open a side panel with:

```
┌────────────────────────────────┐
│ Content Library            [×] │
│ Manage categories & articles   │
├────────────────────────────────┤
│ Categories     [+ New Category]│
│ ┌────────────────────────────┐ │
│ │ guides            [✏️] [🗑️] │ │ ← Selected
│ │ tutorials         [✏️] [🗑️] │ │
│ │ sample            [✏️] [🗑️] │ │
│ └────────────────────────────┘ │
│                                 │
│ Articles in guides (2)          │
│                 [+ New Article] │
│ ┌────────────────────────────┐ │
│ │ Getting Started            │ │
│ │ 01-getting-started.md      │ │
│ │                   [✏️] [🗑️] │ │
│ ├────────────────────────────┤ │
│ │ Advanced Topics            │ │
│ │ 02-advanced-topics.md      │ │
│ │                   [✏️] [🗑️] │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

#### Category Management

- **View All Categories**: See all content categories in your project
- **Create Categories**: Add new category folders
- **Rename Categories**: Change category names (preserves all articles)
- **Delete Categories**: Remove empty categories

#### Article Management

- **Browse by Category**: Select a category to view its articles
- **Load Article**: Click any article to load it into the editor
- **Create New**: Start a fresh article
- **Delete Articles**: Remove articles from categories

All operations are performed within the sheet panel with confirmation dialogs for destructive actions.

## Article Structure

Articles follow this naming convention: `{index}-{slug}.md`

Example: `01-getting-started.md`

### Frontmatter Format

```markdown
---
title: "Article Title"
description: "Article description for SEO"
date: "2025-10-30"
featured: false
tags: ["tag1", "tag2"]
image: "/path/to/image.jpg"
---

# Article Content

Your markdown content here...
```

## Security

### Changing the Admin Password

1. Open `content/settings.md`
2. Find the `adminPassword` field in the frontmatter
3. Change it to your secure password:

```yaml
adminPassword: "your-secure-password-here"
```

4. Rebuild the site with `npm run build`

### Important Security Notes

- The password is stored in plain text in `settings.md`
- Authentication is session-based (cleared on browser close)
- **Do NOT commit your actual admin password to version control**
- Consider using environment variables for production
- Add `settings.md` to `.gitignore` if storing sensitive passwords

## Best Practices

### Workflow: Creating a New Article

1. Click "Content Library" button
2. Select or create a category
3. Click "New Article" button (or close library to start fresh)
4. Fill in category, index, and slug
5. Write your markdown content with frontmatter
6. Click "Create Article" to save

### Workflow: Editing an Article

1. Click "Content Library" button
2. Navigate to the category
3. Click on the article you want to edit
4. Make your changes in the editor
5. Click "Update Article" to save

### Workflow: Managing Categories

1. Click "Content Library" button
2. Use the category list actions:
   - Click "+" to create a new category
   - Click "✏️" to rename a category
   - Click "🗑️" to delete an empty category

### Tips

1. **Always backup** before making bulk changes
2. **Use descriptive slugs** for better SEO and URLs
3. **Index articles sequentially** (01, 02, 03...) for proper ordering
4. **Keep categories organized** and follow a consistent naming scheme
5. **Test changes** in development before deploying
6. **Save frequently** while editing long articles

## Troubleshooting

### Cannot Login

- Check that `content/settings.md` exists
- Verify the `adminPassword` field is set in the frontmatter
- Clear browser session storage and try again

### Category Won't Delete

- Categories must be empty before deletion
- Delete all articles in the category first

### Article Not Saving

- Ensure index is a valid number
- Check that slug doesn't contain special characters
- Verify frontmatter is properly formatted

## API Endpoints

The admin panel uses these internal API routes:

- `POST /api/admin/auth` - Authenticate with password
- `GET /api/admin/categories` - List all categories
- `POST /api/admin/categories` - Create/rename/delete categories
- `GET /api/admin/articles` - Get articles in a category
- `POST /api/admin/articles` - Create/update/delete articles

## Development

All admin-related code is in:

- `/src/app/admin/page.tsx` - Main admin page with editor
- `/src/app/api/admin/*` - API routes
- `/src/components/admin/ArticleEditor.tsx` - Main article editor component
- `/src/components/admin/ContentLibrary.tsx` - Category & article browser
- `/src/lib/admin.ts` - Admin utility functions

### Component Architecture

```
AdminPage (page.tsx)
├── Login Form (unauthenticated)
└── Editor View (authenticated)
    ├── Header with ContentLibrary button
    ├── ArticleEditor (main editor)
    └── ContentLibrary (sheet)
        ├── Category List (with CRUD)
        └── Article List (by category)
```

The old `CategoryManager.tsx` and `ArticleManager.tsx` components are no longer used and can be removed.
