/* ═══════════════════════════════════════════════════════════
   MCU TRACKER — MOVIES
   Loads from Firestore. Auto-seeds 51 default movies if empty.
   Admin can edit/delete from admin panel.
   ═══════════════════════════════════════════════════════════ */

import {
  collection,
  getDocs,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const db = window.__mcuDb;

if (!db) {
  console.error("❌ movies.js: Firebase not initialized");
} else {
  const $ = id => document.getElementById(id);

  /* ═══════════ DEFAULT MOVIES (51) — Seed Data ═══════════ */
  const DEFAULT_MOVIES = [
    {
      id: "mcu-captain-america-the-first-avenger",
      timelineSlot: 1,
      title: "Captain America: The First Avenger",
      year: 2011,
      releaseDate: "2011-07-22",
      rating: 7.0,
      phase: "Phase 1 • Infinity Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg",
      status: "published"
    },
    {
      id: "mcu-captain-marvel",
      timelineSlot: 2,
      title: "Captain Marvel",
      year: 2019,
      releaseDate: "2019-03-08",
      rating: 7.0,
      phase: "Phase 3 • Infinity Saga",
      type: "movie",
      importance: "Important",
      poster: "https://image.tmdb.org/t/p/w500/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg",
      status: "published"
    },
    {
      id: "mcu-iron-man",
      timelineSlot: 3,
      title: "Iron Man",
      year: 2008,
      releaseDate: "2008-05-02",
      rating: 7.9,
      phase: "Phase 1 • Infinity Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg",
      status: "published"
    },
    {
      id: "mcu-iron-man-2",
      timelineSlot: 4,
      title: "Iron Man 2",
      year: 2010,
      releaseDate: "2010-05-07",
      rating: 6.9,
      phase: "Phase 1 • Infinity Saga",
      type: "movie",
      importance: "Important",
      poster: "https://image.tmdb.org/t/p/w500/6WBeq4fCfn7AN0o21W9qNcRF2l9.jpg",
      status: "published"
    },
    {
      id: "mcu-the-incredible-hulk",
      timelineSlot: 5,
      title: "The Incredible Hulk",
      year: 2008,
      releaseDate: "2008-06-13",
      rating: 6.6,
      phase: "Phase 1 • Infinity Saga",
      type: "movie",
      importance: "Optional",
      poster: "https://image.tmdb.org/t/p/w500/gKzYx79y0AQTL4UAk1cBQJ3nvrm.jpg",
      status: "published"
    },
    {
      id: "mcu-thor",
      timelineSlot: 6,
      title: "Thor",
      year: 2011,
      releaseDate: "2011-05-06",
      rating: 7.0,
      phase: "Phase 1 • Infinity Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg",
      status: "published"
    },
    {
      id: "mcu-the-avengers",
      timelineSlot: 7,
      title: "The Avengers",
      year: 2012,
      releaseDate: "2012-05-04",
      rating: 8.0,
      phase: "Phase 1 • Infinity Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
      status: "published"
    },
    {
      id: "mcu-iron-man-3",
      timelineSlot: 8,
      title: "Iron Man 3",
      year: 2013,
      releaseDate: "2013-05-03",
      rating: 7.1,
      phase: "Phase 2 • Infinity Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/qhPtAc1TKbMPqNvcdXSOn9Bn7hZ.jpg",
      status: "published"
    },
    {
      id: "mcu-thor-the-dark-world",
      timelineSlot: 9,
      title: "Thor: The Dark World",
      year: 2013,
      releaseDate: "2013-11-08",
      rating: 6.7,
      phase: "Phase 2 • Infinity Saga",
      type: "movie",
      importance: "Important",
      poster: "https://image.tmdb.org/t/p/w500/wp6OxE4poJ4G7c0U2ZIXasTSMR7.jpg",
      status: "published"
    },
    {
      id: "mcu-captain-america-the-winter-soldier",
      timelineSlot: 10,
      title: "Captain America: The Winter Soldier",
      year: 2014,
      releaseDate: "2014-04-04",
      rating: 7.7,
      phase: "Phase 2 • Infinity Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/tVFRpFw3xTedgPGqxW0AOI8Qhh0.jpg",
      status: "published"
    },
    {
      id: "mcu-guardians-of-the-galaxy",
      timelineSlot: 11,
      title: "Guardians of the Galaxy",
      year: 2014,
      releaseDate: "2014-08-01",
      rating: 8.0,
      phase: "Phase 2 • Infinity Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg",
      status: "published"
    },
    {
      id: "mcu-guardians-of-the-galaxy-vol-2",
      timelineSlot: 12,
      title: "Guardians of the Galaxy Vol. 2",
      year: 2017,
      releaseDate: "2017-05-05",
      rating: 7.6,
      phase: "Phase 3 • Infinity Saga",
      type: "movie",
      importance: "Important",
      poster: "https://image.tmdb.org/t/p/w500/y4MBh0EjBlMuOzv9axM4qJlmhzz.jpg",
      status: "published"
    },
    {
      id: "mcu-avengers-age-of-ultron",
      timelineSlot: 13,
      title: "Avengers: Age of Ultron",
      year: 2015,
      releaseDate: "2015-05-01",
      rating: 7.3,
      phase: "Phase 2 • Infinity Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/4ssDuvEDkSArWEdyBl2X5EHvYKU.jpg",
      status: "published"
    },
    {
      id: "mcu-ant-man",
      timelineSlot: 14,
      title: "Ant-Man",
      year: 2015,
      releaseDate: "2015-07-17",
      rating: 7.2,
      phase: "Phase 2 • Infinity Saga",
      type: "movie",
      importance: "Important",
      poster: "https://image.tmdb.org/t/p/w500/D6e8RJf2qUstnfkTslTXNTUAlT.jpg",
      status: "published"
    },
    {
      id: "mcu-captain-america-civil-war",
      timelineSlot: 15,
      title: "Captain America: Civil War",
      year: 2016,
      releaseDate: "2016-05-06",
      rating: 7.8,
      phase: "Phase 3 • Infinity Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/rAGiXaUfPzY7CDEyNKUofk3Kw2e.jpg",
      status: "published"
    },
    {
      id: "mcu-black-widow",
      timelineSlot: 16,
      title: "Black Widow",
      year: 2021,
      releaseDate: "2021-07-09",
      rating: 6.6,
      phase: "Phase 4 • Multiverse Saga",
      type: "movie",
      importance: "Important",
      poster: "https://image.tmdb.org/t/p/w500/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg",
      status: "published"
    },
    {
      id: "mcu-black-panther",
      timelineSlot: 17,
      title: "Black Panther",
      year: 2018,
      releaseDate: "2018-02-16",
      rating: 7.3,
      phase: "Phase 3 • Infinity Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
      status: "published"
    },
    {
      id: "mcu-spider-man-homecoming",
      timelineSlot: 18,
      title: "Spider-Man: Homecoming",
      year: 2017,
      releaseDate: "2017-07-07",
      rating: 7.4,
      phase: "Phase 3 • Infinity Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg",
      status: "published"
    },
    {
      id: "mcu-doctor-strange",
      timelineSlot: 19,
      title: "Doctor Strange",
      year: 2016,
      releaseDate: "2016-11-04",
      rating: 7.5,
      phase: "Phase 3 • Infinity Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg",
      status: "published"
    },
    {
      id: "mcu-thor-ragnarok",
      timelineSlot: 20,
      title: "Thor: Ragnarok",
      year: 2017,
      releaseDate: "2017-11-03",
      rating: 7.9,
      phase: "Phase 3 • Infinity Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg",
      status: "published"
    },
    {
      id: "mcu-ant-man-and-the-wasp",
      timelineSlot: 21,
      title: "Ant-Man and the Wasp",
      year: 2018,
      releaseDate: "2018-07-06",
      rating: 7.0,
      phase: "Phase 3 • Infinity Saga",
      type: "movie",
      importance: "Important",
      poster: "https://image.tmdb.org/t/p/w500/eivQmS3wqzqnQWILHLc4FsEfcXP.jpg",
      status: "published"
    },
    {
      id: "mcu-avengers-infinity-war",
      timelineSlot: 22,
      title: "Avengers: Infinity War",
      year: 2018,
      releaseDate: "2018-04-27",
      rating: 8.4,
      phase: "Phase 3 • Infinity Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
      status: "published"
    },
    {
      id: "mcu-avengers-endgame",
      timelineSlot: 23,
      title: "Avengers: Endgame",
      year: 2019,
      releaseDate: "2019-04-26",
      rating: 8.4,
      phase: "Phase 3 • Infinity Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
      status: "published"
    },
    {
      id: "mcu-wandavision",
      timelineSlot: 24,
      title: "WandaVision",
      year: 2021,
      releaseDate: "2021-01-15",
      rating: 7.9,
      phase: "Phase 4 • Multiverse Saga",
      type: "series",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/glKDfE6btIRcVB5zrjspRIs4r52.jpg",
      status: "published"
    },
    {
      id: "mcu-the-falcon-and-the-winter-soldier",
      timelineSlot: 25,
      title: "The Falcon and the Winter Soldier",
      year: 2021,
      releaseDate: "2021-03-19",
      rating: 7.1,
      phase: "Phase 4 • Multiverse Saga",
      type: "series",
      importance: "Important",
      poster: "https://image.tmdb.org/t/p/w500/6kbAMLteGO8yyewYau6bJ683sw7.jpg",
      status: "published"
    },
    {
      id: "mcu-loki-season-1",
      timelineSlot: 26,
      title: "Loki — Season 1",
      year: 2021,
      releaseDate: "2021-06-09",
      rating: 8.2,
      phase: "Phase 4 • Multiverse Saga",
      type: "series",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/voHUmluYmKyleFkTu3lOXQG702u.jpg",
      status: "published"
    },
    {
      id: "mcu-spider-man-far-from-home",
      timelineSlot: 27,
      title: "Spider-Man: Far From Home",
      year: 2019,
      releaseDate: "2019-07-02",
      rating: 7.4,
      phase: "Phase 3 • Infinity Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/4q2NNj4S5dG2RLF9CpXsej7yXl.jpg",
      status: "published"
    },
    {
      id: "mcu-shang-chi-and-the-legend-of-the-ten-rings",
      timelineSlot: 28,
      title: "Shang-Chi and the Legend of the Ten Rings",
      year: 2021,
      releaseDate: "2021-09-03",
      rating: 7.3,
      phase: "Phase 4 • Multiverse Saga",
      type: "movie",
      importance: "Important",
      poster: "https://image.tmdb.org/t/p/w500/1BIoJGKbXjdFDAqUEiA2VHqkK1Z.jpg",
      status: "published"
    },
    {
      id: "mcu-eternals",
      timelineSlot: 29,
      title: "Eternals",
      year: 2021,
      releaseDate: "2021-11-05",
      rating: 6.3,
      phase: "Phase 4 • Multiverse Saga",
      type: "movie",
      importance: "Optional",
      poster: "https://image.tmdb.org/t/p/w500/lFByFSLV5WDJEv3KabbdMTYnbeB.jpg",
      status: "published"
    },
    {
      id: "mcu-spider-man-no-way-home",
      timelineSlot: 30,
      title: "Spider-Man: No Way Home",
      year: 2021,
      releaseDate: "2021-12-17",
      rating: 8.2,
      phase: "Phase 4 • Multiverse Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
      status: "published"
    },
    {
      id: "mcu-doctor-strange-in-the-multiverse-of-madness",
      timelineSlot: 31,
      title: "Doctor Strange in the Multiverse of Madness",
      year: 2022,
      releaseDate: "2022-05-06",
      rating: 6.9,
      phase: "Phase 4 • Multiverse Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/wf8v8BDSqB3wXWLisQVtbbKnaRo.jpg",
      status: "published"
    },
    {
      id: "mcu-hawkeye",
      timelineSlot: 32,
      title: "Hawkeye",
      year: 2021,
      releaseDate: "2021-11-24",
      rating: 7.5,
      phase: "Phase 4 • Multiverse Saga",
      type: "series",
      importance: "Optional",
      poster: "https://image.tmdb.org/t/p/w500/6Yow4HkWWLWDvHkbFYCVmMdzXcR.jpg",
      status: "published"
    },
    {
      id: "mcu-moon-knight",
      timelineSlot: 33,
      title: "Moon Knight",
      year: 2022,
      releaseDate: "2022-03-30",
      rating: 7.3,
      phase: "Phase 4 • Multiverse Saga",
      type: "series",
      importance: "Optional",
      poster: "https://image.tmdb.org/t/p/w500/x6FsYvt33846IQn3kHf9qd8VjwT.jpg",
      status: "published"
    },
    {
      id: "mcu-ms-marvel",
      timelineSlot: 34,
      title: "Ms. Marvel",
      year: 2022,
      releaseDate: "2022-06-08",
      rating: 6.2,
      phase: "Phase 4 • Multiverse Saga",
      type: "series",
      importance: "Important",
      poster: "https://image.tmdb.org/t/p/w500/3r7mZ7x6U4k7QoLtK9zNy0ZyI3N.jpg",
      status: "published"
    },
    {
      id: "mcu-thor-love-and-thunder",
      timelineSlot: 35,
      title: "Thor: Love and Thunder",
      year: 2022,
      releaseDate: "2022-07-08",
      rating: 6.2,
      phase: "Phase 4 • Multiverse Saga",
      type: "movie",
      importance: "Important",
      poster: "https://image.tmdb.org/t/p/w500/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg",
      status: "published"
    },
    {
      id: "mcu-black-panther-wakanda-forever",
      timelineSlot: 36,
      title: "Black Panther: Wakanda Forever",
      year: 2022,
      releaseDate: "2022-11-11",
      rating: 6.6,
      phase: "Phase 4 • Multiverse Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
      status: "published"
    },
    {
      id: "mcu-werewolf-by-night",
      timelineSlot: 37,
      title: "Werewolf by Night",
      year: 2022,
      releaseDate: "2022-10-07",
      rating: 6.9,
      phase: "Phase 4 • Multiverse Saga",
      type: "special",
      importance: "Optional",
      poster: "https://image.tmdb.org/t/p/w500/7O4sm7pNlXcyW6ybguxWtTfQ3aR.jpg",
      status: "published"
    },
    {
      id: "mcu-the-guardians-of-the-galaxy-holiday-special",
      timelineSlot: 38,
      title: "The Guardians of the Galaxy Holiday Special",
      year: 2022,
      releaseDate: "2022-11-25",
      rating: 6.9,
      phase: "Phase 4 • Multiverse Saga",
      type: "special",
      importance: "Important",
      poster: "https://image.tmdb.org/t/p/w500/8dqXyslZ2hv49Oiob9UjlGSHSTR.jpg",
      status: "published"
    },
    {
      id: "mcu-ant-man-and-the-wasp-quantumania",
      timelineSlot: 39,
      title: "Ant-Man and the Wasp: Quantumania",
      year: 2023,
      releaseDate: "2023-02-17",
      rating: 6.0,
      phase: "Phase 5 • Multiverse Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/qnqGbB22YJ7dSs4o6M7exTpNxPz.jpg",
      status: "published"
    },
    {
      id: "mcu-guardians-of-the-galaxy-vol-3",
      timelineSlot: 40,
      title: "Guardians of the Galaxy Vol. 3",
      year: 2023,
      releaseDate: "2023-05-05",
      rating: 7.9,
      phase: "Phase 5 • Multiverse Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
      status: "published"
    },
    {
      id: "mcu-secret-invasion",
      timelineSlot: 41,
      title: "Secret Invasion",
      year: 2023,
      releaseDate: "2023-06-21",
      rating: 5.9,
      phase: "Phase 5 • Multiverse Saga",
      type: "series",
      importance: "Important",
      poster: "https://image.tmdb.org/t/p/w500/f5a5H2F7XwLbP1Mwq3y2qBQlQZa.jpg",
      status: "published"
    },
    {
      id: "mcu-loki-season-2",
      timelineSlot: 42,
      title: "Loki — Season 2",
      year: 2023,
      releaseDate: "2023-10-05",
      rating: 8.2,
      phase: "Phase 5 • Multiverse Saga",
      type: "series",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/tGdaskDMBdGonOnuvkrAP9sd0mt.jpg",
      status: "published"
    },
    {
      id: "mcu-the-marvels",
      timelineSlot: 43,
      title: "The Marvels",
      year: 2023,
      releaseDate: "2023-11-10",
      rating: 5.5,
      phase: "Phase 5 • Multiverse Saga",
      type: "movie",
      importance: "Important",
      poster: "https://image.tmdb.org/t/p/w500/9GBhzXMFjgcZ3FdR9w3bUMMTps5.jpg",
      status: "published"
    },
    {
      id: "mcu-deadpool-wolverine",
      timelineSlot: 44,
      title: "Deadpool & Wolverine",
      year: 2024,
      releaseDate: "2024-07-26",
      rating: 7.6,
      phase: "Phase 5 • Multiverse Saga",
      type: "movie",
      importance: "Important",
      poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
      status: "published"
    },
    {
      id: "mcu-agatha-all-along",
      timelineSlot: 45,
      title: "Agatha All Along",
      year: 2024,
      releaseDate: "2024-09-18",
      rating: 7.2,
      phase: "Phase 5 • Multiverse Saga",
      type: "series",
      importance: "Important",
      poster: "https://image.tmdb.org/t/p/w500/9QWJ4Y5xNnbTBW4iPUiERJvK4Lz.jpg",
      status: "published"
    },
    {
      id: "mcu-captain-america-brave-new-world",
      timelineSlot: 46,
      title: "Captain America: Brave New World",
      year: 2025,
      releaseDate: "2025-02-14",
      rating: 5.7,
      phase: "Phase 5 • Multiverse Saga",
      type: "movie",
      importance: "Important",
      poster: "https://image.tmdb.org/t/p/w500/pzIddUEMWhWzfvLI3TwxUG2wGoi.jpg",
      status: "published"
    },
    {
      id: "mcu-daredevil-born-again",
      timelineSlot: 47,
      title: "Daredevil: Born Again",
      year: 2025,
      releaseDate: "2025-03-04",
      rating: 7.8,
      phase: "Phase 5 • Multiverse Saga",
      type: "series",
      importance: "Important",
      poster: "https://image.tmdb.org/t/p/w500/xUuHj3CgmZQ9P2cMaqQs4J0d4Zc.jpg",
      status: "published"
    },
    {
      id: "mcu-thunderbolts",
      timelineSlot: 48,
      title: "Thunderbolts*",
      year: 2025,
      releaseDate: "2025-05-02",
      rating: 7.2,
      phase: "Phase 5 • Multiverse Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/m9EtP1Yrzv6v7dMaC9mRaGhd1um.jpg",
      status: "published"
    },
    {
      id: "mcu-ironheart",
      timelineSlot: 49,
      title: "Ironheart",
      year: 2025,
      releaseDate: "2025-06-24",
      rating: 5.8,
      phase: "Phase 5 • Multiverse Saga",
      type: "series",
      importance: "Optional",
      poster: "https://image.tmdb.org/t/p/w500/tVFRpFw3xTedgPGqxW0AOI8Qhh0.jpg",
      status: "published"
    },
    {
      id: "mcu-the-fantastic-four-first-steps",
      timelineSlot: 50,
      title: "The Fantastic Four: First Steps",
      year: 2025,
      releaseDate: "2025-07-25",
      rating: 7.3,
      phase: "Phase 6 • Multiverse Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/nf5qaSEvyYSNeFH0YhSs5EsBLX9.jpg",
      status: "published"
    },
    {
      id: "mcu-spider-man-brand-new-day",
      timelineSlot: 51,
      title: "Spider-Man: Brand New Day",
      year: 2026,
      releaseDate: "2026-07-31",
      rating: null,
      phase: "Phase 6 • Multiverse Saga",
      type: "movie",
      importance: "Must Watch",
      poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
      status: "published"
    }
  ];

  /* ═══════════ STATE ═══════════ */
  let allMovies = [];
  let currentFilter = "all";
  let currentSearch = "";
  let currentSort = "default";
  let isSeeding = false;

  /* ═══════════ AUTO-SEED (agar Firestore khali hai) ═══════════ */
  async function seedIfEmpty() {
    if (isSeeding) return;
    try {
      const snap = await getDocs(collection(db, "movies"));
      if (snap.size > 0) {
        console.log(`ℹ Firestore already has ${snap.size} movies — skipping seed`);
        return;
      }

      isSeeding = true;
      console.log(`🌱 Seeding ${DEFAULT_MOVIES.length} default movies to Firestore…`);

      for (const movie of DEFAULT_MOVIES) {
        try {
          const { id, ...rest } = movie;
          await setDoc(doc(db, "movies", id), {
            ...rest,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          }, { merge: true });
        } catch (e) {
          console.warn("Seed failed for:", movie.id, e);
        }
      }

      console.log(`✅ Seeded ${DEFAULT_MOVIES.length} movies`);
      window.showToast(`✓ ${DEFAULT_MOVIES.length} movies loaded`);
    } catch (e) {
      console.error("Seed error:", e);
    } finally {
      isSeeding = false;
    }
  }

  /* ═══════════ LOAD FROM FIRESTORE ═══════════ */
  async function loadMoviesFromFirestore() {
    try {
      const snap = await getDocs(collection(db, "movies"));
      const movies = [];
      snap.forEach(d => {
        const data = d.data();
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

    if (currentSearch) {
      const q = currentSearch.toLowerCase().trim();
      result = result.filter(m =>
        (m.title || "").toLowerCase().includes(q) ||
        (m.description || "").toLowerCase().includes(q) ||
        (m.cast || "").toLowerCase().includes(q)
      );
    }

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
      case "phase":
        result.sort((a, b) => (a.phase || "").localeCompare(b.phase || ""));
        break;
      case "default":
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

  /* ═══════════ RENDER ═══════════ */
  function renderMovies() {
    const movieList = $("movieList");
    if (!movieList) return;

    const filtered = getFilteredMovies();

    if (filtered.length === 0) {
      movieList.innerHTML = `
        <li class="empty-state">
          <div class="empty-icon">🎬</div>
          <p>${allMovies.length === 0
            ? "No movies yet. Admin can add from the admin panel."
            : "No movies match your filter."}</p>
        </li>
      `;
      updateStats();
      return;
    }

    movieList.innerHTML = "";

    filtered.forEach(movie => {
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
      const typeLabel = movie.type === "series" ? "📺 WEB SERIES" : "🎬 MOVIE";
      const importanceText = movie.importance ? ` • ${window.escapeHTML(movie.importance).toUpperCase()}` : "";

      li.innerHTML = `
        <div class="poster-container">
          <img class="poster" src="${window.escapeAttr(posterSrc)}" alt="${title}" loading="lazy"
               onerror="this.onerror=null; this.src='https://placehold.co/500x750/0d1422/00e5ff?text=${encodeURIComponent(movie.title || 'MCU')}';">
          <div class="poster-overlay"></div>
          <div class="phase-badge">${phase}</div>
          <button class="favorite-btn ${isFavorite ? "active" : ""}" data-action="favorite" data-id="${window.escapeAttr(movie.id)}" title="Favorite">
            ${isFavorite ? "❤️" : "♡"}
          </button>
        </div>
        <div class="movie-info">
          <h2 class="movie-title" ${isWatched ? 'style="text-decoration:line-through;opacity:0.6"' : ""}>${title}</h2>
          <span class="movie-type-badge">${typeLabel}${importanceText}</span>
          <div class="movie-meta">
            <span class="meta-item">📅 ${window.escapeHTML(String(releaseDate))}</span>
            <span class="meta-item rating">${rating}</span>
            <span class="meta-item">⚡ ${phase}</span>
            ${movie.timelineSlot ? `<span class="meta-item">🎬 Slot ${window.escapeHTML(String(movie.timelineSlot))}</span>` : ""}
          </div>
          <div class="watch-row">
            <label class="watch-label">
              <input type="checkbox" class="watch-checkbox" data-action="watched" data-id="${window.escapeAttr(movie.id)}" ${isWatched ? "checked" : ""}>
              <span class="${isWatched ? "watched-text" : ""}">${isWatched ? "Watched" : "Mark as watched"}</span>
            </label>
            <span class="fav-indicator">${isFavorite ? "❤️" : "♡"}</span>
          </div>
        </div>
      `;

      movieList.appendChild(li);
    });

    updateStats();
  }

  /* ═══════════ CLICK HANDLERS ═══════════ */
  document.addEventListener("click", e => {
    const favBtn = e.target.closest('[data-action="favorite"]');
    if (favBtn) {
      e.stopPropagation();
      const id = favBtn.dataset.id;
      if (window.toggleFavorite) window.toggleFavorite(id);
      return;
    }

    const card = e.target.closest(".movie-card");
    if (card && !e.target.closest("button") && !e.target.closest("input") && !e.target.closest("label")) {
      const id = card.dataset.movieId;
      const movie = allMovies.find(m => m.id === id);
      if (movie && window.openMovieModal) window.openMovieModal(movie);
    }
  });

  document.addEventListener("change", e => {
    const cb = e.target.closest('[data-action="watched"]');
    if (cb) {
      const id = cb.dataset.id;
      if (window.toggleWatched) window.toggleWatched(id, cb.checked);
    }
  });

  /* ═══════════ STATS ═══════════ */
  function updateStats() {
    const watched = window.__mcuWatched || {};
    const favorites = window.__mcuFavorites || {};

    const total = allMovies.length;
    const done = allMovies.filter(m => watched[m.id]).length;
    const favs = allMovies.filter(m => favorites[m.id]).length;
    const remaining = total - done;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;

    const setText = (id, val) => {
      const el = $(id);
      if (el) el.textContent = val;
    };

    setText("totalMovies", total);
    setText("watchedMovies", done);
    setText("remainingMovies", remaining);
    setText("favoriteMovies", favs);

    const progressBar = $("progressBar");
    const progressText = $("progressText");
    if (progressBar) progressBar.style.width = percent + "%";
    if (progressText) progressText.textContent = `${done}/${total} (${percent}%)`;

    // V3
    setText("v3Watched", done);
    setText("v3Favs", favs);
    setText("v3Remaining", remaining);
    setText("v3ProgressText", percent + "%");
    const v3ProgressFill = $("v3ProgressFill");
    if (v3ProgressFill) v3ProgressFill.style.width = percent + "%";
  }

  /* ═══════════ TOOLBAR ═══════════ */
  const searchInput = $("search");
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      currentSearch = e.target.value;
      renderMovies();
    });
  }

  document.querySelectorAll(".filter-btn").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(c => c.classList.remove("active"));
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

  /* ═══════════ MOVIE MODAL ═══════════ */
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
        poster.src = "https://placehold.co/500x750/0d1422/00e5ff?text=" + encodeURIComponent(movie.title || "MCU");
      };
    }
    if (title) title.textContent = movie.title || movie.id;

    if (meta) {
      meta.innerHTML = "";
      const items = [
        "📅 " + (movie.releaseDate || movie.year || "TBA"),
        "⭐ " + (movie.rating && movie.rating > 0 ? Number(movie.rating).toFixed(1) : "TBA"),
        "⚡ " + (movie.phase || "MCU"),
        movie.runtime ? "⏱️ " + movie.runtime + " min" : null
      ].filter(Boolean);
      items.forEach(text => {
        const span = document.createElement("span");
        span.textContent = text;
        meta.appendChild(span);
      });
    }

    if (desc) desc.textContent = movie.description || "Movie details are not available yet.";
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
    if (cast) cast.textContent = movie.cast ? "Cast: " + movie.cast : "";

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
        if (window.toggleWatched) window.toggleWatched(movie.id, !watched[movie.id]);
        watchBtn.textContent = watched[movie.id] ? "✓ Watched" : "✓ Mark Watched";
      };
    }
    if (favBtn) {
      const isFav = !!favorites[movie.id];
      favBtn.textContent = isFav ? "❤️ Favorited" : "♡ Favorite";
      favBtn.classList.toggle("active", isFav);
      favBtn.onclick = () => {
        if (window.toggleFavorite) window.toggleFavorite(movie.id);
        const nowFav = !!(window.__mcuFavorites || {})[movie.id];
        favBtn.textContent = nowFav ? "❤️ Favorited" : "♡ Favorite";
        favBtn.classList.toggle("active", nowFav);
      };
    }

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeMovieModal() {
    const modal = $("movieModal");
    if (!modal) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  window.openMovieModal = openMovieModal;
  window.closeMovieModal = closeMovieModal;

  const movieModal = $("movieModal");
  if (movieModal) {
    const closeBtn = $("movieModalClose");
    if (closeBtn) closeBtn.addEventListener("click", closeMovieModal);
    movieModal.addEventListener("click", e => {
      if (e.target === movieModal) closeMovieModal();
    });
  }

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && movieModal && movieModal.classList.contains("active")) {
      closeMovieModal();
    }
  });

  /* ═══════════ PUBLIC API ═══════════ */
  window.MCU = window.MCU || {};
  window.MCU.reloadMovies = async () => {
    await loadMoviesFromFirestore();
    renderMovies();
  };
  window.MCU.renderMovies = renderMovies;
  window.MCU.getMovies = () => allMovies;

  /* ═══════════ INIT — Seed then load ═══════════ */
  (async () => {
    await seedIfEmpty();
    await loadMoviesFromFirestore();
    renderMovies();
    document.dispatchEvent(new CustomEvent("movies-loaded"));
  })();

  document.addEventListener("tracker-updated", renderMovies);
  document.addEventListener("movies-changed", () => window.MCU.reloadMovies());

  console.log("✅ Movies module loaded");
}