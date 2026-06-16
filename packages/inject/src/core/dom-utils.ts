/**
 * DOM 操作工具函数
 *
 * 提供通用的 DOM 查找、事件模拟等工具函数
 */

// ============================================================================
// Worker 计时器
//
// 后台标签页的主线程定时器会被 Chrome 限速（隐藏后钳制到 ≥1s，隐藏超过 5 分钟后
// 链式定时器钳制到每分钟 1 次），导致纯后台执行的发送流程极慢甚至超时。
// Worker 线程的定时器不受页面可见性限速，因此 wait() 优先走 Worker 计时。
// 站点 CSP 可能禁止 blob: Worker，所以始终保留 setTimeout 双保险：
// 两路同时启动，谁先到谁生效（Worker 可用时等价于精确计时，不可用时等价于原行为）。
// ============================================================================

let timerWorker: Worker | null = null;
let timerWorkerFailed = false;
let timerSeq = 0;
const timerCallbacks = new Map<number, () => void>();

function getTimerWorker(): Worker | null {
  if (timerWorkerFailed) return null;
  if (timerWorker) return timerWorker;
  try {
    const src = 'onmessage=function(e){setTimeout(function(){postMessage(e.data.id)},e.data.ms)}';
    const url = URL.createObjectURL(new Blob([src], { type: 'application/javascript' }));
    timerWorker = new Worker(url);
    URL.revokeObjectURL(url);
    timerWorker.onmessage = (e) => {
      const cb = timerCallbacks.get(e.data);
      if (cb) cb();
    };
    timerWorker.onerror = () => {
      // Worker 运行期出错（如 CSP 异步拦截），降级；未决回调由 setTimeout 兜底触发
      timerWorkerFailed = true;
      timerWorker = null;
    };
    return timerWorker;
  } catch {
    timerWorkerFailed = true;
    return null;
  }
}

/**
 * Worker 计时器是否已降级回 setTimeout（如被站点 CSP 禁止）
 */
export function isTimerWorkerDegraded(): boolean {
  // 触发一次惰性初始化，保证返回的是真实状态
  getTimerWorker();
  return timerWorkerFailed;
}

/**
 * 等待指定毫秒数（后台标签页中不被限速）
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => {
    let settled = false;
    let id = 0;
    const finish = () => {
      if (settled) return;
      settled = true;
      if (id) timerCallbacks.delete(id);
      resolve();
    };
    const w = getTimerWorker();
    if (w) {
      id = ++timerSeq;
      timerCallbacks.set(id, finish);
      try {
        w.postMessage({ id, ms });
      } catch {
        timerCallbacks.delete(id);
        id = 0;
      }
    }
    setTimeout(finish, ms);
  });
}

/**
 * 转换支持通配符的 class 选择器 (如 .avatar__* 或 avatar__*)
 * 以解决部分网站随机生成的动态 class hash 的痛点
 */
export function compileWildcardSelector(selector: string): string {
  if (!selector || typeof selector !== 'string' || !selector.includes('*')) return selector;
  
  // 匹配：边界/点号 + 类名前缀 + *
  return selector.replace(/(^|\s|>|\+|~|\]|\.)([a-zA-Z0-9_-]+)\*/g, (match, boundary, classPrefix) => {
    const keepBoundary = boundary === '.' ? '' : boundary;
    return `${keepBoundary}:is([class^="${classPrefix}"], [class*=" ${classPrefix}"])`;
  });
}

/**
 * 查找元素（支持 >> 和 * 通配符伪选择器语法）
 */
export function findElement(selector: string): Element | null {
  if (!selector) return null;

  selector = compileWildcardSelector(selector);

  // 处理 >> 伪选择器语法（用于文本匹配）
  if (selector.includes('>>')) {
    const parts = selector.split('>>').map(s => s.trim());
    const baseEls = document.querySelectorAll(parts[0]);
    if (!baseEls || parts.length < 2) return null;

    const text = parts[1];
    for (const baseEl of baseEls) {
      const walker = document.createTreeWalker(
        baseEl,
      NodeFilter.SHOW_TEXT,
      null
    );

      while (walker.nextNode()) {
        const node = walker.currentNode as Text;
        if (node.textContent?.includes(text)) {
          return node.parentElement;
        }
      }
    }

    return null;
  }

  return document.querySelector(selector);
}

/**
 * 查找元素列表中的第一个匹配项
 */
