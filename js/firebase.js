/* ═══════════════════════════════════════════════════════════
   MCU TRACKER — FIREBASE INITIALIZATION
   Single global instance — no conflicts
   ═══════════════════════════════════════════════════════════ */

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

/* ═══════════ FIREBASE CONFIG ═══════════ */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAxiho1OLRry1mU8CRm6lQirUGQCVlNDWg",
  authDomain: "marvel-mcu-tracker.firebaseapp.com",
  projectId: "marvel-mcu-tracker",
  storageBucket: "marvel-mcu-tracker.firebasestorage.app",
  messagingSenderId: "353104751639",
  appId: "1:353104751639:web:9f5e43501ead4bbedd4052",
  measurementId: "G-5DJXGHN0NV"
};

/* ═══════════ INITIALIZE (ONLY ONCE) ═══════════ */
let app, auth, db;

if (getApps().length === 0) {
  app = initializeApp(FIREBASE_CONFIG);
} else {
  app = getApps()[0];
}

auth = getAuth(app);
db = getFirestore(app);

/* ═══════════ GLOBAL EXPORTS ═══════════
   Ye variables saare modules use karenge.
   Isse duplicate Firebase instance nahi banega,
   aur login/logout sab jagah sync rahega.
*/
window.__mcuApp = app;
window.__mcuAuth = auth;
window.__mcuDb = db;

console.log("✅ Firebase initialized (single instance)");

/* ═══════════ GLOBAL HELPERS ═══════════ */

/**
 * Show a toast notification
 */
window.showToast = function(message, type = "ok") {
  const toast = document.getElementById("toast");
  if (!toast) {
    console.log("[Toast]", message);
    return;
  }
  toast.textContent = message;
  toast.classList.remove("error");
  if (type === "error") toast.classList.add("error");
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
};

/**
 * Escape HTML entities — prevents XSS
 */
window.escapeHTML = function(str) {
  return String(str ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
};

/**
 * Escape for use in HTML attributes
 */
window.escapeAttr = window.escapeHTML;

/**
 * Hide the loading screen
 */
window.hideLoader = function() {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.add("hidden");
    setTimeout(() => {
      loader.style.display = "none";
    }, 600);
  }
};

/**
 * Log admin activity to Firestore
 */
window.logActivity = async function(action, details) {
  try {
    const { addDoc, collection, serverTimestamp } = await import(
      "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js"
    );
    await addDoc(collection(db, "logs"), {
      action,
      details,
      by: auth.currentUser?.uid || "unknown",
      byEmail: auth.currentUser?.email || "unknown",
      timestamp: serverTimestamp()
    });
  } catch (e) {
    console.warn("Log activity failed:", e);
  }
};

/* ═══════════ FIREBASE STATUS PILL ═══════════ */
const statusPill = document.createElement("div");
statusPill.id = "firebaseStatus";
statusPill.style.cssText = `
  position: fixed;
  bottom: 12px;
  right: 12px;
  z-index: 10000;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(10, 12, 18, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font: 700 10px Arial, sans-serif;
  color: #fff;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  pointer-events: none;
`;
statusPill.textContent = "Firebase: connecting…";

if (document.body) {
  document.body.appendChild(statusPill);
} else {
  document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(statusPill);
  });
}

/**
 * Update the status pill
 */
window.setSyncStatus = function(text, state = "idle") {
  const el = document.getElementById("firebaseStatus");
  if (!el) return;
  el.textContent = "Firebase: " + text;
  el.style.borderColor =
    state === "ok" ? "rgba(0, 230, 118, 0.5)" :
    state === "error" ? "rgba(255, 80, 80, 0.5)" :
    "rgba(255, 255, 255, 0.12)";
};

window.setSyncStatus("connected", "ok");

/* ═══════════ READY SIGNAL ═══════════ */
window.dispatchEvent(new CustomEvent("firebase-ready"));

console.log("🔥 Firebase module ready");