# SC 智答 (SC AI)

<p align="center">
  <img src="public/logo.png" width="120" alt="SC AI Logo">
</p>

[![GitHub Release](https://img.shields.io/github/v/release/SuxL0228/sc-ai?style=for-the-badge)](https://github.com/SuxL0228/sc-ai/releases)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/gpl-3.0)

**[简体中文](README.md) ｜ English**

> 💥 Ask one question to N Chinese AI models at once, let their answers clash, then have an AI judge summarize the best answer!
>
> 🔥 Supported: DeepSeek｜Doubao｜Tongyi Qianwen｜Tencent Yuanbao｜ERNIE Bot｜Xiaomi MIMO

> 📢 **This is a fork (secondary development).** It is based on the open-source project **[AI Clash / ai-clash](https://github.com/null-object-0000/ai-clash)**.
> Below we first explain **what the original project does**, then **what this fork changes**.

---

## 🧩 What does the original project (ai-clash) do?

[ai-clash](https://github.com/null-object-0000/ai-clash), built by [null-object-0000](https://github.com/null-object-0000), offers an excellent core:

- **Multi-AI side-by-side**: Ask multiple AI web apps simultaneously in one browser side panel and compare answers in real time.
- **Zero API cost**: Reuses the compute of the web versions you're already logged into via local DOM hooks — no API tokens consumed.
- **AI judge**: Automatically consolidates the answers, extracts consensus and disagreements, and gives a final recommendation.
- **Companion ecosystem**: Ships a marketing/docs site, an **author-hosted cloud service** (for the built-in summary) and a **Java backend** (for a "share link" feature).

> The core architecture and most features come from the original project. **Heartfelt thanks to the original author for open-sourcing it.**

---

## ✏️ What does this fork (SC 智答) change?

The goal of this fork: **a fully localized, "all-domestic-AI" build that depends on no author-owned cloud service.** Main changes:

| Aspect | Original ai-clash | This fork (SC 智答) |
|--------|-------------------|---------------------|
| **Branding** | AI 对撞机 / `ai-clash` | SC 智答 / `sc-ai` (build artifact `crx-sc-ai-*.zip`) |
| **Final reviewer (AI judge)** | Defaults to the **author-hosted cloud summary service** | Defaults to **DeepSeek (web mode)** — zero cost, no API key; switchable to Doubao / Qianwen / Yuanbao and other domestic AIs in settings |
| **Cloud dependency** | Built-in summary relies on the author's server | **Fully removed** — runs entirely locally |
| **Share-link feature** | Provided, backed by the author's Java backend | **Removed**, and the **entire Java backend** (`packages/api`) was deleted |
| **Third-party private traces** | Author's web analytics script, ICP filing number, Chrome/Edge store links | **All removed**; downloads now point to this repo's GitHub releases |
| **Injection library name** | `@ai-clash/inject` | `@sc-ai/inject` |

**In one sentence:** It keeps the core "multi-AI clash + AI judge" experience, swaps the final reviewer to domestic DeepSeek, and strips out every part that depended on the original author's private cloud — making it an out-of-the-box, fully local, all-domestic build.

---

## 🚀 Installation

1. Download the latest `sc-ai-vX.X.X.zip` from [Releases](https://github.com/SuxL0228/sc-ai/releases/)
2. Unzip it into a permanent folder (**do not delete it**)
3. Open the extensions page: Chrome `chrome://extensions/`, Edge `edge://extensions/`
4. Turn on **Developer mode** (top right)
5. Click **Load unpacked** and select the unzipped folder

✅ Done when the "SC 智答" icon appears in your toolbar.

---

## 📝 Usage

1. **Log in once**: Log into the AI websites you want to use and stay signed in.
2. **Open the side panel**: Click the "SC 智答" toolbar icon.
3. **Ask**: Type your question and press Enter; the extension wakes up each AI to answer side by side.
4. **Judge**: After all answers arrive, the "AI judge" (DeepSeek by default) summarizes consensus, disagreements, and a final recommendation. Switch the judge in **Global Settings**.

---

## 🛠️ Development & Build

Monorepo: the browser extension (root) + injection library (`packages/inject`) + website (`packages/site`).

```bash
npm install
# Build the injection library
cd packages/inject && npx vite build && npx vite build --mode standalone && cd ../..
# Type-check + build the extension (artifact at release/crx-sc-ai-*.zip)
npx tsc --noEmit && npx vite build
```

---

## 🙏 Acknowledgements

This project is a derivative work of the open-source project **[AI Clash / ai-clash](https://github.com/null-object-0000/ai-clash)**.

- Original author: **[null-object-0000](https://github.com/null-object-0000)**
- Original repo: https://github.com/null-object-0000/ai-clash

The original author built the core architecture and most of the features. **Heartfelt thanks for their open-source contribution.** If you find this useful, please also give the [original project](https://github.com/null-object-0000/ai-clash) a ⭐.

---

## 📄 License

This project remains open-sourced under the original project's **[GPL-3.0-or-later](LICENSE)** license. As a derivative of ai-clash, it preserves the original copyright notices and license, and is released under GPL-3.0 as well.
