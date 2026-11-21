#!/usr/bin/env bash
# Google Ads offline conversions: ad_conversions.jsonl (server) -> import CSV (2026-11-21).
#
#   scripts/ads-conversions-csv.sh [since YYYY-MM-DD] > conversions.csv
#
# Upload in Google Ads: Goals > Conversions > Uploads > + > Upload file. The conversion
# names (Kontaktanfrage, Quick Check, Kauf) must exist as actions with source
# "Import > Clicks". Google accepts clicks up to 90 days old; re-uploading the same
# row is deduplicated by Google (click id + name + time).
set -euo pipefail
SINCE="${1:-1970-01-01}"
ssh colony 'cat /srv/data/rfi-web/data/ad_conversions.jsonl 2>/dev/null || true' | python3 -c '
import sys, json, csv
from datetime import datetime, timezone
since = sys.argv[1]
w = csv.writer(sys.stdout, lineterminator="\n")
print("Parameters:TimeZone=+0000")
w.writerow(["Google Click ID", "Conversion Name", "Conversion Time", "Conversion Value", "Conversion Currency"])
for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    r = json.loads(line)
    t = datetime.fromisoformat(r["time"].replace("Z", "+00:00")).astimezone(timezone.utc)
    if t.strftime("%Y-%m-%d") < since:
        continue
    v = r.get("value")
    w.writerow([r["click_id"], r["conversion"], t.strftime("%Y-%m-%d %H:%M:%S"),
                "" if v is None else f"{v:.2f}", r.get("currency", "") if v is not None else ""])
' "$SINCE"
