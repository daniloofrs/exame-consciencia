const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('HTML implements touch swipe gesture handlers for categories', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('nextCategory('), 'Must have nextCategory function');
  assert.ok(html.includes('prevCategory('), 'Must have prevCategory function');
  assert.ok(html.includes('handleTouchStart(') || html.includes('onTouchStart'), 'Must have touch start handler');
  assert.ok(html.includes('handleTouchEnd(') || html.includes('onTouchEnd'), 'Must have touch end handler');
});

test('HTML renders category progress indicator', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('category-progress-bar'), 'Must have category-progress-bar class or id');
  assert.ok(html.includes('category-progress-text'), 'Must have category-progress-text class or id');
});
