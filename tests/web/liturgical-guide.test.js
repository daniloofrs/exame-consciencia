const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('Catalog and Web App contain 5 conditions for a good confession', () => {
  const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, '../../src/data/examination_catalog.json'), 'utf8'));
  assert.ok(catalog.confessionGuide, 'Must have confessionGuide in catalog');
  assert.ok(catalog.confessionGuide.conditions && catalog.confessionGuide.conditions.length >= 5, 'Must have 5 conditions');
  
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('Guia do Penitente'), 'Must render Penitente Guide');
  assert.ok(html.includes('Exame de Consciência'), 'Must mention Exame');
  assert.ok(html.includes('Dor dos pecados') || html.includes('Contrição'), 'Must mention Dor dos pecados');
  assert.ok(html.includes('Propósito'), 'Must mention Propósito');
  assert.ok(html.includes('Confissão vocal') || html.includes('Confissão oral'), 'Must mention Confissão vocal/oral');
  assert.ok(html.includes('Satisfação') || html.includes('Penitência'), 'Must mention Satisfação/Penitência');
});

test('App includes St. Thomas Aquinas prayer and Psalm 50', () => {
  const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, '../../src/data/examination_catalog.json'), 'utf8'));
  const prayerIds = catalog.prayers.map(p => p.id);
  assert.ok(prayerIds.includes('tomas-aquino'), 'Must include St. Thomas Aquinas prayer');
  assert.ok(prayerIds.includes('salmo-50'), 'Must include Psalm 50 Miserere');
});
