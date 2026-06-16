# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SC 智答 (SC AI, forked from AI Clash) is a Chrome/Edge browser extension that lets users query multiple AI models simultaneously in a single side panel, comparing answers in real-time. It uses DOM-level hooks (content scripts) to inject prompts into AI web pages — zero API cost. A companion website (packages/site) hosts marketing/docs, and a Java backend (packages/api) provides share links and a built-in summarizer.

## Architecture

The project is a monorepo with three packages plus the extension root:

```
.                          — Chrome extension (CRX build via @crxjs/vite-plugin)
├── src/background/        — Service worker (index.js); manages tabs, content scripts, task routing
│   ├── providers.js       — Provider registry: id, matchPattern, startUrl, apiConfig
│   └── index.js           — Main SW: message routing, tab lifecycle, web-task queue, summary router
├── src/content/           — Content scripts (one dir per provider + shared/)
│   └── {deepseek,doubao,wenxin,...}/index.js — Provider-specific DOM hook implementations
├── src/shared/            — Shared utilities (messages.js, config.js, logger.js, utils.js)
├── src/sidepanel/         — React 19 sidebar UI (Zustand store + Ant Design X)
│   ├── App.tsx            — Main sidebar component
│   ├── store/             — Zustand store (index.ts, types.ts, helpers.ts, messageHandler.ts)
│   └── components/        — ChannelList, ChannelSettingsDrawer, HistoryDrawer, GlobalSettingsModal
├── packages/inject/       — Standalone injection library (TypeScript, built with Vite)
│   ├── src/index.ts       — Core incremental streaming utilities
│   └── src/providers/     — Provider-specific injection adapters (doubao, longcat, mimo, wenxin, yuanbao)
├── packages/site/         — Marketing/docs site (Vite + React, separate from extension)
├── packages/api/          — Java Spring Boot backend (Maven, Docker)
│   ├── ShareController    — REST API for share links
│   ├── ShareService       — Share record management
│   └── ShareSnapshotValidator — Snapshot integrity validation
└── vite.config.js         — Extension build config (crx plugin, zip-pack, HMR)
```

Key patterns:
- **Manifest auto-generation**: `manifest.config.js` reads `PROVIDERS` from `providers.js` to auto-generate content_scripts and web_accessible_resources. Adding a provider = one entry in `providers.js`.
- **Task routing**: Sidepanel store → `DISPATCH_TASK` message → background SW → opens/activates provider tab → injects content script → sends `EXECUTE_PROMPT`. Responses flow back via `CHUNK_RECEIVED` messages.
- **Dual mode**: Each provider can run in `web` mode (DOM hook, zero-cost) or `api` mode (OpenAI SDK with user-configured API key).
- **State management**: Zustand store in `src/sidepanel/store/index.ts` is ~1400 lines handling all UI state, persistence (chrome.storage.local), history, and streaming buffers.

## Common Commands

Note: The repo has `bun.lock` but bun may not be installed. Replace `bun` with `npx bun` or `bun` as appropriate.

```bash
# Full development watch (build inject lib, type-check, watch extension)
bun run dev
# or without bun:
npx bun run dev

# Development site only
cd packages/site && bun dev

# Full production build (inject + extension)
bun run build

# Type-check both TS packages
bun run typecheck

# Run Playwright E2E tests
bun run test

# Run Playwright E2E tests in UI mode
bun run test:ui

# Build API Docker image
bun run build:api
```

## Adding a New Provider

1. Add an entry to `src/background/providers.js` PROVIDERS array with `id`, `name`, `matchPattern`, `startUrl`, and optional `apiConfig`.
2. Create `src/content/{id}/index.js` implementing the DOM hook logic for that provider.
3. The manifest and content scripts are auto-generated — no manual config needed.
4. If the provider needs an inject package adapter, add it to `packages/inject/src/providers/`.

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/background/providers.js` | Provider registry — the source of truth for all providers |
| `src/background/index.js` | Service worker: tab management, message routing, task queue |
| `src/sidepanel/store/index.ts` | Zustand store: all UI state, persistence, message handling |
| `src/shared/messages.js` | Centralized message type constants |
| `src/sidepanel/App.tsx` | Main sidebar UI (1800 lines) — bubble list, streaming display |
| `manifest.config.js` | Auto-generates Chrome extension manifest from providers.js |
| `vite.config.js` | Extension build config (crx plugin, zip-pack) |

## Store Architecture

The Zustand store (`src/sidepanel/store/index.ts`) is the single source of truth for the sidebar. Key concepts:

- **State**: `AppState` in `types.ts` defines ~40 fields including statusMap, responses, stageMap, historyList, summary state, etc.
- **Persistence**: `chrome.storage.local` keys like `aiclash.sidepanel.settings`, `aiclash.api.config`, `aiclash.chat.history`.
- **Streaming**: Raw text is accumulated in plain objects (`buffers` in helpers.ts) outside the store to avoid re-renders. A `tickStreamDisplay` rAF loop progressively displays characters.
- **History**: Multi-channel and single-channel sessions persisted separately, max 30 items each.
- **Message listener**: `messageHandler.ts` receives `CHUNK_RECEIVED`, `TASK_COMPLETED`, `ERROR` from the background and updates buffers/state.

## Service Worker Details

The background service worker (`src/background/index.js`) is ~1150 lines. Key responsibilities:
- **Tab management**: Per-provider tab mapping (persisted), tab discard prevention, tab reuse
- **Task queue**: Serial web-task queue (when focus-follow is on) or parallel dispatch (when off)
- **Keepalive**: Uses `chrome.alarms` with a 0.3min recurring alarm to keep the SW alive during active requests
- **Summary router**: Collects all provider responses and routes them to a summary provider via web mode
- **Content script lifecycle**: Detects stale context, reloads tabs, waits for `__aiclash_content_script_ready` marker

## E2E Testing

Playwright tests are in `test/e2e/sidebar.spec.js`. Runs in a persistent browser context with the extension loaded. Non-parallel by design.
