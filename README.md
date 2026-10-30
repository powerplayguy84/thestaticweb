# The Static Web

**The AI-First Content Management System & Knowledge Platform.**

A modern, markdown-native starter engineered for humans and AI agents to collaborate seamlessly on portals, knowledge bases, and digital publications. Built with Next.js 16, React 19, and Tailwind CSS v4.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/powerplayguy84/thestaticweb)

---

## 🤖 Why AI-First?

Traditional CMSs lock content behind heavy SQL databases, complex admin panels, and closed APIs. **The Static Web** treats file-system Markdown, front matter, and Git as first-class citizens:

* **Natural AI Interface:** AI coding agents (Antigravity, Cursor, Claude, Copilot) can read, generate, restructure, and publish articles, categories, and tags directly with no headless API tokens or database migrations required.
* **Autonomous Workflows:** Pair with your favorite LLM or CLI agent to turn meeting transcripts, research notes, or rough ideas into formatted, cross-linked, SEO-optimized articles with automated hero images and diagrams.
* **Deterministic & Git-Backed:** Complete version history, rollbacks, and team review pull requests for every piece of AI-generated content.

---

## ⚡ 3-Step Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/powerplayguy84/thestaticweb.git my-portal
cd my-portal
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see your portal running.

### 2. Configure Your Brand
Edit `content/homepage.md` and `content/settings.md`:
* **Site title & tagline:** Set `title` and `subtitle` in `content/homepage.md`.
* **Theme & colors:** Adjust palettes in `content/theme.md` or visit `/theme` in your browser.
* **Navigation:** Organize visible and hidden categories in `content/settings.md`.

### 3. Add Content & Categories (Manually or with AI)
Organize content using folders with numeric prefixes inside `content/`:
```bash
content/
├── 01-getting-started/
│   ├── overview.md
│   └── installation.md
├── 02-guides/
│   └── deployment.md
├── _templates/
│   └── article-template.md
├── homepage.md
├── settings.md
└── theme.md
```
Ask your AI assistant: *"Create a new article about Next.js in 02-guides based on `_templates/article-template.md`"*.

Folders automatically transform into categories, navigation bars, and search indexes.

---

## 🚀 Key Features

* 🤖 **AI-Ready Content Pipeline:** Out-of-the-box workflows and guidelines for LLM content creation.
* 📝 **Markdown & Front Matter Native:** Zero-database content publishing with YAML front matter.
* 🔍 **Instant Client-Side Search:** Pre-indexed modal search with `Cmd+K` / `Ctrl+K`.
* 🎨 **Theme System:** Light, Dark, and System modes with customized CSS variable palettes.
* 📊 **Interactive Elements:** Code syntax highlighting and Mermaid diagram rendering.
* 🛠️ **Admin Dashboard:** Built-in lightweight administrative overview at `/admin`.
* ⚡ **Modern Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons.

---

## 📚 Documentation

All comprehensive guides, architectural references, and workflows are in the [`docs/`](./docs) directory:

| Guide | Description |
| :--- | :--- |
| [AI Content Creation](./docs/AI_CONTENT_CREATION.md) | Prompts, rules, and best practices for AI-assisted writing |
| [Getting Started](./docs/GETTING_STARTED.md) | Step-by-step setup walkthrough |
| [Customization Guide](./docs/CUSTOMIZATION.md) | Layouts, styling, theme colors, and component tweaks |
| [Deployment Guide](./docs/DEPLOYMENT.md) | Deploying to Vercel, Cloudflare, Netlify, or static export |
| [Admin Panel Guide](./docs/ADMIN.md) | Using the built-in `/admin` dashboard |
| [Troubleshooting & FAQ](./docs/TROUBLESHOOTING.md) | Common issues, npm resolution, and solutions |
| [Architecture Overview](./docs/ARCHITECTURE.md) | System design, content pipeline, and routing |
| [Full Docs Index](./docs/DOCUMENTATION_INDEX.md) | Master index of all 20+ reference guides |

---

## 📦 Deployment

### Deploy to Vercel (Recommended)
Push your repository to GitHub, import it into [Vercel](https://vercel.com), and deploy. No database configuration required.

### Static Export
To export static HTML/CSS files:
```bash
npm run build
```
See [Deployment Documentation](./docs/DEPLOYMENT.md) for full static hosting options.

---

## 📄 License

MIT © [The Static Web](https://github.com/powerplayguy84/thestaticweb)
