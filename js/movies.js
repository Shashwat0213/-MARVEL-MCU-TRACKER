/* ═══════════════════════════════════════════════════════════
   MCU TRACKER — MOVIES
   Load from Firestore → Render grid → Filter/Sort/Search
   NO hardcoded movies. All data comes from admin panel.
   ═══════════════════════════════════════════════════════════ */

import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const db = window.__mcuDb;
if (!db) {
  console.error("❌ movies.js: Firebase not initialized");
} else {
  const $ = id => document.getElementById(id);

  /* ═══════════ STATE ═══════════ */
  let allMovies = [];
  let currentFilter = "all";
  let currentSearch = "";
  let currentSort = "timeline";

  window.__mcuMovies = allMovies;

  /* ═══════════ LOAD MOVIES FROM FIRESTORE ═══════════ */
  async function loadMoviesFromFirestore() {
    try {
      const snap = await getDocs(collection(db, "movies"));
      const movies = [];
      snap.forEach(d => {
        const data = d.data();
        // Only show published movies to normal users
        if (!data.status || data.status === "published") {
          movies.push({ id: d.id, ...data });
        }
      });
      allMovies = movies;
      window.__mcuMovies = movies;
      console.log(`✅ Loaded ${movies.length} movies from Firestore`);
      return movies;
    } catch (e) {
      console.error("Failed to load movies:", e);
      return [];
    }
  }

  /* ═══════════ FILTER + SORT + SEARCH ═══════════ */
  function getFilteredMovies() {
    let result = [...allMovies];

    // Search
    if (currentSearch) {
      const q = currentSearch.toLowerCase().trim();
      result = result.filter(m =>
        (m.title || "").toLowerCase().includes(q) ||
        (m.description || "").toLowerCase().includes(q) ||
        (m.cast || "").toLowerCase().includes(q)
      );
    }

    // Filter by type/status
    const watched = window.__mcuWatched || {};
    const favorites = window.__mcuFavorites || {};

    if (currentFilter === "movie") {
      result = result.filter(m => (m.type || "movie") === "movie");
    } else if (currentFilter === "series") {
      result = result.filter(m => m.type === "series");
    } else if (currentFilter === "watched") {
      result = result.filter(m => watched[m.id]);
    } else if (currentFilter === "unwatched") {
      result = result.filter(m => !watched[m.id]);
    } else if (currentFilter === "favorites") {
      result = result.filter(m => favorites[m.id]);
    }

    // Sort
    switch (currentSort) {
      case "title":
        result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "year":
        result.sort((a, b) => (parseInt(a.year) || 9999) - (parseInt(b.year) || 9999));
        break;
      case "rating":
        result.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
        break;
      case "timeline":
      default:
        result.sort((a, b) => {
          const sa = Number.isFinite(Number(a.timelineSlot)) ? Number(a.timelineSlot) : 9999;
          const sb = Number.isFinite(Number(b.timelineSlot)) ? Number(b.timelineSlot) : 9999;
          return sa - sb || (a.title || "").localeCompare(b.title || "");
        });
        break;
    }

    return result;
  }

  /* ═══════════ RENDER MOVIE CARDS ═══════════ */
  function renderMovies() {
    const grid = $("moviesGrid");
    const emptyState = $("emptyState");
    if (!grid) return;

    const filtered = getFilteredMovies();

    if (filtered.length === 0) {
      grid.innerHTML = `
        <li class="empty-state">
          <div class="empty-icon">🎬</div>
          <p>${allMovies.length === 0
            ? "No movies yet. Admin can add movies from the admin panel."
            : "No movies match your filter."}</p>
        </li>
      `;
      updateStats();
      return;
    }

    grid.innerHTML = "";

    filtered.forEach((movie, index) => {
      const isWatched = !!(window.__mcuWatched || {})[movie.id];
      const isFavorite = !!(window.__mcuFavorites || {})[movie.id];

      const li = document.createElement("li");
      li.className = "movie-card";
      li.dataset.movieId = movie.id;

      const posterSrc = movie.poster || "";
      const title = window.escapeHTML(movie.title || movie.id);
      const phase = window.escapeHTML(movie.phase || "MCU");
      const releaseDate = movie.releaseDate || movie.year || "TBA";
      const rating = movie.rating && movie.rating > 0
        ? `⭐ ${Number(movie.rating).toFixed(1)}`
        : "⭐ TBA";
      const typeLabel = movie.type === "series" ? "📺" : "🎬";

      li.innerHTML = `
        <div class="poster-container">
          <img class="poster" src="${window.escapeAttr(posterSrc)}" alt="${title}" loading="lazy"
               onerror="this.src='https://placehold.co/500x750/0d1422/00e5ff?text=${encodeURIComponent(movie.title || 'MCU')}'; this.onerror=null;">
          <div class="poster-overlay"></div>
          <div class="phase-badge">${phase}</div>
          <button class="favorite-btn ${isFavorite ? "active" : ""}" data-action="favorite" data-id="${window.escapeAttr(movie.id)}" title="Favorite">
            ${isFavorite ? "❤️" : "♡"}
          </button>
        </div>
        <div class="movie-info">
          <h2 class="movie-title">${title}</h2>
          <div class="movie-meta">
            <span class="meta-item">${typeLabel} ${window.escapeHTML(movie.type || "movie").toUpperCase()}</span>
            <span class="meta-item">📅 ${window.escapeHTML(String(releaseDate))}</span>
            <span class="meta-item rating">${rating}</span>
          </div>
          <div class="watch-row">
            <label class="watch-label">
              <input type="checkbox" class="watch-checkbox" data-action="watched" data-id="${window.escapeAttr(movie.id)}" ${isWatched ? "checked" : ""}>
              <span class="${isWatched ? "watched-text" : ""}">${isWatched ? "Watched" : "Mark watched"}</span>
            </label>
            <span class="fav-indicator">${isFavorite ? "❤️" : ""}</span>
          </div>
        </div>
      `;

      grid.appendChild(li);
    });

    updateStats();
  }

  /* ═══════════ CARD EVENT DELEGATION ═══════════ */
  document.addEventListener("click", e => {
    // Favorite button
    const favBtn = e.target.closest('[data-action="favorite"]');
    if (favBtn) {
      e.stopPropagation();
      const id = favBtn.dataset.id;
      window.toggleFavorite?.(id);
      return;
    }

    // Movie card click (open modal)
    const card = e.target.closest(".movie-card");
    if (card && !e.target.closest("button") && !e.target.closest("input") && !e.target.closest("label")) {
      const id = card.dataset.movieId;
      const movie = allMovies.find(m => m.id === id);
      if (movie) window.openMovieModal?.(movie);
    }
  });

  /* ═══════════ WATCHED CHECKBOX EVENT ═══════════ */
  document.addEventListener("change", e => {
    const cb = e.target.closest('[data-action="watched"]');
    if (cb) {
      const id = cb.dataset.id;
      window.toggleWatched?.(id, cb.checked);
    }
  });

  /* ═══════════ STATS UPDATE ═══════════ */
  function updateStats() {
    const watched = window.__mcuWatched || {};
    const favorites = window.__mcuFavorites || {};

    const total = allMovies.length;
    const done = allMovies.filter(m => watched[m.id]).length;
    const favs = allMovies.filter(m => favorites[m.id]).length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;

    const setText = (id, val) => {
      const el = $(id);
      if (el) {
        const prev = el.textContent;
        el.textContent = val;
        if (prev !== String(val)) {
          el.classList.add("updating");
          setTimeout(() => el.classList.remove("updating"), 400);
        }
      }
    };

    setText("statTotal", total);
    setText("statWatched", done);
    setText("statFavorites", favs);
    setText("statProgress", percent + "%");
  }

  /* ═══════════ TOOLBAR EVENT BINDINGS ═══════════ */
  const searchInput = $("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      currentSearch = e.target.value;
      renderMovies();
    });
  }

  document.querySelectorAll(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      currentFilter = chip.dataset.filter || "all";
      renderMovies();
    });
  });

  const sortSelect = $("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", e => {
      currentSort = e.target.value;
      renderMovies();
    });
  }

  /* ═══════════ MOVIE DETAILS MODAL ═══════════ */
  function openMovieModal(movie) {
    const modal = $("movieModal");
    if (!modal || !movie) return;

    const watched = window.__mcuWatched || {};
    const favorites = window.__mcuFavorites || {};

    const poster = $("modalPoster");
    const title = $("modalTitle");
    const meta = $("modalMeta");
    const desc = $("modalDescription");
    const genres = $("modalGenres");
    const cast = $("modalCast");
    const trailerBtn = $("modalTrailerBtn");
    const downloadBtn = $("modalDownloadBtn");
    const watchBtn = $("modalWatchBtn");
    const favBtn = $("modalFavoriteBtn");

    if (poster) {
      poster.src = movie.poster || "";
      poster.alt = movie.title || "";
      poster.onerror = () => {
        poster.src = `https://placehold.co/500x750/0d1422/00e5ff?text=${encodeURIComponent(movie.title || "MCU")}`;
      };
    }
    if (title) title.textContent = movie.title || movie.id;

    if (meta) {
      meta.innerHTML = "";
      const items = [
        `📅 ${movie.releaseDate || movie.year || "TBA"}`,
        `⭐ ${movie.rating && movie.rating > 0 ? Number(movie.rating).toFixed(1) : "TBA"}`,
        `⚡ ${movie.phase || "MCU"}`,
        movie.runtime ? `⏱️ ${movie.runtime} min` : null
      ].filter(Boolean);
      items.forEach(text => {
        const span = document.createElement("span");
        span.textContent = text;
        meta.appendChild(span);
      });
    }

    if (desc) {
      desc.textContent = movie.description || "No description available yet.";
    }

    if (genres) {
      genres.innerHTML = "";
      if (movie.genres) {
        movie.genres.split(",").forEach(g => {
          const tag = document.createElement("span");
          tag.className = "genre-tag";
          tag.textContent = g.trim();
          genres.appendChild(tag);
        });
      }
    }

    if (cast) {
      cast.textContent = movie.cast ? `Cast: ${movie.cast}` : "";
    }

    if (trailerBtn) {
      if (movie.trailer) {
        trailerBtn.style.display = "";
        trailerBtn.onclick = () => window.open(movie.trailer, "_blank", "noopener");
      } else {
        trailerBtn.style.display = "none";
      }
    }

    if (downloadBtn) {
      if (movie.downloadUrl) {
        downloadBtn.style.display = "";
        downloadBtn.href = movie.downloadUrl;
      } else {
        downloadBtn.style.display = "none";
      }
    }

    if (watchBtn) {
      const isWatched = !!watched[movie.id];
      watchBtn.textContent = isWatched ? "✓ Watched" : "✓ Mark Watched";
      watchBtn.onclick = () => {
        window.toggleWatched?.(movie.id, !watched[movie.id]);
        watchBtn.textContent = watched[movie.id] ? "✓ Watched" : "✓ Mark Watched";
      };
    }

    if (favBtn) {
      const isFav = !!favorites[movie.id];
      favBtn.textContent = isFav ? "❤️ Favorited" : "♡ Favorite";
      favBtn.classList.toggle("active", isFav);
      favBtn.onclick = () => {
        window.toggleFavorite?.(movie.id);
        const nowFav = !!(window.__mcuFavorites || {})[movie.id];
        favBtn.textContent = nowFav ? "❤️ Favorited" : "♡ Favorite";
        favBtn.classList.toggle("active", nowFav);
      };
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Close handlers
    const closeBtn = modal.querySelector("[data-close-modal]");
    if (closeBtn && !closeBtn._bound) {
      closeBtn._bound = true;
      closeBtn.onclick = () => closeMovieModal();
    }
    if (!modal._bound) {
      modal._bound = true;
      modal.addEventListener("click", e => {
        if (e.target === modal) closeMovieModal();
      });
    }
  }

  function closeMovieModal() {
    const modal = $("movieModal");
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  window.openMovieModal = openMovieModal;
  window.closeMovieModal = closeMovieModal;

  /* ═══════════ PUBLIC API ═══════════ */
  window.MCU = window.MCU || {};
  window.MCU.reloadMovies = async () => {
    await loadMoviesFromFirestore();
    renderMovies();
  };
  window.MCU.renderMovies = renderMovies;
  window.MCU.getMovies = () => allMovies;

  /* ═══════════ INITIAL LOAD ═══════════ */
  (async () => {
    await loadMoviesFromFirestore();
    renderMovies();
    window.hideLoader?.();
    window.dispatchEvent(new CustomEvent("movies-loaded"));
  })();

  /* ═══════════ RELOAD WHEN TRACKER STATE CHANGES ═══════════ */
  document.addEventListener("tracker-updated", () => {
    renderMovies();
  });

  /* ═══════════ RELOAD WHEN ADMIN ADDS/EDITS ═══════════ */
  document.addEventListener("movies-changed", () => {
    window.MCU.reloadMovies();
  });

  console.log("✅ Movies module loaded");
}