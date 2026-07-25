use axum::{
    body::Bytes,
    extract::State,
    http::{HeaderMap, StatusCode},
    response::IntoResponse,
    Json,
};
use hmac::{Hmac, Mac};
use sha2::Sha256;
use serde::{Deserialize, Serialize};
use crate::AppState;

#[derive(Deserialize)]
pub struct CheckoutRequest {
    pub tier: String,
}

#[derive(Serialize)]
struct CheckoutResponse {
    url: String,
}

struct TierInfo {
    label:     &'static str,
    amount:    u64,   // cents
    recurring: bool,
}

fn tier_info(tier: &str) -> Option<TierInfo> {
    match tier {
        // Security audits
        "remediation"   => Some(TierInfo { label: "RFI-IRFOS Remediation Advisory",        amount:   450_000, recurring: false }),
        "confidential"  => Some(TierInfo { label: "RFI-IRFOS Confidential Audit",           amount:   900_000, recurring: false }),
        "enterprise_nda"=> Some(TierInfo { label: "RFI-IRFOS Enterprise NDA Audit",         amount: 1_800_000, recurring: false }),
        // Retainer (subscription)
        "retainer"      => Some(TierInfo { label: "RFI-IRFOS Security Retainer",            amount:   150_000, recurring: true  }),
        // Market research
        "market_overview"  => Some(TierInfo { label: "RFI-IRFOS Market Overview Report",     amount:   250_000, recurring: false }),
        "competitor_intel" => Some(TierInfo { label: "RFI-IRFOS Competitor Intelligence",    amount:   750_000, recurring: false }),
        "sector_intel"     => Some(TierInfo { label: "RFI-IRFOS Sector Intelligence Report", amount: 1_800_000, recurring: false }),
        "ongoing_intel"    => Some(TierInfo { label: "RFI-IRFOS Ongoing Intelligence",       amount:   450_000, recurring: true  }),
        // Web development
        "web_landing"      => Some(TierInfo { label: "RFI-IRFOS Landing Page",              amount:   150_000, recurring: false }),
        "web_full"         => Some(TierInfo { label: "RFI-IRFOS Full Site",                 amount:   450_000, recurring: false }),
        "web_enterprise"   => Some(TierInfo { label: "RFI-IRFOS Enterprise Site",           amount: 1_800_000, recurring: false }),
        _ => None,
    }
}

