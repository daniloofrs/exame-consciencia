# PWA Usability & Responsiveness Elevation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the PWA to native-level fluidity, accessibility, and responsiveness by adding touch-swipe navigation between categories, Screen Wake Lock during confession, custom sin entry, multi-formula Act of Contrition, responsive multi-column layout for tablets/desktops with keyboard shortcuts, and print stylesheet for discreet paper confessional notes.

**Architecture:** Pure zero-dependency modern Web Standards implementation. Extends `scripts/build-web.js` and `docs/index.html` with Touch Gesture Controllers (swipe horizontal physics with velocity detection), Screen Wake Lock API (`navigator.wakeLock`), CSS Responsive Grid/Flex with media queries (`@media (min-width: 768px)`), CSS `@media print` optimized formatting, and accessible keyboard navigation listeners (`ArrowLeft`, `ArrowRight`, `Escape`, `/`).

**Tech Stack:** Vanilla JavaScript (ES2024), Screen Wake Lock API, CSS Media Queries & CSS Custom Properties, Touch Events (`touchstart`, `touchmove`, `touchend`), HTML5 Web Storage, Node.js test runner (`node:test`).

**Spec:** [.agents/skills/apple-design/SKILL.md](file:///c:/Users/danil/Documents/Documentos%20Local/Documentos%20Local/Estudos/Projetos/exame-consciencia/.agents/skills/apple-design/SKILL.md)

## Global Constraints

- **Zero External Framework Dependencies:** Run entirely in vanilla JavaScript and CSS without external bundles, maintaining instant 0ms startup time.
- **100% Offline Capability:** All new features must work without an internet connection in the Service Worker cache.
- **Confidentiality by Design:** Custom sins and user input remain purely in local session state, subject to the same permanent wipe upon absolution.
- **Graceful Fallback:** If Screen Wake Lock or touch events are not supported by the client browser, fall back silently without errors.
- **Node Test Automation:** Every task is validated by automated tests in `tests/web/` executed via `node --test`.

## Review Focus

1. **Wake Lock Release & Re-acquisition:** When the screen locks or user switches away, Wake Lock is automatically released by the OS; on return to the confessional screen, re-request it cleanly.
2. **Swipe Gesture Conflict with Vertical Scroll:** Horizontal swipe between categories must ignore vertical drag scrolls to avoid accidental category switching while reading questions.
3. **Custom Sin Sanitization & Deletion:** Adding a custom sin must properly handle empty strings, render in confessional mode, and be erased upon absolution.
4. **Responsive Dual-Column Desktop Layout:** On screens >= 768px, layout smoothly transitions to split-view (sidebar category checklist + active question list) without breaking mobile card styling.
5. **Print View Privacy:** `@media print` must render a clean, high-contrast, black-and-white minimalist list of marked sins and dialogues, omitting all buttons, banners, and dark background fills.

---

### Task 1: Swipe Gestures & Progress Indicator Between Categories

**Files:**
- Modify: `scripts/build-web.js`
- Modify: `docs/index.html`
- Test: `tests/web/swipe-navigation.test.js`

**Interfaces:**
- Consumes: `touchstart`, `touchmove`, `touchend` events on examination content container.
- Produces: Horizontal swipe transitions between categories (`activeCategoryIndex` increment/decrement with bounds check); category progress stepper ("3 de 13") and slim progress bar.

- [ ] **Step 1: Write the failing test for Swipe Navigation and Stepper**

```javascript
// tests/web/swipe-navigation.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('HTML implements touch swipe gesture handlers for categories', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('initSwipeGesture(') || html.includes('handleTouchEnd('), 'Must define swipe gesture handling');
  assert.ok(html.includes('nextCategory('), 'Must have nextCategory function');
  assert.ok(html.includes('prevCategory('), 'Must have prevCategory function');
});

test('HTML renders category progress indicator', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('category-progress-bar') || html.includes('category-progress-text'), 'Must have category progress element');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/web/swipe-navigation.test.js`
Expected: FAIL with missing `nextCategory(`

- [ ] **Step 3: Implement Swipe Gestures and Category Stepper in `scripts/build-web.js`**

1. Add `nextCategory()` and `prevCategory()` with haptic feedback and active category bounds clamping (`0` to `CATALOG.categories.length - 1`).
2. Add touch gesture detector tracking `startX`, `startY`, delta distance and angle to distinguish horizontal swipes from vertical scrolls (threshold 50px, horizontal dominant).
3. Add discreet golden progress bar and subtitle indicator: `Categoria ${activeCategoryIndex + 1} de ${CATALOG.categories.length}`.
4. Run `node scripts/build-web.js`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/web/swipe-navigation.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/build-web.js docs/index.html tests/web/swipe-navigation.test.js
git commit -m "feat(ux): implementar navegacao por gestos de swipe e barra de progresso dos mandamentos"
```

---

### Task 2: Screen Wake Lock API & Low-Light Mode for Confessional

**Files:**
- Modify: `scripts/build-web.js`
- Modify: `docs/index.html`
- Test: `tests/web/wake-lock.test.js`

**Interfaces:**
- Consumes: `navigator.wakeLock.request('screen')`.
- Produces: `requestConfessionWakeLock()`, `releaseConfessionWakeLock()`, low-light candlelight toggle ("Modo Círio").

- [ ] **Step 1: Write the failing test for Wake Lock and Low-Light Mode**

```javascript
// tests/web/wake-lock.test.js
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
  assert.ok(html.includes('low-light-active') || html.includes('modo-cirio'), 'Must have low light CSS or class');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/web/wake-lock.test.js`
Expected: FAIL with missing `requestConfessionWakeLock(`

- [ ] **Step 3: Implement Wake Lock and Low-Light Mode in `scripts/build-web.js`**

1. Create `requestConfessionWakeLock()` that requests screen lock when `currentScreen === 'confession'` and releases it when transitioning out or on page visibility hide.
2. Add Low-Light Mode button ("🕯️ Modo Penumbra") in the confession screen header to dim background luminescence to pure deep amber and reduced white glare.
3. Run `node scripts/build-web.js`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/web/wake-lock.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/build-web.js docs/index.html tests/web/wake-lock.test.js
git commit -m "feat(confessional): adicionar wake lock de tela no confessionario e modo penumbra"
```

---

### Task 3: Custom Sins Entry & Act of Contrition Formula Switcher

**Files:**
- Modify: `scripts/build-web.js`
- Modify: `docs/index.html`
- Test: `tests/web/custom-sins-contrition.test.js`

**Interfaces:**
- Consumes: User text input for custom faults, contrition formula toggle (`'tradicional'` vs `'moderno'`).
- Produces: `addCustomSin(text)`, `removeCustomSin(id)`, rendering in both examination and confessional screen; Act of Contrition formula selector.

- [ ] **Step 1: Write the failing test for Custom Sins and Contrition Switcher**

```javascript
// tests/web/custom-sins-contrition.test.js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/web/custom-sins-contrition.test.js`
Expected: FAIL with missing `addCustomSin(`

- [ ] **Step 3: Implement Custom Sins and Contrition Switcher in `scripts/build-web.js`**

1. Add a dedicated "+ Adicionar falta pessoal" card at the bottom of the examination list:
   - Text input + "Adicionar" button.
   - Pushes `{ id: 'custom_' + Date.now(), text: input, isCustom: true }` to `customSins`.
   - Displays custom sins with a delete icon `✕` and frequency note field.
2. In the Confessional screen, display custom sins alongside catalog faults, allowing them to be struck through when declared.
3. In the Act of Contrition section, add tabs: `[ Breve / Tradicional ]` to switch between the two standard liturgical formulas.
4. Run `node scripts/build-web.js`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/web/custom-sins-contrition.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/build-web.js docs/index.html tests/web/custom-sins-contrition.test.js
git commit -m "feat(features): implementar adicao de faltas personalizadas e alternador de ato de contricao"
```

---

### Task 4: Responsive Tablet/Desktop Dual-Pane & Keyboard Navigation

**Files:**
- Modify: `scripts/build-web.js`
- Modify: `docs/index.html`
- Test: `tests/web/responsive-desktop.test.js`

**Interfaces:**
- Consumes: CSS `@media (min-width: 768px)`, Window `keydown` event.
- Produces: Dual-pane desktop layout (sticky category sidebar + questions panel), keyboard shortcuts (`ArrowLeft`, `ArrowRight`, `Escape`, `/`).

- [ ] **Step 1: Write the failing test for Desktop Responsiveness and Keyboard Navigation**

```javascript
// tests/web/responsive-desktop.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('CSS includes responsive media queries for tablet and desktop', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('@media (min-width: 768px)') || html.includes('@media (min-width: 800px)'), 'Must include tablet/desktop media query');
  assert.ok(html.includes('desktop-layout') || html.includes('exam-desktop-split'), 'Must have responsive split layout styles');
});

