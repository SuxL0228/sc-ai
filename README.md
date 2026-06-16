# SC 智答 (SC AI)

<p align="center">
  <img src="public/logo.png" width="120" alt="SC 智答 Logo">
</p>

[![GitHub Release](https://img.shields.io/github/v/release/SuxL0228/sc-ai?style=for-the-badge)](https://github.com/SuxL0228/sc-ai/releases)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/gpl-3.0)

**简体中文 ｜ [English](README.en.md)**

> 💥 一个问题问 N 个国产 AI，答案互相对撞，再让 AI 当裁判直接归纳出最优解！
>
> 🔥 已支持：DeepSeek｜豆包｜通义千问｜腾讯元宝｜文心一言｜Xiaomi MIMO

> 📢 **这是一个二次开发版本。** 本项目基于开源项目 **[AI 对撞机 / ai-clash](https://github.com/null-object-0000/ai-clash)** 改造而来。
> 下面会先讲清楚 **原项目做了什么**，再说明 **本项目在它基础上改了什么**。

---

## 🧩 原项目（ai-clash）做了什么？

[ai-clash](https://github.com/null-object-0000/ai-clash) 由 [null-object-0000](https://github.com/null-object-0000) 开发，核心能力非常出色：

- **多 AI 同屏对撞**：在一个浏览器侧边栏里同时向多个 AI 网页版提问，实时对比答案。
- **零 API 成本**：通过本地 DOM Hook 技术复用你已登录的各家网页版算力，不消耗 API Token。
- **AI 裁判归纳**：自动把多个回答整合、提炼共识与分歧，给出最终建议。
- **配套生态**：附带一个官网（marketing/docs）、一个**作者自建的云端服务**（用于内置总结）以及**一个 Java 后端**（用于"分享链接"功能）。

> 本项目的核心架构与绝大部分功能都来自原项目，**衷心感谢原作者的开源贡献。**

---

## ✏️ 本项目（SC 智答）改了什么？

本项目的定位是：**做一个完全本地化、不依赖任何作者私有云服务的"纯国产 AI"版本。** 主要改动如下：

| 方面 | 原项目 ai-clash | 本项目 SC 智答 |
|------|----------------|----------------|
| **品牌名称** | AI 对撞机 / `ai-clash` | SC 智答 / `sc-ai`（打包产物 `crx-sc-ai-*.zip`） |
| **最终评审（AI 裁判）** | 默认使用**原作者托管的云端总结服务** | 默认改为**国产 DeepSeek 网页版**，零成本、免 API Key，可在设置里切换为豆包 / 通义千问 / 元宝等其它国产 AI |
| **云端依赖** | 内置总结服务依赖作者服务器 | **彻底移除**对作者服务器的依赖，全程本地运行 |
| **分享链接功能** | 提供，依赖作者的 Java 后端 | **已移除**该功能，并**整个删除了 Java 后端**（`packages/api`） |
| **第三方私有痕迹** | 含作者的网站统计脚本、ICP 备案号、Chrome/Edge 商店链接 | 全部**清除**，下载改为指向本仓库的 GitHub 离线包 |
| **注入库包名** | `@ai-clash/inject` | `@sc-ai/inject` |

**一句话总结：** 保留了"多 AI 同屏对撞 + AI 裁判"的核心玩法，把"最终评审"换成国产 DeepSeek，并去掉了所有依赖原作者私有云的部分，让它成为一个开箱即用、纯本地、纯国产的版本。

---

## 🚀 安装

1. 去 [Releases](https://github.com/SuxL0228/sc-ai/releases/) 下载最新版 `sc-ai-vX.X.X.zip`
2. 解压到一个固定文件夹（**不要删除它**）
3. 浏览器打开扩展管理页：Chrome `chrome://extensions/`，Edge `edge://extensions/`
4. 打开右上角「开发者模式」
5. 点「加载已解压的扩展程序」，选择解压后的文件夹

✅ 工具栏出现「SC 智答」图标即安装成功。

---

## 📝 使用

1. **登录授权（一次性）**：用浏览器登录你想用的 AI 网站，保持登录即可。
2. **呼出侧边栏**：点工具栏的「SC 智答」图标。
3. **提问**：输入问题回车，插件自动唤醒各家 AI 同屏作答。
4. **裁判归纳**：多路回答完成后，由「AI 裁判」（默认 DeepSeek）归纳共识、分歧与最终建议。想换裁判，去「全局设置」里切换即可。

---

## 🛠️ 开发与构建

monorepo：浏览器扩展（根目录）+ 注入库（`packages/inject`）+ 官网（`packages/site`）。

```bash
npm install
# 构建注入库
cd packages/inject && npx vite build && npx vite build --mode standalone && cd ../..
# 类型检查 + 打包扩展（产物在 release/crx-sc-ai-*.zip）
npx tsc --noEmit && npx vite build
```

---

## 🙏 致谢 (Acknowledgements)

本项目是开源项目 **[AI 对撞机 / ai-clash](https://github.com/null-object-0000/ai-clash)** 的衍生作品。

- 原项目作者：**[null-object-0000](https://github.com/null-object-0000)**
- 原项目地址：https://github.com/null-object-0000/ai-clash

原作者完成了核心架构与绝大部分功能，**衷心感谢原作者的开源贡献。** 如果你觉得好用，也欢迎给[原项目](https://github.com/null-object-0000/ai-clash)点一个 ⭐。

---

## 📄 开源协议 (License)

本项目沿用原项目的 **[GPL-3.0-or-later](LICENSE)** 协议开源。作为 ai-clash 的衍生作品，本项目保留原始版权声明与许可证，并同样以 GPL-3.0 协议开放源代码。
