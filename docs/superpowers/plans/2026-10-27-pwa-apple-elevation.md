# PWA Apple Breviário Elevation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the standalone web app into an installable, 100% offline-ready Apple Breviário Progressive Web App (PWA) with an interactive visual installation guide, native-grade privacy shields, fluid taptic feedback, search filters, accessibility text scaling, and an interactive Guia do Penitente.

**Architecture:** Pure zero-dependency client architecture built directly on modern Web Standards and Apple Design Guidelines. Features a declarative `manifest.webmanifest`, a Cache-First Service Worker for instant offline loading inside church confessionals, CSS backdrop-filter glassmorphism with high-contrast OLED black (`#000000`), Hardware Vibration API for Apple Taptic Engine feedback simulation, Web Visibility API for app-switcher privacy shielding, and a smart OS-detecting PWA installation guide.

**Tech Stack:** Vanilla JavaScript (ES2024), Service Worker API, Web App Manifest, HTML5 Web Storage, CSS Glassmorphism & Custom Properties, Google Fonts (Cinzel, EB Garamond, Inter), Node.js native test runner (`node:test`).

**Spec:** [.agents/skills/apple-design/SKILL.md](file:///c:/Users/danil/Documents/Documentos%20Local/Documentos%20Local/Estudos/Projetos/exame-consciencia/.agents/skills/apple-design/SKILL.md) and [docs/ideas/apple-design-redesign.md](file:///c:/Users/danil/Documents/Documentos%20Local/Documentos%20Local/Estudos/Projetos/exame-consciencia/docs/ideas/apple-design-redesign.md)

## Global Constraints

- **Zero External Runtime Dependencies:** Must run entirely in modern mobile browsers (iOS Safari, Android Chrome) without external heavy frameworks (React, Vue, bundle files).
- **100% Offline Resilience:** Must function completely with 0 internet connection inside stone churches and confessionals.
- **Pure Apple Breviário Aesthetic:** True OLED black (`#000000`), warm amber accents (`#D4AF37`, `#F59E0B`), subtle frosted glass (`rgba(255, 255, 255, 0.05)` with `backdrop-filter: blur(20px)`), and sacred typography.
- **Confidentiality by Design:** No telemetry, no remote analytics, no tracking. All notes and sins remain strictly ephemeral in local browser memory and are irrevocably wiped upon receiving absolution.
- **Node Test Automation:** All tasks are verified by fast, deterministic tests using `node --test`.

## Review Focus

1. **Service Worker Offline Cache Miss:** Assets must be pre-cached during `install` event so opening the app in Airplane mode never results in a broken page or missing fonts.
2. **Confessional Privacy Leak in App Switcher:** When switching apps or locking the device, the screen must immediately conceal the list of sins with an opaque sacred privacy shield before the OS captures the snapshot.
3. **Absolution Data Destruction:** Tapping "Recebi a Absolvição" must securely purge `localStorage` (`confession_draft`), clear memory sets, and reset screen state without residual data.
4. **Haptic Vibration API Graceful Fallback:** `navigator.vibrate` must be guarded with feature-detection so iOS Safari (which restricts vibration) fails silently without throwing JavaScript errors.
5. **Standalone Mode Detection & Banner Suppression:** The installation banner must never display when running in standalone mode or after user permanent dismissal.

---

### Task 1: PWA Infrastructure (Manifest, Icons, Service Worker, Offline Caching)

**Files:**
- Create: `docs/manifest.webmanifest`
- Create: `docs/sw.js`
- Create: `docs/icons/icon.svg`
- Modify: `scripts/build-web.js:8-25`
- Modify: `docs/index.html:8-25`
- Test: `tests/web/pwa-manifest-sw.test.js`

**Interfaces:**
- Consumes: `docs/index.html` header, `scripts/build-web.js`
- Produces: Web App Manifest link in `<head>`, registered `sw.js` in `<script>`, offline caching mechanism.

- [ ] **Step 1: Write the failing test for PWA Manifest and Service Worker**

```javascript
// tests/web/pwa-manifest-sw.test.js
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
  assert.ok(manifest.icons.length > 0, 'Must have icons defined');
});

test('Service worker exists and defines cache strategy', () => {
  const swPath = path.join(__dirname, '../../docs/sw.js');
  assert.ok(fs.existsSync(swPath), 'sw.js must exist');
  const swContent = fs.readFileSync(swPath, 'utf8');
  assert.ok(swContent.includes('addEventListener(\'install\''), 'Must have install event');
  assert.ok(swContent.includes('addEventListener(\'fetch\''), 'Must have fetch event');
  assert.ok(swContent.includes('caches.open'), 'Must use Cache API');
});

test('docs/index.html links manifest and registers service worker', () => {
  const htmlPath = path.join(__dirname, '../../docs/index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  assert.ok(html.includes('rel="manifest" href="manifest.webmanifest"'), 'Must link manifest');
  assert.ok(html.includes('serviceWorker.register'), 'Must register sw.js');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/web/pwa-manifest-sw.test.js`
Expected: FAIL with missing `docs/manifest.webmanifest`

- [ ] **Step 3: Implement `docs/manifest.webmanifest`, `docs/sw.js`, and update `scripts/build-web.js`**

1. Create `docs/manifest.webmanifest` with standalone mode, theme color `#000000`, icons.
2. Create `docs/icons/icon.svg` featuring the sacred golden cross on OLED black.
3. Create `docs/sw.js` with Cache-First strategy for static shell assets and Stale-While-Revalidate for fonts.
4. Update `scripts/build-web.js` to register `sw.js` in `<head>` and build `docs/index.html`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/web/pwa-manifest-sw.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add docs/manifest.webmanifest docs/sw.js docs/icons/ scripts/build-web.js docs/index.html tests/web/pwa-manifest-sw.test.js
git commit -m "feat(pwa): adicionar manifest.webmanifest, service worker offline e icones"
```

---

### Task 2: Guia Visual de Instalação na Tela Inicial & Smart Banner

**Files:**
- Modify: `scripts/build-web.js`
- Modify: `docs/index.html`
- Test: `tests/web/install-guide.test.js`

**Interfaces:**
- Consumes: Browser userAgent, `window.navigator.standalone`, `matchMedia('(display-mode: standalone)')`, `localStorage`.
- Produces: 
  - Floating smart install banner at bottom for mobile browser visitors.
  - Permanent "Como Instalar no Celular 📲" card on Home Screen.
  - Apple Bottom Sheet modal with OS tabs (iOS Safari vs. Android Chrome) and visual system cards.
  - Standalone suppression logic.

- [ ] **Step 1: Write the failing test for Install Guide and Banner**

```javascript
// tests/web/install-guide.test.js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/web/install-guide.test.js`
Expected: FAIL with missing `id="install-banner"`

- [ ] **Step 3: Implement Install Banner and Visual Modal in `scripts/build-web.js`**

1. Add `#install-banner` in HTML:
   - Discreet floating bottom pill: "Instalar aplicativo na tela inicial" + button "Ver Guia" + "✕".
   - Visible only if NOT in standalone mode (`!window.navigator.standalone && !window.matchMedia('(display-mode: standalone)').matches`) and not dismissed in `localStorage`.
2. Add permanent card on Home Screen: "Como Instalar no Celular (iOS & Android)".
3. Implement `openInstallGuide()` opening an Apple Bottom Sheet modal with:
   - OS toggle tabs: `[ iPhone (iOS) ]` and `[ Android ]` (auto-selected via `navigator.userAgent`).
   - Visual step 1: Safari Share icon `[ ⎋ ]` or Chrome menu `[ ⋮ ]`.
   - Visual step 2: "Adicionar à Tela de Início" `[ ⊞ ]` or "Instalar aplicativo".
   - Visual step 3: App icon preview on home screen ready for offline use.
4. Run `node scripts/build-web.js`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/web/install-guide.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/build-web.js docs/index.html tests/web/install-guide.test.js
git commit -m "feat(pwa): implementar banner inteligente e guia visual de instalacao na tela inicial"
```

---

### Task 3: Confessional Privacy Shield & Auto-Conceal

**Files:**
- Modify: `scripts/build-web.js`
- Modify: `docs/index.html`
- Test: `tests/web/privacy-security.test.js`

**Interfaces:**
- Consumes: Browser `visibilitychange`, `pagehide`, and `blur` events.
- Produces: Overlay `#privacy-shield` that blurs the entire app view with a sacred cross and message "Em Oração", auto-hiding sins when switching apps or locking device.

- [ ] **Step 1: Write the failing test for Privacy Shield and Absolution purge**

```javascript
// tests/web/privacy-security.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('HTML contains privacy shield overlay and visibility event listeners', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('id="privacy-shield"'), 'Must have privacy shield element');
  assert.ok(html.includes('visibilitychange'), 'Must listen to visibilitychange');
  assert.ok(html.includes('privacy-conceal-btn') || html.includes('togglePrivacyShield'), 'Must have conceal trigger');
});

test('Absolution flow triggers permanent data wipe in client script', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes("localStorage.removeItem('confession_draft')"), 'Must remove confession draft on absolution');
  assert.ok(html.includes('selectedQuestions.clear()'), 'Must clear selected questions set');
  assert.ok(html.includes('confessedQuestions.clear()'), 'Must clear confessed questions set');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/web/privacy-security.test.js`
Expected: FAIL with missing `id="privacy-shield"`

- [ ] **Step 3: Implement Privacy Shield and Conceal Mechanism in `scripts/build-web.js`**

1. Add `#privacy-shield` overlay in HTML template:
   - Fixed full screen, `backdrop-filter: blur(28px) saturate(120%)`, background `rgba(0, 0, 0, 0.95)`, glowing cross and "Em Oração — Toque para continuar".
2. Add event listeners for `document.addEventListener('visibilitychange')` and `window.addEventListener('blur')` to activate privacy shield.
3. Add a quick conceal button on the navigation bar.
4. Run `node scripts/build-web.js`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/web/privacy-security.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/build-web.js docs/index.html tests/web/privacy-security.test.js
git commit -m "feat(privacy): implementar privacy shield contra visualizacao no app switcher e ocultamento rapido"
```

---

### Task 4: Apple Taptic Feedback & Fluid Category Navigation

**Files:**
- Modify: `scripts/build-web.js`
- Modify: `docs/index.html`
- Test: `tests/web/haptics-gestures.test.js`

**Interfaces:**
- Consumes: `navigator.vibrate`, Touch Events (`touchstart`, `touchend`).
- Produces: Physical haptic pulses on question selection and confession checkoff; horizontal swipe physics between categories.

- [ ] **Step 1: Write the failing test for Haptic Feedback and Category Swipe**

```javascript
// tests/web/haptics-gestures.test.js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/web/haptics-gestures.test.js`
Expected: FAIL with missing `triggerHaptic(`

- [ ] **Step 3: Implement Haptic Feedback and Swipe Physics in `scripts/build-web.js`**

1. Define `triggerHaptic(type)` with presets (`light`, `medium`, `success`, `sacred`).
2. Call `triggerHaptic('light')` when toggling question cards.
3. Call `triggerHaptic('medium')` when checking confessed item in Confessional Mode.
4. Call `triggerHaptic('sacred')` when receiving Absolution.
5. Add `scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })` for active category pill.
6. Run `node scripts/build-web.js`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/web/haptics-gestures.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/build-web.js docs/index.html tests/web/haptics-gestures.test.js
git commit -m "feat(apple): adicionar taptic engine haptics e auto-centralizacao de categorias"
```

---

### Task 5: Sacred Search Filter & Accessibility Text Scaling

**Files:**
- Modify: `scripts/build-web.js`
- Modify: `docs/index.html`
- Test: `tests/web/search-accessibility.test.js`

**Interfaces:**
- Consumes: User search input string, font size multiplier setting.
- Produces: Live instant filtering of catalog questions, dynamic CSS `--text-scale` variable persisted in `localStorage`.

- [ ] **Step 1: Write the failing test for Search and Text Size Scaling**

```javascript
// tests/web/search-accessibility.test.js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/web/search-accessibility.test.js`
Expected: FAIL with missing `id="exam-search"`

- [ ] **Step 3: Implement Search Filter and Text Scaling in `scripts/build-web.js`**

1. Add a refined Apple search bar at the top of the examination screen with search icon and clear button.
2. Implement live debounced filtering across question titles, text, and categories.
3. Add font size adjuster button (A- / A+) in the navigation bar opening a small sheet or toggle.
4. Apply CSS custom property `--text-scale` to typography.
5. Run `node scripts/build-web.js`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/web/search-accessibility.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/build-web.js docs/index.html tests/web/search-accessibility.test.js
git commit -m "feat(search-a11y): implementar busca instantanea de faltas e ajuste de tamanho de fonte"
```

---

### Task 6: Guia do Penitente & Liturgical Prayers Expansion

**Files:**
- Modify: `src/data/examination_catalog.json`
- Modify: `scripts/build-web.js`
- Modify: `docs/index.html`
- Test: `tests/web/liturgical-guide.test.js`

**Interfaces:**
- Consumes: Catalog `confessionGuide`, `prayers`.
- Produces: Dedicated "Guia do Penitente" modal screen detailing the 5 conditions for a good confession, dialogue with the priest, and additional traditional prayers (Santo Tomás de Aquino, Salmo 50).

- [ ] **Step 1: Write the failing test for Guia do Penitente and Liturgical Prayers**

```javascript
// tests/web/liturgical-guide.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('Catalog and Web App contain 5 conditions for a good confession', () => {
  const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, '../../src/data/examination_catalog.json'), 'utf8'));
  assert.ok(catalog.confessionGuide, 'Must have confessionGuide in catalog');
  assert.ok(catalog.confessionGuide.conditions.length >= 5, 'Must have 5 conditions');
  
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('Guia da Confissão') || html.includes('Guia do Penitente'), 'Must render Penitente Guide');
  assert.ok(html.includes('Exame de Consciência'), 'Must mention Exame');
  assert.ok(html.includes('Dor dos pecados'), 'Must mention Dor dos pecados');
  assert.ok(html.includes('Propósito'), 'Must mention Propósito');
  assert.ok(html.includes('Confissão vocal'), 'Must mention Confissão vocal');
  assert.ok(html.includes('Satisfação'), 'Must mention Satisfação/Penitência');
});

