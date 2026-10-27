const fs = require('fs');
const path = require('path');

const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/examination_catalog.json'), 'utf8'));

const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Exame de Consciência</title>
  
  <!-- Apple Web App & PWA Meta Tags -->
  <link rel="manifest" href="manifest.webmanifest">
  <link rel="icon" type="image/svg+xml" href="icons/icon.svg">
  <link rel="apple-touch-icon" href="icons/icon.svg">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Exame">
  <meta name="theme-color" content="#000000">
  <meta name="description" content="Aplicativo católico de exame de consciência e preparação para o Sacramento da Confissão. 100% offline e confidencial.">

  <!-- Tipografia Sacra & Apple SF -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      background: #000000;
      color: #F5F5F4;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", Roboto, sans-serif;
      min-height: 100vh;
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      align-items: center;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    /* App Container: 100% no celular, max-width elegante no desktop */
    .app-viewport {
      width: 100%;
      max-width: 480px;
      min-height: 100vh;
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      position: relative;
      background: #000000;
    }

    /* Halo suave de oração e recolhimento */
    .sanctuary-halo {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 240px;
      background: radial-gradient(circle at 50% -20%, rgba(245, 245, 244, 0.04), rgba(212, 175, 55, 0.015), transparent 70%);
      pointer-events: none;
      z-index: 1;
    }

    /* Sticky Translucent Apple Navigation Bar */
    .apple-nav {
      position: sticky;
      top: 0;
      width: 100%;
      background: rgba(0, 0, 0, 0.78);
      backdrop-filter: blur(28px) saturate(190%);
      -webkit-backdrop-filter: blur(28px) saturate(190%);
      z-index: 50;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: calc(env(safe-area-inset-top, 0px) + 12px) 18px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .nav-btn {
      background: transparent;
      border: none;
      color: #FFFFFF;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px;
    }
    .nav-btn:active {
      opacity: 0.7;
    }
    .nav-title {
      font-family: 'Cinzel', serif;
      font-size: 13.5px;
      letter-spacing: 1.5px;
      font-weight: 700;
      color: #FFFFFF;
    }
    .nav-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.1);
      color: #FFFFFF;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    /* Main Scrollable Content Area */
    .main-content {
      flex: 1;
      padding: 18px 18px calc(env(safe-area-inset-bottom, 0px) + 90px);
      z-index: 10;
      position: relative;
    }

    /* Apple Glass Cards */
    .card {
      background: rgba(20, 20, 24, 0.72);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-top: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 20px;
      padding: 16px;
      margin-bottom: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
      transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease;
    }
    .card-interactive:active {
      transform: scale(0.98);
    }
    .card-highlighted {
      border-color: #FFFFFF;
      border-top-color: #FFFFFF;
      background: rgba(32, 32, 38, 0.88);
    }

    /* Typography */
    .sacred-title {
      font-family: 'Cinzel', serif;
      font-size: 21px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #FFFFFF;
      text-align: center;
      margin-bottom: 4px;
    }
    .sacred-motto {
      font-family: 'EB Garamond', serif;
      font-style: italic;
      font-size: 13.5px;
      color: #A8A29E;
      text-align: center;
      margin-bottom: 18px;
    }
    .rubric {
      font-size: 10.5px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #A8A29E;
      margin-bottom: 4px;
    }
    .body-text {
      font-size: 14.5px;
      color: #E7E5E4;
      line-height: 1.52;
    }
    .cross-badge {
      width: 44px;
      height: 44px;
      border-radius: 22px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.16);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      color: #FFFFFF;
      margin: 4px auto 14px;
    }

    /* Apple Action Buttons */
    .btn-primary {
      width: 100%;
      background: #FFFFFF;
      color: #000000;
      border: 1px solid #FFFFFF;
      border-radius: 16px;
      padding: 16px;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.2px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
      transition: transform 0.12s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.15s ease;
      user-select: none;
    }
    .btn-primary:active {
      transform: scale(0.975);
      background: #E5E5E4;
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      color: #FFFFFF;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 14px;
      padding: 14px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      width: 100%;
      transition: transform 0.12s ease;
    }
    .btn-secondary:active {
      transform: scale(0.975);
    }

    /* Horizontal Category Segmented Scroller */
    .category-scroll {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 12px;
      margin: 0 -18px 14px -18px;
      padding-left: 18px;
      padding-right: 18px;
      scrollbar-width: none;
    }
    .category-scroll::-webkit-scrollbar {
      display: none;
    }
    .pill-cat {
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid rgba(255, 255, 255, 0.10);
      color: #A8A29E;
      border-radius: 999px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      user-select: none;
    }
    .pill-cat:active {
      transform: scale(0.96);
    }
    .pill-cat.active {
      background: #FFFFFF;
      color: #000000;
      font-weight: 600;
      border-color: #FFFFFF;
      box-shadow: 0 2px 10px rgba(255, 255, 255, 0.25);
    }

    /* Question Item Row with Checkbox */
    .question-row {
      display: flex;
      align-items: flex-start;
      gap: 13px;
      cursor: pointer;
      user-select: none;
    }
    .checkbox {
      width: 22px;
      height: 22px;
      border-radius: 7px;
      border: 1.8px solid #52525B;
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
      transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .checkbox.checked {
      background: #FFFFFF;
      border-color: #FFFFFF;
      color: #000000;
      animation: checkBounce 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .checkbox.checked::after {
      content: '✓';
      color: #000000;
      font-weight: 700;
      font-size: 13px;
    }
    @keyframes checkBounce {
      0% { transform: scale(0.7); }
      50% { transform: scale(1.18); }
      100% { transform: scale(1); }
    }

    /* Note Context Field */
    .note-box {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .note-input {
      width: 100%;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      padding: 8px 12px;
      color: #FFFFFF;
      font-size: 13px;
      outline: none;
    }
    .quick-freq-row {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
    }
    .quick-freq-pill {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.14);
      color: #A8A29E;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 8px;
      cursor: pointer;
    }
    .quick-freq-pill:active {
      background: #FFFFFF;
      color: #000000;
    }

    /* Floating Bottom Action Bar */
    .floating-bar {
      position: fixed;
      bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
      width: 100%;
      max-width: 480px;
      padding: 0 18px;
      z-index: 45;
      pointer-events: none;
    }
    .floating-bar button {
      pointer-events: auto;
    }

    /* Confessional Veiled Dim */
    .dimmed {
      opacity: 0.25 !important;
      text-decoration: line-through;
      transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Apple Bottom Sheet Modal */
    .sheet-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.72);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 100;
      display: none;
      align-items: flex-end;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.25s ease;
    }
    .sheet-overlay.active {
      display: flex;
      opacity: 1;
    }
    .sheet-card {
      width: 100%;
      max-width: 480px;
      background: #141418;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 28px 28px 0 0;
      padding: 14px 20px calc(env(safe-area-inset-bottom, 0px) + 24px);
      transform: translateY(100%);
      transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.7);
    }
    .sheet-overlay.active .sheet-card {
      transform: translateY(0);
    }
    .sheet-grabber {
      width: 38px;
      height: 5px;
      border-radius: 3px;
      background: rgba(255, 255, 255, 0.35);
      margin: 0 auto 16px;
    }
    /* Smart PWA Install Banner */
    .install-banner {
      position: fixed;
      bottom: calc(env(safe-area-inset-bottom, 0px) + 14px);
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 32px);
      max-width: 440px;
      background: rgba(18, 18, 22, 0.95);
      backdrop-filter: blur(28px) saturate(180%);
      -webkit-backdrop-filter: blur(28px) saturate(180%);
      border: 1px solid rgba(212, 175, 55, 0.35);
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.85), 0 0 24px rgba(212, 175, 55, 0.12);
      border-radius: 20px;
      padding: 10px 14px;
      z-index: 85;
      animation: bannerSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes bannerSlideUp {
      from { transform: translate(-50%, 40px); opacity: 0; }
      to { transform: translate(-50%, 0); opacity: 1; }
    }
    .install-banner-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .install-banner-left {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }
    .install-banner-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #1C1917, #000);
      border: 1px solid rgba(212, 175, 55, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #D4AF37;
      font-size: 17px;
      flex-shrink: 0;
    }
    .install-banner-title {
      font-size: 13.5px;
      font-weight: 600;
      color: #FFFFFF;
    }
    .install-banner-sub {
      font-size: 11px;
      color: #A8A29E;
    }
    .install-banner-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-install-cta {
      background: #D4AF37;
      color: #000;
      border: none;
      border-radius: 999px;
      padding: 6px 13px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
    }
    .btn-install-dismiss {
      background: transparent;
      border: none;
      color: #78716C;
      font-size: 15px;
      padding: 4px;
      cursor: pointer;
    }
  </style>
