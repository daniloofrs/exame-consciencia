const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('HTML includes dedicated print stylesheet and print trigger', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('@media print'), 'Must have print media query');
  assert.ok(html.includes('window.print()'), 'Must have window.print trigger');
  assert.ok(html.includes('print-only') || html.includes('no-print'), 'Must have print utility classes');
});
