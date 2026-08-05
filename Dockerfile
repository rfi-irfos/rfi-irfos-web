# ── frontend ──────────────────────────────────────────────────────────────────
FROM node:22-slim AS frontend
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
# Vite inlines import.meta.env.VITE_* at BUILD time. This build never received
# VITE_WEB3FORMS_KEY, so on the Fly-served site the constant was undefined, the
# form's send branch was dead-code-eliminated, and submissions were silently
# discarded while still showing a success message. The GitHub Actions workflow
# does set the secret, but it builds for GitHub Pages, and rfi-irfos.com is
# served by Fly - the key was wired to a pipeline nobody serves from.
# Pass it through with:  fly deploy --build-arg VITE_WEB3FORMS_KEY=<key>
# Not a secret in any meaningful sense: a Web3Forms access key is a public
# per-form endpoint id and ends up readable in the client bundle either way.
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
