/* ═══════════════════════════════════════════════════════════
   MCU TRACKER — PREMIUM THEME SYSTEM
   7 new themes — full website color change
   ═══════════════════════════════════════════════════════════ */

(function() {
  "use strict";

  const $ = id => document.getElementById(id);

  /* ═══════════ THEME DATA ═══════════ */
  const themeData = {
    cosmos: {
      label: "Cosmos",
      title: "Guardians of the Galaxy",
      subtitle: "Cosmos • Phase 2",
      poster: "https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg"
    },
    inferno: {
      label: "Inferno",
      title: "Avengers: Endgame",
      subtitle: "Inferno • Phase 3",
      poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg"
    },
    infinity: {
      label: "Infinity",
      title: "Avengers: Infinity War",
      subtitle: "Infinity • Phase 3",
      poster: "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg"
    },
    vibranium: {
      label: "Vibranium",
      title: "Black Panther: Wakanda Forever",
      subtitle: "Vibranium • Phase 4",
      poster: "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg"
    },
    bifrost: {
      label: "Bifrost",
      title: "Thor: Ragnarok",
      subtitle: "Bifrost • Phase 3",
      poster: "https://image.tmdb.org/t/p/w500/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg"
    },
    doomsday: {
      label: "Doomsday",
      title: "Avengers: Doomsday",
      subtitle: "Doomsday • Phase 6",
      poster: "https://images.flickdirect.com/movies/avengers-doomsday/avengers-doomsday-poster.jpg"
    },
    noir: {
      label: "Noir",
      title: "Iron Man",
      subtitle: "Noir • Phase 1",
      poster: "https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg"
    }
  };

  /* ═══════════ APPLY THEME ═══════════ */
  function applyTheme(themeId) {
    if (!themeData[themeId]) themeId = "cosmos";

    // Flash animation
    document.body.classList.add("theme-switching");
    setTimeout(() => document.body.classList.remove("theme-switching"), 500);

    // Remove all theme classes
    document.body.classList.remove(
      "theme-cosmos", "theme-inferno", "theme-infinity",
      "theme-vibranium", "theme-bifrost", "theme-doomsday", "theme-noir"
    );

    // Add active theme class (except cosmos which is default)
    if (themeId !== "cosmos") {
      document.body.classList.add("theme-" + themeId);
    }

    // Save preference
    try { localStorage.setItem("mcuHeroTheme", themeId); } catch (e) {}

    // Update button active state
    document.querySelectorAll("[data-hero-theme]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.heroTheme === themeId);
    });

    // Update hero poster + text
    const data = themeData[themeId];
    const poster = $("themePoster");
    const title = $("themePosterTitle");
    const subtitle = $("themePosterSubtitle");

    if (poster) { poster.src = data.poster; poster.alt = data.title + " poster"; }
    if (title) title.textContent = data.title;
    if (subtitle) subtitle.textContent = data.subtitle;

    console.log("🎨 Theme applied:", themeId);
  }

  /* ═══════════ BIND THEME BUTTONS ═══════════ */
  function bindThemeButtons() {
    const buttons = document.querySelectorAll("[data-hero-theme]");
    console.log(`🎨 Found ${buttons.length} theme buttons`);

    buttons.forEach(btn => {
      // Clone to remove old listeners
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
    });

    document.querySelectorAll("[data-hero-theme]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const theme = btn.dataset.heroTheme;
        applyTheme(theme);

        if (window.showToast) {
          const data = themeData[theme];
          window.showToast("✓ Theme: " + (data ? data.label : theme), "ok");
        }
      });
    });
  }

  /* ═══════════ LOAD SAVED THEME ═══════════ */
  function loadSavedTheme() {
    let saved = "cosmos";
    try { saved = localStorage.getItem("mcuHeroTheme") || "cosmos"; } catch (e) {}
    applyTheme(saved);
  }

  /* ═══════════ DARK / LIGHT TOGGLE ═══════════ */
  const themeBtn = $("themeBtn");

  function loadDarkMode() {
    let saved = null;
    try { saved = localStorage.getItem("mcuTheme"); } catch (e) {}
    if (saved === "light") {
      document.body.classList.add("light-mode");
      if (themeBtn) themeBtn.textContent = "🌙 Dark";
    } else {
      document.body.classList.remove("light-mode");
      if (themeBtn) themeBtn.textContent = "☀️ Light";
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      const isLight = document.body.classList.contains("light-mode");
      try { localStorage.setItem("mcuTheme", isLight ? "light" : "dark"); } catch (e) {}
      themeBtn.textContent = isLight ? "🌙 Dark" : "☀️ Light";
      if (window.showToast) window.showToast(isLight ? "☀️ Light mode" : "🌙 Dark mode", "ok");
    });
  }

  loadDarkMode();

  /* ═══════════ SOUND TOGGLE ═══════════ */
  const soundBtn = $("soundBtn");
  let soundEnabled = true;
  try { soundEnabled = localStorage.getItem("mcuSound") !== "false"; } catch (e) {}

  function updateSoundBtn() {
    if (soundBtn) soundBtn.textContent = soundEnabled ? "🔊 Sound" : "🔇 Sound";
  }

  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      try { localStorage.setItem("mcuSound", soundEnabled); } catch (e) {}
      updateSoundBtn();
      if (window.showToast) window.showToast(soundEnabled ? "🔊 Sound on" : "🔇 Sound off", "ok");
    });
  }

  updateSoundBtn();

  /* ═══════════ RESET ═══════════ */
  const resetBtn = $("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (window.resetTracker) window.resetTracker();
    });
  }

  /* ═══════════ EXPLORE ═══════════ */
  const heroExploreBtn = $("heroExploreBtn");
  if (heroExploreBtn) {
    heroExploreBtn.addEventListener("click", () => {
      const movieList = $("movieList");
      if (movieList) movieList.scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ═══════════ V3 DASHBOARD NAME ═══════════ */
  const V3 = { nameKey: "mcuV3Name" };

  function renderV3Name() {
    let name = "Shashwat";
    try { name = localStorage.getItem(V3.nameKey) || "Shashwat"; } catch (e) {}

    const greeting = $("v3Greeting");
    const avatar = $("v3Avatar");
    const nameInput = $("v3NameInput");

    if (greeting) greeting.textContent = "Welcome back, " + name + " ⚡";
    if (avatar) avatar.textContent = (name.trim().charAt(0).toUpperCase()) || "S";
    if (nameInput) nameInput.value = name;
  }

  const v3SaveName = $("v3SaveName");
  if (v3SaveName) {
    v3SaveName.addEventListener("click", () => {
      const input = $("v3NameInput");
      const value = (input && input.value.trim()) || "Shashwat";
      try { localStorage.setItem(V3.nameKey, value); } catch (e) {}
      renderV3Name();
      if (window.showToast) window.showToast("✓ Name saved", "ok");
    });
  }

  const v3NameInput = $("v3NameInput");
  if (v3NameInput) {
    v3NameInput.addEventListener("keydown", e => {
      if (e.key === "Enter" && v3SaveName) v3SaveName.click();
    });
  }

  renderV3Name();

  /* ═══════════ V3 NEXT MOVIE ═══════════ */
  function renderV3Next() {
    const movies = window.MCU && window.MCU.getMovies ? window.MCU.getMovies() : [];
    if (!movies.length) {
      const t = $("v3NextTitle");
      const m = $("v3NextMeta");
      if (t) t.textContent = "No movies yet";
      if (m) m.textContent = "Admin can add from the admin panel";
      return;
    }

    const watched = window.__mcuWatched || {};
    const next = movies.find(m => !watched[m.id]);
    const movie = next || movies[0];

    const poster = $("v3NextPoster");
    const title = $("v3NextTitle");
    const meta = $("v3NextMeta");
    const box = $("v3NextMovie");

    if (poster) {
      poster.src = movie.poster || "";
      poster.onerror = () => {
        poster.src = "https://placehold.co/300x450/16102a/22d3ee?text=MCU";
      };
    }
    if (title) title.textContent = movie.title || movie.id;
    if (meta) meta.textContent = (movie.phase || "MCU") + " • " + (movie.year || "TBA") + " • ⭐ " + (movie.rating || "TBA");
    if (box && window.openMovieModal) {
      box.onclick = () => window.openMovieModal(movie);
    }
  }

  document.addEventListener("movies-loaded", renderV3Next);
  document.addEventListener("tracker-updated", renderV3Next);

  /* ═══════════ DOOMSDAY COUNTDOWN ═══════════ */
  (function initDoomsdayTimer() {
    const TARGET = Date.parse("2026-12-18T00:00:00+05:30");

    function pad(n) { return String(n).padStart(2, "0"); }

    function tick() {
      const diff = Math.max(0, TARGET - Date.now());
      const total = Math.floor(diff / 1000);

      const days = Math.floor(total / 86400);
      let rest = total % 86400;
      const hours = Math.floor(rest / 3600);
      rest %= 3600;
      const minutes = Math.floor(rest / 60);
      const seconds = rest % 60;

      const d = $("doomsdayDays");
      const h = $("doomsdayHours");
      const m = $("doomsdayMinutes");
      const s = $("doomsdaySeconds");

      if (d) d.textContent = String(days).padStart(3, "0");
      if (h) h.textContent = pad(hours);
      if (m) m.textContent = pad(minutes);
      if (s) s.textContent = pad(seconds);
    }

    tick();
    setInterval(tick, 1000);
    console.log("⏱️ Doomsday countdown active");
  })();

  /* ═══════════ INIT ═══════════ */
  function init() {
    bindThemeButtons();
    loadSavedTheme();
    console.log("✅ Premium theme system initialized");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  setTimeout(bindThemeButtons, 500);
  setTimeout(loadSavedTheme, 600);

  window.applyTheme = applyTheme;
  console.log("✅ Theme module loaded");
})();