# AI Receipt Tracker

Live demo: **https://next-js-receipt-tracker.vercel.app/**

AI‑powered receipt tracking app built with **Next.js (App Router, TypeScript)**, **Convex** (DB + Storage), and **Inngest** (event‑driven workflows). A small **multi‑agent** setup (ChatGPT + Claude) parses PDFs/images into clean, structured data and stores the result for search and display. Deployed on **Vercel**.

---

## Features
- **Upload PDFs or images** of receipts
- **AI extraction** of merchant, items, totals, dates, payment method
- **Multi‑agent pipeline** orchestrated by Inngest (routing + tools)
- **Convex storage** for raw file + normalized receipt data
- **Signed download URLs** for original files
- **Per‑user authz** check before returning private receipts
- **Pinned model versions** to avoid provider alias issues (e.g., `claude-3-5-sonnet-20241022`)

---

## Architecture
```text
Client (Next.js)
   ├─ Upload file → Convex Storage (fileId)
   ├─ Create/Update receipt doc in Convex (status=pending)
   └─ Fire Inngest event: EXTRACT_DATA_FROM_PDF_AND_SAVE_TO_DATABASE { receiptId, url }

Inngest (Agent Network)
   ├─ Receipt Scanning Agent
   │   └─ parse-pdf tool → Anthropic Claude (document URL + extraction prompt)
   ├─ Database Agent
   │   └─ save-to-database tool → Convex mutation
   └─ Router uses defaultModel (pinned Claude) for planning

Convex
   ├─ receipts table (file + structured fields)
   ├─ getReceiptById (authz check → Doc | null)
   └─ getReceiptsDownloadUrl (signed URL)
```

---

## Tech Stack
- **Frontend:** Next.js (TypeScript), Tailwind CSS
- **Backend:** Convex (DB + Storage), Inngest + AgentKit
- **AI Providers:** OpenAI (GPT‑4o‑mini), Anthropic (Claude 3.5 Sonnet)
- **Infra:** Vercel deploy, Inngest Cloud

---

## Getting Started (Local Dev)

### Prerequisites
- **Node 18+**
- **Convex CLI** and **Inngest CLI**
  ```bash
  npm i -g convex
  npm i -g inngest-cli
  # or use npx in the commands below
  ```

### Environment variables
Create `.env.local` in the project root and set:
```bash
# AI providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Inngest (shown in Inngest dashboard/integration)
INNGEST_SIGNING_KEY=...
INNGEST_EVENT_KEY=...

# Optional: centralize model name to avoid code edits
CLAUDE_MODEL=claude-3-5-sonnet-20241022
```
> If you use separate environments (dev/prod), make sure the keys match the environment you’re running.

### Install & run
```bash
# 1) Install deps
npm i  # or pnpm i / yarn

# 2) Start Convex (generates types & watches functions)
npx convex dev

# 3) Start Inngest Dev Server (local orchestrator)
npx inngest-cli@latest dev

# 4) Start Next.js
npm run dev
```
Open: `http://localhost:3000` (Next), `http://localhost:8288` (Inngest Dev UI).

---

## Inngest Endpoint
Ensure you expose your functions via the Next.js route (App Router):
```ts
// app/api/inngest/route.ts
import { serve } from "inngest/next";
import { server } from "@/inngest/agent"; // exports { agents, networks } or server

export const { GET, POST, PUT } = serve(server);
```
The **Dev Server** auto-discovers locally; in Cloud you can **sync** by hitting the deployed endpoint’s `PUT` once:
```bash
curl -X PUT https://<your-vercel-domain>/api/inngest
```

---

## Event Contract
Event name used to kick off extraction (from code):
```
EXTRACT_DATA_FROM_PDF_AND_SAVE_TO_DATABASE
```
Payload example:
```json
{
  "data": {
    "receiptId": "<Convex Doc Id>",
    "url": "https://example.com/receipt.pdf"
  }
}
```

---

## Convex Data Model (excerpt)
```ts
// convex/schema.ts
receipts: defineTable({
  userId: v.string(),
  fileName: v.string(),
  fileDisplayName: v.optional(v.string()),
  fileId: v.id("_storage"),
  uploadedAt: v.number(),
  size: v.number(),
  mimeType: v.string(),
  status: v.string(),

  merchantName: v.optional(v.string()),
  merchantAddress: v.optional(v.string()),
  merchantContact: v.optional(v.string()),
  transactionDate: v.optional(v.string()),
  transactionAmount: v.optional(v.string()),
  currency: v.optional(v.string()),
  receiptSummary: v.optional(v.string()),
  items: v.array(v.object({
    name: v.string(),
    quantity: v.number(),
    unitPrice: v.number(),
    totalPrice: v.number(),
  })),
})
```
Key queries:
```ts
// getReceiptById: returns Doc<'receipts'> | null (with authz)
// getReceiptsDownloadUrl: returns string | null
```

---

## Deployment
- Deploy with **Vercel**
- Set env vars in Vercel project (OpenAI/Anthropic/Inngest keys)
- Install the **Inngest × Vercel** integration (optional but recommended)
- After deploy, manually sync once if needed:
  ```bash
  curl -X PUT https://<your-vercel-domain>/api/inngest
  ```

---

## Roadmap
- Category tagging & budgets
- Currency/locale auto‑detection
- Bulk import & CSV export
- Receipt correction UI (editable line‑items)


---

## Links
- Live: https://next-js-receipt-tracker.vercel.app/


