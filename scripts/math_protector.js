/**
 * LaTeX 后处理插件
 * source 中 $...$ 内的 _ 已被 fix_underscores.js 转义为 \_
 * kramed 把 \_ 正常输出为 _，KaTeX 浏览器端渲染需要 _
 * 本插件仅在 after_render:html 恢复 \_ → _（如果被其他插件转义了）
 */
'use strict';

if (hexo) {
  hexo.extend.filter.register('after_render:html', function(result) {
    if (typeof result !== 'string') return result;
    // 如果 HTML 中的 $...$ 内仍有 \_（其他插件未转义），恢复为 _
    result = result.replace(/(?<!\$)\$(?!\$)([^\n$]+?)\$(?!\$)/g, function(m) {
      return m.replace(/\\_/g, '_');
    });
    result = result.replace(/\$\$([\s\S]*?)\$\$/g, function(m) {
      return m.replace(/\\_/g, '_');
    });
    return result;
  }, 999);
}
