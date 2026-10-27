const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('HTML implements safe haptic feedback helper', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('triggerHaptic('), 'Must define triggerHaptic helper');
  assert.ok(html.includes('navigator.vibrate'), 'Must use navigator.vibrate with feature check');
});

test('Category pills auto-scroll to center on selection', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('scrollIntoView'), 'Must auto-scroll active category pill into view');
});
