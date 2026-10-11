/* ═══════════════════════════════════════════════════════════
   MCU TRACKER — THEME SYSTEM
   Hero themes + Dark/Light toggle + Sound toggle
   ═══════════════════════════════════════════════════════════ */

(function() {
  "use strict";

  const $ = id => document.getElementById(id);

  /* ═══════════ HERO THEMES ═══════════ */
  const heroThemeData = {
    red: {
      title: "Avengers: Endgame",
      subtitle: "Marvel Red • Phase 3",
      poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg"
    },
    blue: {
      title: "Spider-Man: No Way Home",
      subtitle: "Multiverse Blue • Phase 4",
      poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg"
    },
    gold: {
      title: "Avengers: Infinity War",
      subtitle: "Infinity Gold • Phase 3",
      poster: "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg"
    },
    cosmic: {
      title: "Guardians of the Galaxy",
      subtitle: "Cosmic • Phase 2",
      poster: "https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg"
    },
    ironman: {
      title: "Iron Man",
      subtitle: "Iron Man • Phase 1",
      poster: "https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg"
    },
    gamma: {
      title: "Hulk",
      subtitle: "Gamma Green • Phase 3",
      poster: "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg"
    },
    doomsday: {
      title: "Avengers: Doomsday",
      subtitle: "Doomsday • Phase 6",
      poster: "https://images.flickdirect.com/movies/avengers-doomsday/avengers-doomsday-poster.jpg"
    }
  };

  /* ═══════════ APPLY HERO THEME ═══════════ */
  function applyHeroTheme(theme) {
    if (!heroThemeData[theme]) theme = "blue";

    // Remove all theme- classes from body
    document.body.classList.remove(
      "theme-blue", "theme-red", "theme-gold",
      "theme-cosmic", "theme-ironman",
      "theme-gamma", "theme-doomsday"
    );

    if (theme !== "blue") {
      document.body.classList.add("theme-" + theme);
    }

    try { localStorage.setItem("mcuHeroTheme", theme); } catch (e) {}

    document.querySelectorAll("[data-hero-theme]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.heroTheme === theme);
    });

    const data = heroThemeData[theme];
    const poster = $("themePoster");
    const title = $("themePosterTitle");
    const subtitle = $("themePosterSubtitle");

    if (poster) { poster.src = data.poster; poster.alt = data.title + " poster"; }
    if (title) title.textContent = data.title;
    if (subtitle) subtitle.textContent = data.subtitle;
  }

  /* ═══════════ BIND HERO THEME BUTTONS ═══════════ */
  document.querySelectorAll("[data-hero-theme]").forEach(btn => {
    btn.addEventListener("click", () => {
      applyHeroTheme(btn.dataset.heroTheme);
      if (window.showToast) window.showToast("✓ Theme: " + btn.textContent.trim(), "ok");
    });
  });

  // Load saved theme
  let savedTheme = "blue";
  try { savedTheme = localStorage.getItem("mcuHeroTheme") || "blue"; } catch (e) {}
  applyHeroTheme(savedTheme);

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

  /* ═══════════ RESET BUTTON ═══════════ */
  const resetBtn = $("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (window.resetTracker) window.resetTracker();
    });
  }

  /* ═══════════ EXPLORE BUTTON ═══════════ */
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
        poster.src = "https://placehold.co/300x450/0d1422/00e5ff?text=MCU";
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

  console.log("✅ Theme module loaded");
})();