test('HTML implements desktop keyboard shortcuts', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('keydown'), 'Must listen to keydown events');
  assert.ok(html.includes('ArrowLeft') && html.includes('ArrowRight'), 'Must handle arrow navigation');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/web/responsive-desktop.test.js`
Expected: FAIL with missing media queries

- [ ] **Step 3: Implement Dual-Pane Responsive Styles and Keyboard Navigation in `scripts/build-web.js`**

1. Add CSS `@media (min-width: 768px)`:
   - Expand `.app-viewport` max-width to `860px`.
   - On the examination screen, render a dual-column layout:
     - Left column (300px): sticky list of all 13 categories with completion checkboxes/badges.
     - Right column (flex-1): search bar, active category title, and question cards.
2. Add `keydown` event listener for desktop users:
   - `ArrowRight` -> `nextCategory()`
   - `ArrowLeft` -> `prevCategory()`
   - `Escape` -> `closeSheet()` / `togglePrivacyShield(false)`
   - `/` -> Focus search input
3. Run `node scripts/build-web.js`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/web/responsive-desktop.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/build-web.js docs/index.html tests/web/responsive-desktop.test.js
git commit -m "feat(responsive): adicionar layout adaptativo para tablets/desktop e atalhos de teclado"
```

---

### Task 5: Print Stylesheet & Discreet Paper Guide ("Modo Papel")