export function findAnyElement(selectors: string[]): Element | null {
  for (const selector of selectors) {
    const el = findElement(selector);
    if (el) return el;
  }
  return null;
}

/**
 * 等待元素出现 - 支持 >> 伪选择器语法
 */
export function waitForElement(selector: string, timeout = 8000): Promise<Element | null> {
  return waitForAnyElement([selector], timeout);
}

/**
 * 等待任意元素出现
 *
 * MutationObserver 快路径（DOM 变更即检查，回调不受后台限速）
 * + Worker 计时低频轮询兜底（覆盖元素早已存在但无变更、或 observer 漏报的场景）
 */
export function waitForAnyElement(selectors: string[], timeout = 8000): Promise<Element | null> {
  const immediate = findAnyElement(selectors);
  if (immediate) return Promise.resolve(immediate);

  return new Promise(resolve => {
    let settled = false;
    let observer: MutationObserver | null = null;
    let checkScheduled = false;

    const finish = (el: Element | null) => {
      if (settled) return;
      settled = true;
      if (observer) observer.disconnect();
      resolve(el);
    };

    // 把同一批 DOM 变更合并为一次选择器查询，避免高频 mutation 下反复全量扫描
    const scheduleCheck = () => {
      if (checkScheduled || settled) return;
      checkScheduled = true;
      queueMicrotask(() => {
        checkScheduled = false;
        if (settled) return;
        const el = findAnyElement(selectors);
        if (el) finish(el);
      });
    };

    try {
      observer = new MutationObserver(scheduleCheck);
      observer.observe(document.documentElement || document, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    } catch {
      observer = null; // 退回纯轮询
    }

    const start = Date.now();
    (async () => {
      while (!settled) {
        const remaining = timeout - (Date.now() - start);
        if (remaining <= 0) {
          finish(null);
          return;
        }
        await wait(Math.min(remaining, 500));
        if (settled) return;
        const el = findAnyElement(selectors);
        if (el) finish(el);
      }
    })();
  });
}

/**
 * 模拟真实点击（完整的事件序列）
 */
export function simulateRealClick(element: Element): void {
  if (!element) return;

  const events = [
    new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerType: 'mouse' }),
    new MouseEvent('mousedown', { bubbles: true, cancelable: true }),
    new PointerEvent('pointerup', { bubbles: true, cancelable: true, pointerType: 'mouse' }),
    new MouseEvent('mouseup', { bubbles: true, cancelable: true }),
    new MouseEvent('click', { bubbles: true, cancelable: true }),
  ];
  events.forEach(ev => element.dispatchEvent(ev));
}

/**
 * 检查元素是否包含指定 class
 */
export function hasClass(el: Element, className: string): boolean {
  return el.classList.contains(className);
}

/**
 * 检查元素的 class 是否包含指定关键词（部分匹配）
 */
export function classContains(el: Element, keyword: string): boolean {
  const kw = keyword.toLowerCase();
  return Array.from(el.classList).some(c => c.toLowerCase().includes(kw));
}

/**
 * 检查元素的 class 是否以指定关键词开头（前缀匹配）
 */
export function classStartsWith(el: Element, prefix: string): boolean {
  const pre = prefix.toLowerCase();
  return Array.from(el.classList).some(c => c.toLowerCase().startsWith(pre));
}

/**
 * 检查元素的 class 是否以指定关键词结尾（后缀匹配）
 */
export function classEndsWith(el: Element, suffix: string): boolean {
  const suf = suffix.toLowerCase();
  return Array.from(el.classList).some(c => c.toLowerCase().endsWith(suf));
}

/**
 * 构建可靠的类名模糊匹配 CSS 选择器
 * 解决 `[class^="xxx"]` 无法匹配 `<div class="other xxx">` 的问题
 * 
 * @param className 基准类名
 * @param matchType 匹配类型：prefix (前缀), suffix (后缀), contains (包含)
 * @returns 完整的 CSS 选择器
 */
export function buildFuzzyClassSelector(className: string, matchType: 'prefix' | 'suffix' | 'contains' = 'prefix'): string {
  if (matchType === 'prefix') {
    return `:is([class^="${className}"], [class*=" ${className}"])`;
  }
  if (matchType === 'suffix') {
    return `:is([class$="${className}"], [class*="${className} "])`;
  }
  return `[class*="${className}"]`;
}
