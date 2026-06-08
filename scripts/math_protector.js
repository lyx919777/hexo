/**
 * LaTeX 数学公式构建时预渲染插件
 * 在 Hexo 构建阶段用 KaTeX 将 $...$ 和 $$...$$ 渲染为 HTML
 * 无需浏览器端加载 KaTeX JS（仅需 CSS）
 */

'use strict';

const katex = require('katex');

const mathContent = [];

// $$...$$ 块级公式
const blockMathRegex = /\$\$([\s\S]*?)\$\$/g;
// $...$ 行内公式（前置不能是 $，后置不能是 $，中间不能有换行）
const inlineMathRegex = /(?<!\$)\$(?!\$)([^\n$]+?)\$(?!\$)/g;

function protectMath(text) {
  mathContent.length = 0;
  let idx = 0;

  text = text.replace(blockMathRegex, (match) => {
    const raw = match.slice(2, -2);
    mathContent.push({ raw, displayMode: true });
    return `\x00MATH_${idx++}\x00`;
  });

  text = text.replace(inlineMathRegex, (match) => {
    const raw = match.slice(1, -1);
    mathContent.push({ raw, displayMode: false });
    return `\x00MATH_${idx++}\x00`;
  });

  return text;
}

function restoreMath(html) {
  if (mathContent.length === 0) return html;

  html = html.replace(/\x00MATH_(\d+)\x00/g, (match, id) => {
    const item = mathContent[parseInt(id)];
    if (!item) return match;
    try {
      return katex.renderToString(item.raw, {
        displayMode: item.displayMode,
        throwOnError: false,
        output: 'html'
      });
    } catch (e) {
      return item.displayMode
        ? '$$' + item.raw + '$$'
        : '$' + item.raw + '$';
    }
  });

  return html;
}

function hexoFilterBeforePost(data) {
  if (!data) return data;

  const content = data.content || data._content || '';
  if (!content || content.indexOf('$') < 0) return data;

  const protectedContent = protectMath(content);

  if (data.content) data.content = protectedContent;
  if (data._content) data._content = protectedContent;

  return data;
}

function hexoFilterAfterPost(data) {
  if (!data) return data;

  const html = data.content || '';
  if (!html || html.indexOf('\x00MATH_') < 0) return data;

  data.content = restoreMath(html);

  return data;
}

if (hexo) {
  hexo.extend.filter.register('before_post_render', hexoFilterBeforePost);
  hexo.extend.filter.register('after_post_render', hexoFilterAfterPost);
}