**Files:**
- Modify: `scripts/build-web.js`
- Modify: `docs/index.html`
- Test: `tests/web/print-mode.test.js`

**Interfaces:**
- Consumes: CSS `@media print`, `window.print()`.
- Produces: "Imprimir Lista Discreta" button and printer-optimized layout (pure white background, clean serif typography, no buttons or banners).

- [ ] **Step 1: Write the failing test for Print Stylesheet**

```javascript
// tests/web/print-mode.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('HTML includes dedicated print stylesheet and print trigger', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../docs/index.html'), 'utf8');
  assert.ok(html.includes('@media print'), 'Must have print media query');
  assert.ok(html.includes('window.print()'), 'Must have window.print trigger');
  assert.ok(html.includes('print-only') || html.includes('no-print'), 'Must have print utility classes');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/web/print-mode.test.js`
Expected: FAIL with missing `@media print`

- [ ] **Step 3: Implement Print Stylesheet and Trigger in `scripts/build-web.js`**

1. Add `@media print` CSS:
   - Background `#FFFFFF !important`, text `#000000 !important`.
   - Hide navbars, buttons, floating bars, install banners, halos, checkboxes (`display: none !important`).
   - Format marked sins in an elegant two-column or numbered list suitable for folding.
   - Include opening dialogue, sins with notes, and act of contrition.
2. In the Confessional screen and Home screen, add a secondary button: "Imprimir / Salvar em PDF 📄".
3. Run `node scripts/build-web.js`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/web/print-mode.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/build-web.js docs/index.html tests/web/print-mode.test.js
git commit -m "feat(print): adicionar folha de estilo para impressao e guia discreto em papel"
```

---

### Task 6: Full Verification Suite & Deployment to GitHub Pages

**Files:**
- Modify: `docs/index.html`
- Modify: `docs/sw.js` (increment cache version if needed)
- Test: All web tests (`node --test tests/web/*.test.js`)

**Interfaces:**
- Consumes: Built `docs/` artifacts.
- Produces: Production deployment on GitHub Pages (`origin/main`).

- [ ] **Step 1: Run all test suites across all 5 new tasks + legacy tasks**

Run: `node --test tests/web/*.test.js`
Expected: 18+ tests passed, 0 failures.

- [ ] **Step 2: Verify `docs/index.html` builds cleanly**

Run: `node scripts/build-web.js`
Expected: `docs/index.html generated successfully!`

- [ ] **Step 3: Commit and Push to `origin main`**

```bash
git add docs/ scripts/ tests/
git commit -m "chore(release): publicar atualizacao de usabilidade, gestos e responsividade do PWA"
git push origin main
```
