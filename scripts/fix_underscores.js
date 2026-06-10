/**
 * 批量修复 LaTeX 中的下划线问题
 * 把 $...$ 内的 _ 替换为 \_
 * 这样 kramed 就不会把 _ 当作斜体标记
 */
var fs = require('fs');
var path = require('path');

var dir = 'source/_posts';
var files = fs.readdirSync(dir).filter(function(f) { return f.endsWith('.md') });

files.forEach(function(file) {
  var fp = path.join(dir, file);
  var c = fs.readFileSync(fp, 'utf-8');
  var n = c;

  // 保护 $...$ 内的 _ → \_
  n = n.replace(/(?<!\$)\$(?!\$)([^\n$]+?)\$(?!\$)/g, function(m) {
    var inner = m.slice(1, -1);
    var fixed = inner.replace(/_/g, '\\_');
    return fixed !== inner ? '$' + fixed + '$' : m;
  });

  // 保护 $$...$$ 内的 _ → \_
  n = n.replace(/\$\$([\s\S]*?)\$\$/g, function(m) {
    var inner = m.slice(2, -2);
    var fixed = inner.replace(/_/g, '\\_');
    return fixed !== inner ? '$$' + fixed + '$$' : m;
  });

  if (n !== c) {
    fs.writeFileSync(fp, n, 'utf-8');
    console.log('Fixed: ' + file);
  }
});

console.log('Done');
