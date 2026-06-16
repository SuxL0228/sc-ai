# SC 智答 (SC AI)

<p align="center">
  <img src="public/logo.png" width="120" alt="SC 智答 Logo">
</p>

[![GitHub Release](https://img.shields.io/github/v/release/SuxL0228/sc-ai?style=for-the-badge)](https://github.com/SuxL0228/sc-ai/releases)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/gpl-3.0)

> 💥 一个问题问 N 个国产 AI，答案互相对撞，再让 AI 当裁判直接归纳出最优解！
>
> 🔥 已支持：DeepSeek｜豆包｜通义千问｜腾讯元宝｜文心一言｜Xiaomi MIMO

> 📢 **二次开发声明**：本项目基于优秀的开源项目 **[AI 对撞机 (ai-clash)](https://github.com/null-object-0000/ai-clash)** 二次开发而来，在此特别感谢原作者。详见文末「致谢」。

<p align="center">
  <img src="packages/site/public/动画.gif" width="100%" alt="演示动画">
</p>

---

## ✨ 它能帮你解决什么？

* ⚔️ **打破"单一模型的自信幻觉"**
  没有全能的 AI，只有偏科的专家。复杂问题里，单个模型很容易一本正经地胡说八道。让多个顶级国产模型**同屏作答**，谁有漏洞一眼便知。

* ⚖️ **AI 裁判，一键归纳最优解**
  回答看花了眼？内置的「AI 裁判」会自动帮你对比、提炼共识与分歧，直出最具置信度的终极答案。**默认由 DeepSeek 担任裁判，零成本、零配置。**

* 🆓 **零 API 成本，满血网页体验**
  采用纯本地 DOM Hook 技术，直接复用你已登录的各家网页版算力，完整继承官方网页的系统提示词、上下文记忆与联网能力——不用花一分钱 Token。

* 🛑 **告别来回切网页**
  所有模型汇聚在一个侧边栏，一次提问、同屏对比、实时输出，把精力花在思考上而不是切标签页上。

---

## 🚀 怎么安装？

1. 去 [Releases](https://github.com/SuxL0228/sc-ai/releases/) 下载最新版的插件包（`sc-ai-vX.X.X.zip`）
2. 解压到一个你找得到的文件夹（**不要删除这个文件夹**）
3. 浏览器地址栏打开扩展管理页：
   * Chrome：`chrome://extensions/`
   * Edge：`edge://extensions/`
4. 打开右上角的「开发者模式」
5. 点「加载已解压的扩展程序」，选刚才解压的文件夹

✅ 搞定！浏览器工具栏就有「SC 智答」的图标了。

---

## 📝 怎么用？

1. **登录授权（一次性）**：用浏览器登录一下你想用的 AI 网站，保持登录状态即可（不用一直开着网页）。
2. **呼出侧边栏**：点浏览器右上角的「SC 智答」图标。
3. **提问看戏**：输入问题回车，插件会自动在后台唤醒各家 AI 标签页，多路同屏输出。
4. **加通道 / 重试 / 总结**：可中途追加某个 AI；某一路失败可单独重试；多路回答完后让「AI 裁判」归纳共识、分歧与最终建议。

> 💡 想换裁判？在「全局设置」里可以把评审 AI 换成豆包、通义千问、元宝等任意一个国产 AI，网页免费模式与 API 模式都支持。

---

## 🛠️ 开发与构建

本仓库为浏览器扩展 + 注入库（`packages/inject`）+ 官网（`packages/site`）的 monorepo。

```bash
# 安装依赖
npm install

# 构建注入库
cd packages/inject && npx vite build && npx vite build --mode standalone && cd ../..

# 类型检查 + 打包扩展（产物在 release/crx-sc-ai-*.zip）
npx tsc --noEmit && npx vite build
```

---

## 🙏 致谢 (Acknowledgements)

本项目是在开源项目 **[AI 对撞机 / ai-clash](https://github.com/null-object-0000/ai-clash)** 基础上进行二次开发的衍生作品。

- 原项目作者：**[null-object-0000](https://github.com/null-object-0000)**
- 原项目地址：https://github.com/null-object-0000/ai-clash

原作者完成了核心架构与绝大部分功能，本项目在此之上做了品牌调整、并将"最终评审"默认改为国产 AI（DeepSeek）等定制。**衷心感谢原作者的开源贡献。** 🎉

如果你也觉得这个工具好用，欢迎同时给[原项目](https://github.com/null-object-0000/ai-clash)点一个 ⭐。

---

## 📄 开源协议 (License)

本项目沿用原项目的 **[GPL-3.0-or-later](LICENSE)** 协议开源。

根据 GPL-3.0 协议要求：本项目为 ai-clash 的衍生作品，须保留原始版权声明与许可证，并同样以 GPL-3.0 协议开放源代码。
