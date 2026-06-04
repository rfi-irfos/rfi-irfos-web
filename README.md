# RFI-IRFOS Web Template

A minimalist, high-performance website builder kit. Fast. No bloat. No subscription.

**The product:** Clone this repo for any client. They get a fully-built website on their domain. If they want Tier 3, they also get a Gmail-authenticated admin panel to edit everything themselves — texts, images, products — live, no deployments needed.

**[http://localhost:5173](http://localhost:5173)** — public site  
**[http://localhost:5173/admin](http://localhost:5173/admin)** — admin panel

---

## Pricing

| Tier | Price | What the client gets |
|------|-------|----------------------|
| **Basis** | €500 | Complete homepage, live on their domain. Fast, clean, done. One-time. |
| **Premium** | €1.400 | Better site with product categories, tabs, full contact section. Ongoing support: we build new features on request. |
| **Enterprise** | €2.900 | Full frontend + CMS backend. Client logs in with Gmail, edits everything themselves. Hosting included. Support included. No subscription, ever. |

**Standard for every client — same tiers, no exceptions.**

---

## How It Works

```
Clone repo
  Copy .env.example → .env, set ALLOWED_EMAIL=client@gmail.com
  cargo run (backend, port 3000)
  npm run dev (frontend, port 5173)

yoursite.at           → public site, always live
yoursite.at/admin     → Gmail login → admin panel → edit everything → Save
                                                                        |
                                                             PUT /api/content
                                                             writes content.json
                                                             live on next page load
```

---

## Quick Start

```bash
# Terminal 1: Backend
cd backend && cargo run

# Terminal 2: Frontend
cd frontend && npm run dev
```

Open: **[http://localhost:5173](http://localhost:5173)** — public site  
Admin: **[http://localhost:5173/admin](http://localhost:5173/admin)** — login and edit

---

## Admin Panel

- **Split View** — edit on the left, live preview on the right, updates as you type
- **Preview** — full-screen modal preview
- Sections: Site Settings (colors, font), Navigation, Hero, Features, Products, Contact, Footer
- Image upload per section/product
- Gmail OAuth login (or `DEV_MODE=true` to bypass locally)

---

## Stack

- **Backend:** Rust, Axum 0.7, Tokio — content API, OAuth2, file uploads, serves the SPA
- **Frontend:** React 19, TypeScript, Vite — public renderer + admin editor
- **Auth:** Google OAuth2 (`GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`)
- **Content:** `content.json` on disk, PUT to update, no database needed
- **Uploads:** `/uploads/` directory, served as static files

---

## Project Structure

```
rfi-irfos-web-template/
├── backend/
│   ├── src/
│   │   ├── main.rs       router, shared state
│   │   ├── auth.rs       Google OAuth2, sessions
│   │   ├── content.rs    GET/PUT content.json
│   │   └── upload.rs     image upload
│   ├── content.json      site content (auto-created on first run)
│   └── uploads/          uploaded images
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PublicSite.tsx   renders the live website
│   │   │   ├── AdminPanel.tsx   the CMS editor
│   │   │   └── LoginPage.tsx    Google login screen
│   │   ├── hooks/
│   │   │   ├── useContent.ts
│   │   │   └── useAuth.ts
│   │   └── types/
│   │       └── content.ts
│   └── dist/             built frontend (served by backend in production)
└── .env.example          copy to .env and fill in
```

---

## Production Deploy

```bash
# Build frontend
cd frontend && npm run build

# Build backend (serves the frontend SPA + API from one binary)
cd backend && cargo build --release

# Set env vars, run
./target/release/backend
```

Point DNS to the server. Done.
