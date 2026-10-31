const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('HTML implements Screen Wake Lock API for Confessional screen', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('requestConfessionWakeLock('), 'Must define requestConfessionWakeLock');
  assert.ok(html.includes('releaseConfessionWakeLock('), 'Must define releaseConfessionWakeLock');
  assert.ok(html.includes('navigator.wakeLock'), 'Must check navigator.wakeLock');
});

test('HTML implements low-light candlelight toggle', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('toggleLowLightMode('), 'Must define toggleLowLightMode');
  assert.ok(html.includes('modo-cirio') || html.includes('low-light-active'), 'Must have low light CSS or class');
});