</head>
<body>

  <div class="sanctuary-halo"></div>

  <div class="app-viewport" id="app">
    <!-- Screen View Injected Dynamically -->
  </div>

  <!-- Smart PWA Install Banner -->
  <div id="install-banner" class="install-banner" style="display: none;">
    <div class="install-banner-inner">
      <div class="install-banner-left" onclick="openInstallGuide()">
        <div class="install-banner-icon">✝</div>
        <div>
          <div class="install-banner-title">Instalar Aplicativo</div>
          <div class="install-banner-sub">100% offline & tela cheia</div>
        </div>
      </div>
      <div class="install-banner-actions">
        <button class="btn-install-cta" onclick="openInstallGuide()">Como Instalar</button>
        <button class="btn-install-dismiss" onclick="dismissInstallBanner()" aria-label="Fechar">✕</button>
      </div>
    </div>
  </div>

  <!-- Apple Sheet Modal -->
  <div class="sheet-overlay" id="sheet-modal" onclick="closeSheet(event)">
    <div class="sheet-card" onclick="event.stopPropagation()">
      <div class="sheet-grabber"></div>
      <div id="sheet-content"></div>
    </div>
  </div>

  <script>
    // Register Service Worker for 100% Offline Capability
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch((err) => {
          console.log('SW registration error:', err);
        });
      });
    }

    const CATALOG = ${JSON.stringify(catalog)};

    // State Management
    let currentScreen = 'home'; // 'home' | 'exam' | 'confession' | 'peace'
    let selectedQuestions = new Set();
    let questionNotes = {};
    let customSins = [];
    let confessedQuestions = new Set();
    let activeCategoryIndex = 0;
    let lastConfessionDate = localStorage.getItem('last_confession_date') || null;
    let textSizeMultiplier = 1.0;

    // Load saved session if exists
    try {
      const saved = localStorage.getItem('confession_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selected) selectedQuestions = new Set(parsed.selected);
        if (parsed.notes) questionNotes = parsed.notes;
        if (parsed.custom) customSins = parsed.custom;
      }
    } catch (e) {}

    function saveSession() {
      try {
        localStorage.setItem('confession_draft', JSON.stringify({
          selected: Array.from(selectedQuestions),
          notes: questionNotes,
          custom: customSins
        }));
      } catch (e) {}
    }

    function formatDaysSince(dateStr) {
      if (!dateStr) return 'Nenhuma confissão registrada';
      const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
      if (days === 0) return 'Hoje';
      if (days === 1) return 'Ontem (há 1 dia)';
      return 'Há ' + days + ' dias';
    }

    // PWA Installation Guide State & Handlers
    let currentInstallOS = /iPhone|iPad|iPod/.test(navigator.userAgent) ? 'ios' : 'android';

    function openInstallGuide(targetOS) {
      if (targetOS) currentInstallOS = targetOS;
      openSheet('install-guide');
    }

    function dismissInstallBanner() {
      const banner = document.getElementById('install-banner');
      if (banner) banner.style.display = 'none';
      localStorage.setItem('pwa_install_dismissed', 'true');
    }

    function checkInstallBanner() {
      const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
      const dismissed = localStorage.getItem('pwa_install_dismissed') === 'true';
      const banner = document.getElementById('install-banner');
      if (banner) {
        if (!isStandalone && !dismissed) {
          banner.style.display = 'block';
        } else {
          banner.style.display = 'none';
        }
      }
    }

    function setScreen(screen) {
      currentScreen = screen;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      render();
    }

    function toggleQuestion(qId) {
      if (selectedQuestions.has(qId)) {
        selectedQuestions.delete(qId);
      } else {
        selectedQuestions.add(qId);
      }
      saveSession();
      render();
    }

    function updateNote(qId, text) {
      questionNotes[qId] = text;
      saveSession();
    }

    function setQuickFreq(qId, freq) {
      const curr = questionNotes[qId] || '';
      questionNotes[qId] = curr ? freq + ' — ' + curr : freq;
      saveSession();
      render();
    }

    function toggleConfessed(qId) {
      if (confessedQuestions.has(qId)) {
        confessedQuestions.delete(qId);
      } else {
        confessedQuestions.add(qId);
      }
      render();
    }

    function openSheet(type) {
      const overlay = document.getElementById('sheet-modal');
      const content = document.getElementById('sheet-content');

      if (type === 'steps') {
        const steps = CATALOG.confessionGuide || [];
        content.innerHTML = \`
          <div style="text-align: center; margin-bottom: 16px;">
            <div class="rubric">CATEQUESE TRADICIONAL</div>
            <div style="font-family: 'Cinzel', serif; font-size: 17px; font-weight: 700;">Os 5 Passos da Boa Confissão</div>
          </div>
          <div style="max-height: 60vh; overflow-y: auto; margin-bottom: 16px; display: flex; flex-direction: column; gap: 12px;">
            \${steps.map(s => \`
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <div style="width: 26px; height: 26px; border-radius: 13px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0;">\${s.number}</div>
                <div>
                  <div style="font-size: 14.5px; font-weight: 600; color: #FFF; margin-bottom: 2px;">\${s.title}</div>
                  <div style="font-size: 13px; color: #A8A29E; line-height: 1.45;">\${s.description}</div>
                </div>
              </div>
            \`).join('')}
          </div>
          <button class="btn-primary" onclick="closeSheet()">Compreendi</button>
        \`;
      } else if (type === 'adjust-date') {
        content.innerHTML = \`
          <div style="text-align: center; margin-bottom: 16px;">
            <div class="rubric">REGISTRO SACRAMENTAL</div>
            <div style="font-family: 'Cinzel', serif; font-size: 17px; font-weight: 700;">Data da Última Confissão</div>
            <div style="font-size: 13px; color: #A8A29E; margin-top: 4px;">Há quantos dias aproximadamente você se confessou?</div>
          </div>
          <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px;">
            \${[0, 7, 14, 30, 60, 90, 180].map(d => \`
              <button class="pill-cat" onclick="saveManualDays(\${d})">\${d === 0 ? 'Hoje' : d + ' dias'}</button>
            \`).join('')}
          </div>
          <button class="btn-secondary" onclick="clearConfessionDate()">Limpar registro</button>
        \`;
      } else if (type === 'absolution') {
        content.innerHTML = \`
          <div style="text-align: center; margin-bottom: 18px;">
            <div class="rubric">SACRAMENTO DA PENITÊNCIA</div>
            <div style="font-family: 'Cinzel', serif; font-size: 19px; font-weight: 700; margin-bottom: 6px;">Receber a Absolvição?</div>
            <div style="font-size: 13.5px; color: #A8A29E; line-height: 1.5; padding: 0 8px;">
              O sacerdote concedeu a absolvição sacramental? Seus pecados e anotações serão destruídos da memória, preservando apenas a data de hoje.
            </div>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn-secondary" style="flex: 1;" onclick="closeSheet()">Ainda não</button>
            <button class="btn-primary" style="flex: 1;" onclick="confirmAbsolution()">Sim, Fui Absolvido</button>
          </div>
        \`;
      } else if (type === 'install-guide') {
        content.innerHTML = \`
          <div style="text-align: center; margin-bottom: 16px;">
            <div class="rubric">APLICATIVO NATIVO PWA</div>
            <div style="font-family: 'Cinzel', serif; font-size: 18px; font-weight: 700;">Instalar na Tela Inicial</div>
            <div style="font-size: 12.5px; color: #A8A29E; margin-top: 3px;">Use em tela cheia, sem barra do navegador e 100% offline</div>
          </div>

          <!-- Tabs iOS / Android -->
          <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 16px;">
            <button class="pill-cat \${currentInstallOS === 'ios' ? 'active' : ''}" onclick="openInstallGuide('ios')">
               iPhone (iOS Safari)
            </button>
            <button class="pill-cat \${currentInstallOS === 'android' ? 'active' : ''}" onclick="openInstallGuide('android')">
              🤖 Android (Chrome)
            </button>
          </div>

          \${currentInstallOS === 'ios' ? \`
            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
              <div class="card" style="margin: 0; background: rgba(255,255,255,0.04); display: flex; gap: 12px; align-items: center;">
                <div style="width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 20px; color: #38BDF8; flex-shrink: 0;">⎋</div>
                <div>
                  <div style="font-size: 13.5px; font-weight: 600; color: #FFF;">1. Toque em Compartilhar</div>
                  <div style="font-size: 12px; color: #A8A29E;">No Safari do iPhone, toque no botão Compartilhar (o ícone de quadrado com seta para cima na barra inferior).</div>
                </div>
              </div>

              <div class="card" style="margin: 0; background: rgba(255,255,255,0.04); display: flex; gap: 12px; align-items: center;">
                <div style="width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 20px; color: #F59E0B; flex-shrink: 0;">⊞</div>
                <div>
                  <div style="font-size: 13.5px; font-weight: 600; color: #FFF;">2. Adicionar à Tela de Início</div>
                  <div style="font-size: 12px; color: #A8A29E;">Role para baixo no menu e toque na opção "Adicionar à Tela de Início".</div>
                </div>
              </div>

              <div class="card" style="margin: 0; background: rgba(255,255,255,0.04); display: flex; gap: 12px; align-items: center;">
                <div style="width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 20px; color: #10B981; flex-shrink: 0;">✓</div>
                <div>
                  <div style="font-size: 13.5px; font-weight: 600; color: #FFF;">3. Confirmar e Usar</div>
                  <div style="font-size: 12px; color: #A8A29E;">Toque em "Adicionar" no topo direito. Pronto! O app abrirá como aplicativo nativo em tela cheia.</div>
                </div>
              </div>
            </div>
          \` : \`
            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
              <div class="card" style="margin: 0; background: rgba(255,255,255,0.04); display: flex; gap: 12px; align-items: center;">
                <div style="width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 20px; color: #38BDF8; flex-shrink: 0;">⋮</div>
                <div>
                  <div style="font-size: 13.5px; font-weight: 600; color: #FFF;">1. Menu do Navegador</div>
                  <div style="font-size: 12px; color: #A8A29E;">No Google Chrome do Android, toque no menu de 3 pontinhos no canto superior.</div>
                </div>
              </div>

              <div class="card" style="margin: 0; background: rgba(255,255,255,0.04); display: flex; gap: 12px; align-items: center;">
                <div style="width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 20px; color: #F59E0B; flex-shrink: 0;">⬇</div>
                <div>
                  <div style="font-size: 13.5px; font-weight: 600; color: #FFF;">2. Instalar Aplicativo</div>
                  <div style="font-size: 12px; color: #A8A29E;">Toque em "Instalar aplicativo" ou "Adicionar à tela inicial".</div>
                </div>
              </div>

              <div class="card" style="margin: 0; background: rgba(255,255,255,0.04); display: flex; gap: 12px; align-items: center;">
                <div style="width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 20px; color: #10B981; flex-shrink: 0;">✓</div>
                <div>
                  <div style="font-size: 13.5px; font-weight: 600; color: #FFF;">3. Confirmar</div>
                  <div style="font-size: 12px; color: #A8A29E;">Confirme a instalação. O ícone aparecerá na sua tela inicial funcionando offline.</div>
                </div>
              </div>
            </div>
          \`}

          <button class="btn-primary" onclick="closeSheet()">Compreendi</button>
        \`;
      }

      overlay.classList.add('active');
    }

    function closeSheet() {
      document.getElementById('sheet-modal').classList.remove('active');
    }

    function saveManualDays(days) {
      const targetDate = new Date(Date.now() - days * 86400000).toISOString();
      lastConfessionDate = targetDate;
      localStorage.setItem('last_confession_date', targetDate);
      closeSheet();
      render();
    }

    function clearConfessionDate() {
      lastConfessionDate = null;
      localStorage.removeItem('last_confession_date');
      closeSheet();
      render();
    }

    function confirmAbsolution() {
      closeSheet();
      selectedQuestions.clear();
      questionNotes = {};
      customSins = [];
      confessedQuestions.clear();
      localStorage.removeItem('confession_draft');
      const now = new Date().toISOString();
      lastConfessionDate = now;
      localStorage.setItem('last_confession_date', now);
      setScreen('peace');
    }

    function render() {
      const app = document.getElementById('app');
      const totalSelected = selectedQuestions.size + customSins.length;

      if (currentScreen === 'home') {
        const prayer = CATALOG.prayers.find(p => p.id === 'espirito-santo');
        app.innerHTML = \`
          <div class="apple-nav">
            <span class="rubric" style="font-size: 10.5px;">SACRAMENTO</span>
            <span class="nav-title">EXAME DE CONSCIÊNCIA</span>
            <span style="width: 24px;"></span>
          </div>

          <div class="main-content">
            <div class="cross-badge">†</div>
            <div class="sacred-title">EXAME DE CONSCIÊNCIA</div>
            <div class="sacred-motto">«Cor contritum et humiliatum, Deus, non despicies»</div>

            <!-- Card da Última Confissão -->
            <div class="card card-interactive" onclick="openSheet('adjust-date')">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span class="rubric">ÚLTIMA CONFISSÃO</span>
                <span style="font-size: 11px; padding: 3px 9px; border-radius: 999px; background: rgba(255,255,255,0.08); color: #FFF; font-weight: 600;">Ajustar</span>
              </div>
              <div style="font-size: 17px; font-weight: 600; color: #FFF; margin-bottom: 2px;">
                \${formatDaysSince(lastConfessionDate)}
              </div>
              <div style="font-size: 12px; color: #A8A29E;">
                \${lastConfessionDate ? 'Tempo oportuno para recolhimento e reconciliação' : 'Toque em ajustar para informar a data aproximada'}
              </div>
            </div>

            <!-- Os 5 Passos da Boa Confissão -->
            <div class="card card-interactive" onclick="openSheet('steps')">
              <div class="rubric">GUIA DO PENITENTE</div>
              <div style="font-size: 15.5px; font-weight: 600; color: #FFF; margin-bottom: 4px;">Os 5 Passos da Boa Confissão</div>
              <div style="font-size: 12.5px; color: #A8A29E; line-height: 1.45;">
                1. Exame · 2. Dor / Contrição · 3. Propósito firme · 4. Confissão oral · 5. Penitência.
              </div>
            </div>

            <!-- Como Instalar no Celular PWA -->
            <div class="card card-interactive" onclick="openInstallGuide()" style="border-left: 3px solid #D4AF37;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div class="rubric" style="margin-bottom: 2px;">TELA INICIAL & OFFLINE</div>
                  <div style="font-weight: 600; font-size: 15px; color: #FFF;">Como Instalar no Celular</div>
                  <div style="font-size: 12px; color: #A8A29E; margin-top: 2px;">Adicione ao iPhone ou Android para usar em tela cheia</div>
                </div>
                <span style="font-size: 22px; color: #D4AF37;">📲</span>
              </div>
            </div>

            <!-- Oração ao Espírito Santo -->
            <div class="card">
              <div class="rubric">\${prayer.title.toUpperCase()}</div>
              <div style="font-family: 'EB Garamond', serif; font-size: 14.5px; font-style: italic; color: #E7E5E4; line-height: 1.55;">
                “\${prayer.body}”
              </div>
            </div>

            <!-- Ações -->
            <button class="btn-primary" onclick="setScreen('exam')" style="margin-top: 14px;">
              <span>\${totalSelected > 0 ? 'Continuar Exame de Consciência' : 'Iniciar Exame de Consciência'}</span>
              <span>→</span>
            </button>

            \${totalSelected > 0 ? \`
              <button class="btn-secondary" onclick="setScreen('confession')" style="margin-top: 10px;">
                No Confessionário (\${totalSelected} \${totalSelected === 1 ? 'pecado apontado' : 'pecados apontados'})
              </button>
            \` : ''}

            <div style="text-align: center; margin-top: 24px; font-size: 11.5px; color: #78716C; line-height: 1.5;">
              🔒 100% offline e sigiloso. Seus apontamentos são destruídos assim que você recebe a absolvição.
            </div>
          </div>
        \`;
      } else if (currentScreen === 'exam') {
        const cat = CATALOG.categories[activeCategoryIndex] || CATALOG.categories[0];
        app.innerHTML = \`
          <div class="apple-nav">
            <button class="nav-btn" onclick="setScreen('home')">‹ Início</button>
            <span class="nav-title">\${cat.title.toUpperCase()}</span>
            <span class="nav-badge">\${totalSelected} Faltas</span>
          </div>

          <div class="main-content">
            <!-- Scroller de Categorias -->
            <div class="category-scroll">
              \${CATALOG.categories.map((c, idx) => \`
                <div class="pill-cat \${idx === activeCategoryIndex ? 'active' : ''}" onclick="activeCategoryIndex = \${idx}; render();">
                  \${c.title}
                </div>
              \`).join('')}
            </div>

            <div style="margin-bottom: 16px;">
              <div class="rubric">\${cat.title.toUpperCase()}</div>
              <div style="font-size: 19px; font-weight: 700; color: #FFF; letter-spacing: -0.3px;">\${cat.subtitle}</div>
            </div>

            <!-- Lista de Perguntas -->
            \${cat.questions.map(q => {
              const isChecked = selectedQuestions.has(q.id);
              const note = questionNotes[q.id] || '';
              return \`
                <div class="card \${isChecked ? 'card-highlighted' : ''}">
                  <div class="question-row" onclick="toggleQuestion('\${q.id}')">
                    <div class="checkbox \${isChecked ? 'checked' : ''}"></div>
                    <div style="flex: 1;">
                      <div class="body-text">\${q.text}</div>
                    </div>
                  </div>

                  \${isChecked ? \`
                    <div class="note-box">
                      <input 
                        type="text" 
                        class="note-input" 
                        placeholder="Frequência aproximada ou nota (opcional)..." 
                        value="\${note}"
                        onchange="updateNote('\${q.id}', this.value)"
                      />
                      <div class="quick-freq-row">
                        <span style="font-size: 11px; color: #A8A29E;">Atalho:</span>
                        \${['1x', '2x', '3x', 'Várias vezes'].map(f => \`
                          <button class="quick-freq-pill" onclick="setQuickFreq('\${q.id}', '\${f}')">\${f}</button>
                        \`).join('')}
                      </div>
                    </div>
                  \` : ''}
                </div>
              \`;
            }).join('')}
          </div>

          \${totalSelected > 0 ? \`
            <div class="floating-bar">
              <button class="btn-primary" onclick="setScreen('confession')">
                <span>No Confessionário (\${totalSelected} \${totalSelected === 1 ? 'item' : 'itens'})</span>
                <span>→</span>
              </button>
            </div>
          \` : ''}
        \`;
      } else if (currentScreen === 'confession') {
        const markedList = [];
        CATALOG.categories.forEach(c => {
          c.questions.forEach(q => {
            if (selectedQuestions.has(q.id)) {
              markedList.push({ ...q, categoryTitle: c.title, note: questionNotes[q.id] || '' });
            }
          });
        });

        const actContrition = CATALOG.prayers.find(p => p.id === 'ato-contricao');

        app.innerHTML = \`
          <div class="apple-nav">
            <button class="nav-btn" onclick="setScreen('exam')">‹ Exame</button>
            <span class="nav-title">NO CONFESSIONÁRIO</span>
            <span style="width: 24px;"></span>
          </div>

          <div class="main-content">
            <!-- Fala de Entrada -->
            <div class="card">
              <div class="rubric">FALA DO PENITENTE COM O SACERDOTE</div>
              <div style="font-family: 'EB Garamond', serif; font-size: 15px; font-style: italic; color: #FFF; line-height: 1.5;">
                “Abençoai-me, Padre, porque pequei. Minha última confissão foi \${formatDaysSince(lastConfessionDate)}. Estes são os meus pecados:”
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: baseline; margin: 16px 4px 8px;">
              <span class="rubric">PECADOS A DECLARAR</span>
              <span style="font-size: 11px; color: #A8A29E;">Toque no item após declará-lo</span>
            </div>

            \${markedList.length === 0 ? \`
              <div class="card" style="text-align: center; padding: 28px 16px;">
                <div style="font-size: 16px; font-weight: 600; color: #FFF; margin-bottom: 4px;">Nenhum pecado apontado</div>
                <div style="font-size: 13px; color: #A8A29E;">Volte ao exame para selecionar as faltas antes de se confessar.</div>
              </div>
            \` : ''}

            \${markedList.map(item => {
              const isConfessed = confessedQuestions.has(item.id);
              return \`
                <div class="card card-interactive \${isConfessed ? 'dimmed' : ''}" onclick="toggleConfessed('\${item.id}')">
                  <div style="display: flex; gap: 12px; align-items: flex-start;">
                    <div class="checkbox \${isConfessed ? 'checked' : ''}"></div>
                    <div style="flex: 1;">
                      <div class="rubric" style="font-size: 10px; margin-bottom: 2px;">\${item.categoryTitle.toUpperCase()}</div>
                      <div style="font-size: 14.5px; color: #FFF; line-height: 1.45;">\${item.text}</div>
                      \${item.note ? \`<div style="font-size: 12px; color: #D4AF37; margin-top: 4px; font-style: italic;">Nota: \${item.note}</div>\` : ''}
                    </div>
                  </div>
                </div>
              \`;
            }).join('')}

            <!-- Conclusão -->
            <div class="card" style="margin-top: 14px;">
              <div class="rubric">AO CONCLUIR A ACUSAÇÃO</div>
              <div style="font-family: 'EB Garamond', serif; font-size: 14.5px; font-style: italic; color: #FFF; line-height: 1.5;">
                “Destes pecados e de todos os que por fraqueza não me lembro, peço a Deus perdão e a vós, Padre, a penitência e a absolvição.”
              </div>
            </div>

            <!-- Ato de Contrição -->
            <div class="card">
              <div class="rubric">ATO DE CONTRIÇÃO</div>
              <div style="font-size: 14px; color: #FFF; line-height: 1.55;">
                \${actContrition.body}
              </div>
            </div>

            <button class="btn-primary" onclick="openSheet('absolution')" style="margin-top: 14px;">
              <span>Recebi a Absolvição</span>
              <span>✝</span>
            </button>
          </div>
        \`;
      } else if (currentScreen === 'peace') {
        const thanks = CATALOG.prayers.find(p => p.id === 'acao-gracas');
        app.innerHTML = \`
          <div class="main-content" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; text-align: center;">
            <div class="cross-badge" style="width: 60px; height: 60px; border-radius: 30px; font-size: 30px; margin-bottom: 16px;">✝</div>
            <div class="sacred-title" style="font-size: 22px; margin-bottom: 8px;">ABSOLVIÇÃO CONCEDIDA</div>
            <div class="sacred-motto" style="font-size: 16px; margin-bottom: 24px; padding: 0 16px;">
              «Vai em paz, e que o Senhor perdoe todos os teus pecados.»
            </div>

            <div class="card" style="text-align: left; margin-bottom: 24px;">
              <div class="rubric">\${thanks.title.toUpperCase()}</div>
              <div style="font-family: 'EB Garamond', serif; font-size: 15px; font-style: italic; color: #FFF; line-height: 1.55;">
                “\${thanks.body}”
              </div>
            </div>

            <div style="font-size: 12px; color: #A8A29E; margin-bottom: 24px; padding: 0 16px;">
              ✓ Todos os seus pecados e anotações foram permanentemente destruídos da memória deste aparelho.
            </div>

            <button class="btn-primary" onclick="setScreen('home')">
              Voltar à Paz de Cristo
            </button>
          </div>
        \`;
      }
    }

    // Initial Render
    render();
    checkInstallBanner();
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '../docs/index.html'), htmlContent, 'utf8');
console.log('docs/index.html generated successfully!');
