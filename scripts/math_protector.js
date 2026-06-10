/**
 * LaTeX 支持插件
 * kramed 已将 $...$ 转为 <script type="math/tex">，只需在浏览器端渲染
 * 本插件仅在构建时确保 LaTeX 不被其他 filter 破坏
 */
'use strict';
// kramed 已正确处理 $...$，无需额外保护
// 浏览器端渲染由 inject 中的 KaTeX JS 完成
