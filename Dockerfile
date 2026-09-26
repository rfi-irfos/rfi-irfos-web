# ── frontend ──────────────────────────────────────────────────────────────────
# Built OUTSIDE Docker now (run `npm run build` in frontend/ before `flyctl
# deploy`, so frontend/dist is current on disk before this Dockerfile runs).
# Found 2026-09-26: `npm run build` runs prerender.mjs, which drives ~190
# routes (19 static + ~170 individual /evidence/<slug>/ report pages, one per
# published disclosure) through a real headless Chromium instance. That
# workload repeatedly hit "Target crashed" (Chromium OOM-killed) on Fly's
# remote builder - 5 straight deploy failures, at a different route each time,
# confirming a resource ceiling on the builder machine rather than a code bug
# (prerender.mjs's own browser-restart-every-25-routes mitigation still didn't
# help, since some failures happened within the first ~19 static routes,
# before the restart threshold was ever reached). The build stage below only
# ever needed frontend/dist's contents, never Docker's own CPU/RAM to produce
# them - building locally (this box has more headroom, and it's already where
# report PDFs and ledger updates get produced by hand for every published
# disclosure) and copying the result in sidesteps the builder's memory ceiling
# entirely, independent of how large /evidence/ grows in the future.
# ─────────────────────────────────────────────────────────────────────────────

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
COPY frontend/dist                                 ./dist
ENV STATIC_DIR=/app/dist PORT=3000
EXPOSE 3000
CMD ["./backend"]
