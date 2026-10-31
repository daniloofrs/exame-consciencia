const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('HTML implements custom sin addition and removal UI', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('addCustomSin('), 'Must define addCustomSin');
  assert.ok(html.includes('removeCustomSin('), 'Must define removeCustomSin');
  assert.ok(html.includes('custom-sin-input'), 'Must have custom sin input field');
});

test('HTML provides Act of Contrition formula switcher', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('contritionFormula'), 'Must have contritionFormula state');
  assert.ok(html.includes('setContritionFormula('), 'Must define formula switch function');
  assert.ok(html.includes('Senhor meu Jesus Cristo') || html.includes('Deus e homem verdadeiro'), 'Must include traditional formula');
});