pub async fn create_checkout(
    State(state): State<AppState>,
    Json(body): Json<CheckoutRequest>,
) -> impl IntoResponse {
    let info = match tier_info(&body.tier) {
        Some(i) => i,
        None => return (StatusCode::BAD_REQUEST, format!("unknown tier: {}", body.tier)).into_response(),
    };

    let client = reqwest::Client::new();
    let origin      = "https://rfi-irfos.com";
    let success_url = format!("{}/pricing?session_id={{CHECKOUT_SESSION_ID}}&success=1", origin);
    let cancel_url  = format!("{}/pricing?cancelled=1", origin);

    let mode = if info.recurring { "subscription" } else { "payment" };

    let mut params = vec![
        ("mode".to_string(),                                          mode.to_string()),
        ("success_url".to_string(),                                   success_url),
        ("cancel_url".to_string(),                                    cancel_url),
        ("line_items[0][price_data][currency]".to_string(),           "eur".to_string()),
        ("line_items[0][price_data][product_data][name]".to_string(), info.label.to_string()),
        ("line_items[0][price_data][unit_amount]".to_string(),        info.amount.to_string()),
        ("line_items[0][quantity]".to_string(),                       "1".to_string()),
        // Embed the tier so the Stripe webhook can attribute the paid event to the
        // correct Lighthouse funnel leg (offer_paid:<tier>) without guessing.
        ("metadata[tier]".to_string(),                                body.tier.clone()),
    ];

    if info.recurring {
        params.push(("line_items[0][price_data][recurring][interval]".to_string(), "month".to_string()));
    }

    let res = client
        .post("https://api.stripe.com/v1/checkout/sessions")
        .basic_auth(&state.stripe_secret_key, Option::<&str>::None)
        .form(&params)
        .send()
        .await;

    match res {
        Ok(r) if r.status().is_success() => {
            let json: serde_json::Value = r.json().await.unwrap_or_default();
            let url = json["url"].as_str().unwrap_or("").to_string();
            (StatusCode::OK, Json(CheckoutResponse { url })).into_response()
        }
        Ok(r) => {
            let status = r.status();
            let text = r.text().await.unwrap_or_default();
            tracing::error!("Stripe checkout error {}: {}", status, text);
            (StatusCode::BAD_GATEWAY, text).into_response()
        }
        Err(e) => {
            tracing::error!("Stripe request failed: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response()
        }
    }
}

pub async fn webhook(
    State(state): State<AppState>,
    headers: HeaderMap,
    body: Bytes,
) -> impl IntoResponse {
    let sig_header = match headers.get("stripe-signature").and_then(|v| v.to_str().ok()) {
        Some(s) => s.to_string(),
        None => return (StatusCode::BAD_REQUEST, "missing stripe-signature").into_response(),
    };

    let mut timestamp = "";
    let mut sig = "";
    for part in sig_header.split(',') {
        if let Some(t) = part.strip_prefix("t=")  { timestamp = t; }
        if let Some(s) = part.strip_prefix("v1=") { sig = s; }
    }

    if timestamp.is_empty() || sig.is_empty() {
        return (StatusCode::BAD_REQUEST, "malformed stripe-signature").into_response();
    }

    let signed_payload = format!("{}.{}", timestamp, String::from_utf8_lossy(&body));
    let mut mac = match Hmac::<Sha256>::new_from_slice(state.stripe_webhook_secret.as_bytes()) {
        Ok(m) => m,
        Err(_) => return (StatusCode::INTERNAL_SERVER_ERROR, "hmac init error").into_response(),
    };
    mac.update(signed_payload.as_bytes());
    let expected = hex::encode(mac.finalize().into_bytes());

    if expected != sig {
        tracing::warn!("Stripe webhook signature mismatch");
        return (StatusCode::UNAUTHORIZED, "invalid signature").into_response();
    }

    let event: serde_json::Value = match serde_json::from_slice(&body) {
        Ok(v) => v,
        Err(e) => return (StatusCode::BAD_REQUEST, e.to_string()).into_response(),
    };

    let event_type = event["type"].as_str().unwrap_or("");
    tracing::info!("Stripe webhook received: {}", event_type);

    match event_type {
        "checkout.session.completed" => {
            let session = &event["data"]["object"];
            let amount  = session["amount_total"].as_u64().unwrap_or(0);
            let currency= session["currency"].as_str().unwrap_or("eur");
            let email   = session["customer_details"]["email"].as_str().unwrap_or("");
            let tier    = session["metadata"]["tier"].as_str().unwrap_or("");
            tracing::info!("Payment completed: {} {} from {} (tier: {})", amount, currency, email, tier);
            // Close the Lighthouse funnel loop: beam offer_paid:<tier> to the same
            // first-party tracker the public site uses, so click→attempt→paid all
            // live in one table (web_visits) without touching PII or cookies.
            if !tier.is_empty() {
                let section = format!("offer_paid:{}", tier);
                let payload = serde_json::json!({
                    "path": "/pricing",
                    "referrer": "",
                    "site": "rfi-irfos",
                    "section": section,
                });
                if let Ok(client) = reqwest::Client::builder().timeout(std::time::Duration::from_secs(5)).build() {
                    let _ = client
                        .post("https://lighthouse-rfi-irfos.fly.dev/lighthouse/api/track")
                        .header("Content-Type", "application/json")
                        .json(&payload)
                        .send()
                        .await;
                }
            }
        }
        "payment_intent.payment_failed" => {
            tracing::warn!("Payment failed: {:?}", event["data"]["object"]["last_payment_error"]);
        }
        _ => {
            tracing::debug!("Unhandled Stripe event: {}", event_type);
        }
    }

    StatusCode::OK.into_response()
}
