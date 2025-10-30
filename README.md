# Reddish Trends — Social Media Stock Market Analyst

<img src="./public/readme_preview.png" alt="hero" width="1000"/>

Reddish Trends blends Reddit vibes with market data to surface the stocks people actually care about — then explains why. This repository contains the website frontend and integration glue that talks to the backend engine (hosted separately).

## Quick links
- Live site: [reddishtrends.com](https://reddishtrends.com)
- Engine (Github Repo): [Reddish-Trends-Engine](https://github.com/HaiderMalikk/Reddish-Trends-Engine)

## Why this is fun (and useful) 🎉
- Real-time Reddit discovery + Yahoo Finance enrichment
- Compact, explainable 3-step ranking algorithm — repeat community signals > one-off hype
- Optional GPT enrichment for human-friendly summaries
- Playable API for quick experiments

## Frontend & Website (this repo)
This repo is focused on the web experience. The frontend is responsible for:
- Calling the Engine API (hosted backend) to get Top / Worst / Rising stock summaries and detailed analysis.
- Presenting clear, visual summaries: headline cards, trend charts, small technical indicators (price / percent change / RSI), and short GPT-powered explanations when available.
- Allowing users to "play" with the analysis via a playground UI (custom subreddits, time windows, symbol lists).
- Persisting user preferences and logs using Firebase (NoSQL) — favorites, recent playground runs, and request counters.
- Handling cache state and refreshing UI automatically when the engine updates.

Frontend UI notes
- Headline cards show Top / Worst / Rising stocks with quick stats and a short rationale excerpt from the source post.
- Clicking a card opens a detail view that shows the underlying Reddit excerpt, price chart, RSI, and the optional GPT JSON summary.
- Playground UI exposes the same parameters the API supports so users can experiment without changing server-side cache.
- The app uses the cached engine results for fast rendering and shows an unobtrusive banner when a fresh analysis is in progress.

## How frontend and engine communicate
- The frontend POSTs to the engine endpoints (/api/home, /api/playground) and renders the JSON response.
- For cached results, frontend expects a "last_updated" timestamp and uses it to show freshness.
- Playgrounds are non-destructive — they trigger on-demand runs but do not overwrite the shared cache.

## Backend / Engine (conceptual)
This project integrates with a separate backend engine (linked above) that performs:
- Reddit fetching and preprocessing (title + body + top comments combined into a single text blob).
- Symbol extraction (simple $TICKER regex) and sentiment scoring per mention (VADER).
- Aggregation of mentions & average sentiment per symbol across communities.
- Market data enrichment using a financial data provider (price, high, low, percent change, RSI).
- An explainable 3-step ranking algorithm that produces Top, Worst and Rising lists based on:
  1. per-community peak selection,
  2. cross-community recurrence,
  3. mention-weight tiebreaking.
- Optional GPT-based summarization that returns structured JSON insights for headline stocks.
Note: the engine lives in a separate repository; this README avoids internal engine filenames and focuses on behavior and integration.

## Reddit fetching & preprocessing (conceptual)
- Fetch posts by type (hot/new/top/rising/controversial) with an optional time filter.
- For each post, gather title, body and up to N top-level comments (bounded `comment_limit`) and build a `full_text`.
- Run sentiment on `full_text`, extract $TICKER tokens, aggregate counts and average sentiment per ticker.
- The bounded comment strategy keeps response times predictable and reduces noisy deep-comment traversal.

## Quickstart — run & call the API ⚡

### Frontend (local dev)
- Install dependencies and run the frontend dev server (refer to frontend package scripts).
- Ensure you have engine API URL and firebase config in environment variables.

### Call the Engine API (curl)
```bash
curl -X POST http://localhost:5000/api/home \
  -H "Content-Type: application/json" \
  -d '{"request":{"type":"getgeneralanalysis"}}'
```

### Playground (Python)
```python
# example_playground.py
import requests
payload = {
  "request": {"type": "getplaygroundgeneralanalysis",
    "parameters": {"subreddits": ["wallstreetbets","stocks"], "limit": 20, "comment_limit": 5, "sort": "hot", "time": None, "period": "1mo"}
  }
}
r = requests.post("http://localhost:5000/api/playground", json=payload)
print(r.json())
```

### Use ranking results internally (conceptual)
- The engine returns structured Top/Worst/Rising items that the frontend consumes and renders. The frontend does not re-run ranking logic — it displays the engine's output.

### Sample Top_Stock shape (abbrev.)
```json
{
  "symbol":"$SPY",
  "company_name":"SPDR S&P 500 ETF Trust",
  "count":3,
  "sentiment":8.71,
  "price":576.68,
  "percentage_change":-1.21,
  "rsi":28.53,
  "GPT_Analysis":{"overview":"...","prediction":"...","Confidence Score":78}
}
```

## Firebase (NoSQL) — user document example
We store user preferences, cached requests, and logs in Firebase Firestore. Example user document (abbreviated):

```json
// example firebase user doc
{
  "uid": "mP7rW0bxvIV42ct9zMsqYMNJ7vE3",
  "createdAt": "2025-03-22T17:58:45.873Z",
  "email": "haidermalik662@gmail.com",
  "favorites": [
    { "companyName": "Identiv, Inc.", "symbol": "$INVE" }
  ],
  "requests": {
    "general_analysis": {
      "count": 37,
      "log": ["March 22, 2025 at 1:58:46..."]
    },
    "playground_analysis": {
      "count": 2,
      "log": [
        {
          "parameters": {
            "analysisType": "getplaygroundgeneralanalysis",
            "commentLimit": 10,
            "limit": 10,
            "period": "1mo",
            "sort": "hot",
            "subreddits": "wallstreetbets,stocks,stockmarket",
            "time": "none"
          },
          "timestamp": "2025-03-23T22:16:01-04:00"
        }
      ]
    }
  }
}
```

## Play with it 🔬
- `/api/home` → cached Top/Worst/Rising summaries (frontend reads & shows freshness)
- `/api/playground` → custom subreddit sets, time windows, symbol lists (playground runs are not cached globally)
- Cache stored in the engine's `cached_analysis.json` — scheduler updates it daily (engine behavior)

## Design notes (short)
- Deterministic & explainable ranking > black-box for a community product.  
- Bounded comment retrieval and caching reduce rate-limit headaches.  
- Frontend displays engine-provided results; playgrounds allow experimentation without changing shared cache.

## Screenshots & preview
<img src="./public/website_preview.png" alt="website preview" width="700"/>

Want it snappier? Open an issue with the exact playground params you want and I'll add a quick example.

# 

<p align="center">
    <img src="./public/logo-w-text.svg" alt="Reddish Trends logo" width="240"/>
</p>

<p align="center">
    <strong>Reddish Trends</strong> — Haider Malik<br/>
    &copy; 2025 Haider Malik. All rights reserved.
</p>