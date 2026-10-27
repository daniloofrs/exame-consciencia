const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('PWA manifest exists and is valid', () => {
  const manifestPath = path.join(__dirname, '../../docs/manifest.webmanifest');
  assert.ok(fs.existsSync(manifestPath), 'manifest.webmanifest must exist');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert.equal(manifest.name, 'Exame de Consciência — Breviário Católico');
  assert.equal(manifest.short_name, 'Exame');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.theme_color, '#000000');
  assert.equal(manifest.background_color, '#000000');
  assert.ok(manifest.icons && manifest.icons.length > 0, 'Must have icons defined');
});

test('Service worker exists and defines cache strategy', () => {
  const swPath = path.join(__dirname, '../../docs/sw.js');
  assert.ok(fs.existsSync(swPath), 'sw.js must exist');
  const swContent = fs.readFileSync(swPath, 'utf8');
  assert.ok(swContent.includes('install'), 'Must have install event');
  assert.ok(swContent.includes('fetch'), 'Must have fetch event');
  assert.ok(swContent.includes('caches.open'), 'Must use Cache API');
});

test('docs/index.html links manifest and registers service worker', () => {
  const htmlPath = path.join(__dirname, '../../docs/index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  assert.ok(html.includes('rel="manifest" href="manifest.webmanifest"'), 'Must link manifest');
  assert.ok(html.includes('serviceWorker.register'), 'Must register sw.js');
});
