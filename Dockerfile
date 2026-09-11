# ── frontend ──────────────────────────────────────────────────────────────────
FROM node:22-slim AS frontend
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
RUN npx playwright install --with-deps chromium
COPY frontend/ ./
# Vite inlines import.meta.env.VITE_* at BUILD time, not runtime. Web3Forms'
# free tier also rejects server-to-server submissions outright ("Pro plan
# required" - confirmed against their API), so this key can't be moved into
# the backend either: it has to be baked into the client bundle here.
# `fly secrets set VITE_WEB3FORMS_KEY=...` alone does NOT do this - it only
# reaches the running container's env, never this build stage. Pass it with:
#   fly deploy --build-arg VITE_WEB3FORMS_KEY=<key>
# Not a secret in any meaningful sense: Web3Forms documents this key as safe
# to use in client-side code, and it ends up readable in the bundle either way.
ARG VITE_WEB3FORMS_KEY=""
ENV VITE_WEB3FORMS_KEY=$VITE_WEB3FORMS_KEY
RUN npm run build

# ── backend ───────────────────────────────────────────────────────────────────
FROM rust:1.88-slim AS backend
RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY backend/Cargo.toml backend/Cargo.lock ./
RUN mkdir src && echo 'fn main(){}' > src/main.rs && cargo build --release && rm -rf src
COPY backend/src ./src
RUN touch src/main.rs && cargo build --release

# ── runtime ───────────────────────────────────────────────────────────────────
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=backend  /app/target/release/backend   ./backend
COPY --from=frontend /app/dist                     ./dist
ENV STATIC_DIR=/app/dist PORT=3000
EXPOSE 3000
CMD ["./backend"]
