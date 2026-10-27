const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('HTML contains privacy shield overlay and visibility event listeners', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('id="privacy-shield"'), 'Must have privacy shield element');
  assert.ok(html.includes('visibilitychange'), 'Must listen to visibilitychange');
  assert.ok(html.includes('togglePrivacyShield('), 'Must have togglePrivacyShield trigger');
});

test('Absolution flow triggers permanent data wipe in client script', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes("localStorage.removeItem('confession_draft')"), 'Must remove confession draft on absolution');
  assert.ok(html.includes('selectedQuestions.clear()'), 'Must clear selected questions set');
  assert.ok(html.includes('confessedQuestions.clear()'), 'Must clear confessed questions set');
});
