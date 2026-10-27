const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('HTML contains smart install banner and modal triggers', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('id="install-banner"'), 'Must have install banner element');
  assert.ok(html.includes('openInstallGuide('), 'Must have openInstallGuide function');
  assert.ok(html.includes('dismissInstallBanner('), 'Must have dismissInstallBanner function');
});

test('Install Guide contains tailored iOS and Android visual cards', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('Adicionar à Tela de Início'), 'Must contain iOS step text');
  assert.ok(html.includes('Compartilhar'), 'Must mention Safari Share button');
  assert.ok(html.includes('pwa_install_dismissed'), 'Must persist dismissal in localStorage');
});
