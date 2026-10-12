/* ============================================
   MCU TRACKER — THEME SWITCHER (FIXED)
   Sirf body pe class lagata hai. Layout safe.
   ============================================ */

(function () {
  'use strict';

  const THEMES = ['cosmos', 'arc', 'inferno', 'vibranium', 'bifrost', 'doomsday', 'noir'];
  const DEFAULT_THEME = 'cosmos';

  // ===== Apply Theme =====
  function applyTheme(themeName) {
    if (!THEMES.includes(themeName)) themeName = DEFAULT_THEME;

    // Remove all theme-* classes safely
    THEMES.forEach(t => document.body.classList.remove('theme-' + t));

    // Add new theme class
    document.body.classList.add('theme-' + themeName);

    // Save to localStorage
    try {
      localStorage.setItem('mcuHeroTheme', themeName);
    } catch (e) { /* ignore */ }

    // Update active button UI
    document.querySelectorAll('[data-hero-theme]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.heroTheme === themeName);
    });
  }

  // ===== Load Theme on Start =====
  function loadSavedTheme() {
    let saved = DEFAULT_THEME;
    try {
      saved = localStorage.getItem('mcuHeroTheme') || DEFAULT_THEME;
    } catch (e) { /* ignore */ }
    applyTheme(saved);
  }

  // ===== Dark / Light Toggle =====
  function toggleLightMode() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    try {
      localStorage.setItem('mcuLightMode', isLight ? '1' : '0');
    } catch (e) { /* ignore */ }
  }

  function loadLightMode() {
    try {
      if (localStorage.getItem('mcuLightMode') === '1') {
        document.body.classList.add('light-mode');
      }
    } catch (e) { /* ignore */ }
  }

  // ===== Attach Button Listeners =====
  function setupButtons() {
    // Theme buttons
    document.querySelectorAll('[data-hero-theme]').forEach(btn => {
      btn.addEventListener('click', () => {
        applyTheme(btn.dataset.heroTheme);
      });
    });

    // Dark/light toggle
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleLightMode);
    }
  }

  // ===== Init on DOM Ready =====
  function init() {
    loadSavedTheme();
    loadLightMode();
    setupButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for other scripts
  window.__mcuApplyTheme = applyTheme;

})();