/* ═══════════════════════════════════════════════════════════
   MCU TRACKER — THEME SYSTEM + SOUND EFFECTS
   Full website theme + Dark/Light + Sound + Loading sound
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
    arcreactor: {
      label: "Arc Reactor",
      title: "Iron Man",
      subtitle: "Arc Reactor • Phase 1",
      poster: "https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg"
    },
    inferno: {
      label: "Inferno",
      title: "Avengers: Endgame",
      subtitle: "Inferno • Phase 3",
      poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg"
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

  /* ═══════════ SOUND SYSTEM ═══════════ */
  let soundEnabled = true;
  try { soundEnabled = localStorage.getItem("mcuSound") !== "false"; } catch (e) {}

  // Sound URLs
  const SOUNDS = {
    button: "https://actions.google.com/sounds/v1/cartoon/pop.ogg",
    theme: "https://actions.google.com/sounds/v1/science_fiction/laser_1.ogg",
    tick: "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg",
    loading: "https://actions.google.com/sounds/v1/science_fiction/robot_code_scan.ogg",
    startup: "https://actions.google.com/sounds/v1/science_fiction/computer_ready.ogg",
    favorite: "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"
  };

  function playSound(url, volume = 0.35) {
    if (!soundEnabled) return;
    try {
      const audio = new Audio(url);
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch (e) {
      console.log("Sound unavailable");
    }
  }

  window.playButtonSound = () => playSound(SOUNDS.button, 0.35);
  window.playThemeSound = () => playSound(SOUNDS.theme, 0.35);
  window.playTickSound = () => playSound(SOUNDS.tick, 0.35);
  window.playFavoriteSound = () => playSound(SOUNDS.favorite, 0.4);

  /* ═══════════ APPLY THEME ═══════════ */
  function applyTheme(themeId) {
    if (!themeData[themeId]) themeId = "cosmos";

    document.body.classList.add("theme-switching");
    setTimeout(() => document.body.classList.remove("theme-switching"), 600);

    document.body.classList.remove(
      "theme-cosmos", "theme-arcreactor", "theme-inferno",
      "theme-vibranium", "theme-bifrost", "theme-doomsday", "theme-noir"
    );

    if (themeId !== "cosmos") {
      document.body.classList.add("theme-" + themeId);
    }

    try { localStorage.setItem("mcuHeroTheme", themeId); } catch (e) {}

    document.querySelectorAll("[data-hero-theme]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.heroTheme === themeId);
    });

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
    document.querySelectorAll("[data-hero-theme]").forEach(btn => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
    });

    document.querySelectorAll("[data-hero-theme]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const theme = btn.dataset.heroTheme;
        applyTheme(theme);
        playThemeSound();

        if (window.showToast) {
          const data = themeData[theme];
          window.showToast("✓ Theme: " + (data ? data.label : theme), "ok");
        }
      });
    });
  }

  function loadSavedTheme() {
    let saved = "cosmos";
    try { saved = localStorage.getItem("mcuHeroTheme") || "cosmos"; } catch (e) {}
    applyTheme(saved);
  }

  /* ═══════════ DARK / LIGHT TOGGLE ═══════════ */
  const themeBtn = $("themeBtn");

  function applyLightMode(isLight) {
    if (isLight) {
      document.body.classList.add("light-mode");
      if (themeBtn) themeBtn.textContent = "🌙 Dark";
    } else {
      document.body.classList.remove("light-mode");
      if (themeBtn) themeBtn.textContent = "☀️ Light";
    }
  }

  function loadDarkMode() {
    let saved = null;
    try { saved = localStorage.getItem("mcuTheme"); } catch (e) {}
    applyLightMode(saved === "light");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      playButtonSound();
      const willBeLight = !document.body.classList.contains("light-mode");
      applyLightMode(willBeLight);
      try { localStorage.setItem("mcuTheme", willBeLight ? "light" : "dark"); } catch (e) {}
      if (window.showToast) window.showToast(willBeLight ? "☀️ Light mode" : "🌙 Dark mode", "ok");
    });
  }

  loadDarkMode();

  /* ═══════════ SOUND TOGGLE ═══════════ */
  const soundBtn = $("soundBtn");

  function updateSoundBtn() {
    if (soundBtn) soundBtn.textContent = soundEnabled ? "🔊 Sound" : "🔇 Sound";
  }

  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      try { localStorage.setItem("mcuSound", soundEnabled); } catch (e) {}
      updateSoundBtn();
      if (soundEnabled) playButtonSound();
      if (window.showToast) window.showToast(soundEnabled ? "🔊 Sound on" : "🔇 Sound off", "ok");
    });
  }

  updateSoundBtn();

  /* ═══════════ RESET BUTTON ═══════════ */
  const resetBtn = $("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      playButtonSound();
      if (window.resetTracker) window.resetTracker();
    });
  }

  /* ═══════════ EXPLORE BUTTON ═══════════ */
  const heroExploreBtn = $("heroExploreBtn");
  if (heroExploreBtn) {
    heroExploreBtn.addEventListener("click", () => {
      playButtonSound();
      const movieList = $("movieList");
      if (movieList) movieList.scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ═══════════ V3 NAME ═══════════ */
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
      playButtonSound();
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
      box.onclick = () => {
        playButtonSound();
        window.openMovieModal(movie);
      };
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
  })();

  /* ═══════════ INIT ═══════════ */
  function init() {
    bindThemeButtons();
    loadSavedTheme();

    // Play startup sound once (only if sound enabled)
    setTimeout(() => {
      if (soundEnabled) playSound(SOUNDS.startup, 0.2);
    }, 2000);

    console.log("✅ Theme + Sound system initialized");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  setTimeout(bindThemeButtons, 500);
  setTimeout(loadSavedTheme, 600);

  window.applyTheme = applyTheme;
})();