test('App includes St. Thomas Aquinas prayer and Psalm 50', () => {
  const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, '../../src/data/examination_catalog.json'), 'utf8'));
  const prayerIds = catalog.prayers.map(p => p.id);
  assert.ok(prayerIds.includes('tomas-aquino') || prayerIds.includes('oracao-preparatoria'), 'Must include preparatory prayer');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/web/liturgical-guide.test.js`
Expected: FAIL with missing conditions

- [ ] **Step 3: Update `examination_catalog.json` and render Guia in `scripts/build-web.js`**

1. Enrich `src/data/examination_catalog.json` with structured 5 conditions of confession and classical preparatory prayers.
2. Add a button/card on the Home Screen: "Como fazer uma boa confissão (Guia do Penitente)".
3. Implement the Guia modal/screen with step-by-step guidance, dialogue with the priest, and traditional rubrics.
4. Run `node scripts/build-web.js`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/web/liturgical-guide.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/data/examination_catalog.json scripts/build-web.js docs/index.html tests/web/liturgical-guide.test.js
git commit -m "feat(liturgy): integrar Guia do Penitente completo e oracoes tradicionais de preparacao"
```

---

### Task 7: GitHub Pages Deployment & Full PWA Verification

**Files:**
- Modify: `docs/index.html`
- Modify: `docs/sw.js`
- Test: All web tests (`node --test tests/web/*.test.js`)

**Interfaces:**
- Consumes: Built `docs/` artifacts.
- Produces: Production deployment on GitHub Pages (`origin/main`).

- [ ] **Step 1: Run all PWA test suites to ensure 100% pass**

Run: `node --test tests/web/*.test.js`
Expected: 6 tests passed, 0 failures.

- [ ] **Step 2: Verify `docs/index.html` builds cleanly with 0 console warnings**

Run: `node scripts/build-web.js`
Expected: `docs/index.html generated successfully!`

- [ ] **Step 3: Commit and Push to `origin main`**

```bash
git add docs/ scripts/ tests/
git commit -m "chore(release): publicar versao completa do PWA Apple Breviario no GitHub Pages"
git push origin main
```

- [ ] **Step 4: Verify live site accessibility and PWA manifest headers**

Inspect response headers and structure on `https://daniloofrs.github.io/exame-consciencia/`.
