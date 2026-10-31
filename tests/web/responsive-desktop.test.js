const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('CSS includes responsive media queries for tablet and desktop', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('@media (min-width: 768px)') || html.includes('@media (min-width: 800px)'), 'Must include tablet/desktop media query');
  assert.ok(html.includes('exam-desktop-split') || html.includes('desktop-layout'), 'Must have responsive split layout styles');
});

test('HTML implements desktop keyboard shortcuts', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('keydown'), 'Must listen to keydown events');
  assert.ok(html.includes('ArrowLeft') && html.includes('ArrowRight'), 'Must handle arrow navigation');
});
