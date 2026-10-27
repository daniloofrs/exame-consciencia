const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('HTML contains search input for instant question filtering', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('id="exam-search"'), 'Must have search input field');
  assert.ok(html.includes('filterQuestions('), 'Must implement filterQuestions logic');
});

test('HTML implements font size scaling controls with persistence', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('adjustFontSize('), 'Must implement font size adjust function');
  assert.ok(html.includes('text_size_multiplier'), 'Must persist text scale in localStorage');
});
