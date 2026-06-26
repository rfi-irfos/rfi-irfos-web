# ── frontend ──────────────────────────────────────────────────────────────────
FROM node:22-slim AS frontend
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
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
