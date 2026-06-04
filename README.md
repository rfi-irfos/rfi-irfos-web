# RFI-IRFOS Web Template

A minimalist, high-performance website builder template kit. Fast. Simple. No bloat.

**Vision:** Give customers a dead-simple way to manage their homepage — login with Gmail, edit pages and images in a browser, done. No GoDaddy/Jimdo/WordPress UI madness.

## Setup

### Backend (Rust + Axum)
```bash
cd backend
cargo build
cargo run
```
Backend runs on `http://localhost:3000`

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend dev server runs on `http://localhost:5173`

## Quick Start

**Start both servers:**

```bash
# Terminal 1: Backend
cd backend && cargo run

# Terminal 2: Frontend
cd frontend && npm run dev
```

Then open: **http://localhost:5173**

## Project Structure

```
rfi-irfos-web-template/
├── backend/           Rust API server (Axum)
│   ├── src/
│   └── Cargo.toml
├── frontend/          React client (Vite)
│   ├── src/
│   ├── public/
│   └── package.json
└── docs/              (Coming soon)
```

## Stack

- **Backend:** Rust, Axum 0.7, Tokio
- **Frontend:** React 19, TypeScript, Vite, ESLint
- **Auth:** Gmail OAuth (planned)
- **Hosting:** GitHub + your DNS

## Roadmap

- [ ] Gmail OAuth login
- [ ] Page & content CRUD API
- [ ] Image upload & asset management
- [ ] Multi-tenant content isolation
- [ ] Public website renderer
- [ ] Edit UI (minimal, no bloat)
- [ ] Deploy to production

---

**Ready to run?** Start the servers above and click the link below:

👉 **[Open App → http://localhost:5173](http://localhost:5173)**
