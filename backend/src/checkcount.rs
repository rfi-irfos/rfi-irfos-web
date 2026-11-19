//! Total number of domain checks, shown as a figure on the homepage. Only one number lives in
//! the database: no domain, no address, no time per check, so the "nothing is stored" promise of
//! the website check stays true.
use crate::AppState;
use axum::{extract::State, http::header, response::IntoResponse, Json};
use sqlx::SqlitePool;

async fn ensure(db: &SqlitePool) -> Result<(), sqlx::Error> {
    sqlx::query("CREATE TABLE IF NOT EXISTS check_counter (id INTEGER PRIMARY KEY CHECK (id = 1), n INTEGER NOT NULL)").execute(db).await?;
    sqlx::query("INSERT OR IGNORE INTO check_counter (id, n) VALUES (1, 0)").execute(db).await?;
    Ok(())
}

/// Counts one finished check. Failures are logged and never reach the visitor.
pub async fn bump(db: &SqlitePool) {
    let r = async {
        ensure(db).await?;
        sqlx::query("UPDATE check_counter SET n = n + 1 WHERE id = 1").execute(db).await
    }.await;
    if let Err(e) = r { tracing::warn!("check counter bump failed: {e}"); }
}

pub async fn total(db: &SqlitePool) -> i64 {
    if ensure(db).await.is_err() { return 0; }
    sqlx::query_scalar::<_, i64>("SELECT n FROM check_counter WHERE id = 1").fetch_one(db).await.unwrap_or(0)
}

pub async fn get_total(State(state): State<AppState>) -> impl IntoResponse {
    let n = total(&state.db).await;
    ([(header::CACHE_CONTROL, "public, max-age=30")], Json(serde_json::json!({ "total": n })))
}

#[cfg(test)]
mod tests {
    use super::*;

    async fn pool() -> SqlitePool {
        sqlx::sqlite::SqlitePoolOptions::new().max_connections(1).connect("sqlite::memory:").await.unwrap()
    }

    #[tokio::test]
    async fn starts_at_zero() {
        assert_eq!(total(&pool().await).await, 0);
    }

    #[tokio::test]
    async fn counts_every_bump_once() {
        let db = pool().await;
        for _ in 0..3 { bump(&db).await; }
        assert_eq!(total(&db).await, 3);
    }

    #[tokio::test]
    async fn keeps_a_single_row() {
        let db = pool().await;
        bump(&db).await; ensure(&db).await.unwrap(); bump(&db).await;
        let rows: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM check_counter").fetch_one(&db).await.unwrap();
        assert_eq!((rows, total(&db).await), (1, 2));
    }
}
