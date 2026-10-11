/* ═══════════════════════════════════════════════════════════
   MCU TRACKER — AUTHENTICATION
   Email/Password + Google Sign-in + Profile sync
   ═══════════════════════════════════════════════════════════ */

import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const auth = window.__mcuAuth;
const db = window.__mcuDb;

if (!auth || !db) {
  console.error("❌ auth.js: Firebase not initialized");
} else {
  /* ═══════════ ELEMENT REFS ═══════════ */
  const $ = id => document.getElementById(id);

  const authModal = $("authModal");
  const loginBtn = $("loginBtn");
  const authArea = $("authArea");
  const authForm = $("authForm");
  const authName = $("authName");
  const authEmail = $("authEmail");
  const authPassword = $("authPassword");
  const authNameField = $("nameField");
  const authMessage = $("authMessage");
  const authSubmitBtn = $("authSubmitBtn");
  const authTitle = $("authTitle");
  const authSubtitle = $("authSubtitle");
  const googleLoginBtn = $("googleLoginBtn");

  let currentUser = null;

  /* ═══════════ MODAL CONTROLS ═══════════ */
  function openAuthModal() {
    if (!authModal) return;
    authModal.classList.add("open");
    authModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setAuthMode("login");
    setTimeout(() => authEmail?.focus(), 250);
  }

  function closeAuthModal() {
    if (!authModal) return;
    authModal.classList.remove("open");
    authModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (authMessage) authMessage.textContent = "";
    if (authForm) authForm.reset();
  }

  function setAuthMode(mode) {
    document.querySelectorAll(".auth-tab").forEach(tab => {
      tab.classList.toggle("active", tab.dataset.authTab === mode);
    });
    const isSignup = mode === "signup";
    if (authNameField) authNameField.style.display = isSignup ? "flex" : "none";
    if (authName) authName.required = isSignup;
    if (authTitle) authTitle.textContent = isSignup ? "Create Account" : "Welcome Back";
    if (authSubtitle) authSubtitle.textContent = isSignup
      ? "Create a new MCU Tracker account"
      : "Sign in to sync your progress";
    if (authSubmitBtn) authSubmitBtn.textContent = isSignup ? "Create Account" : "Login";
    if (authMessage) authMessage.textContent = "";
  }

  function showAuthMessage(msg, ok = false) {
    if (!authMessage) return;
    authMessage.textContent = msg;
    authMessage.classList.toggle("success", ok);
  }

  /* ═══════════ PROFILE MANAGEMENT ═══════════ */
  async function saveUserProfile(user) {
    if (!user) return;
    try {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        // New user
        await setDoc(ref, {
          uid: user.uid,
          email: user.email || "",
          displayName: user.displayName || (user.email || "").split("@")[0] || "User",
          photoURL: user.photoURL || "",
          role: "user",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        // Existing user — update profile only (never overwrite role)
        await setDoc(ref, {
          email: user.email || snap.data().email || "",
          displayName: user.displayName || snap.data().displayName || "",
          photoURL: user.photoURL || snap.data().photoURL || "",
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    } catch (e) {
      console.warn("Could not save user profile:", e);
    }
  }

  async function getUserRole(user) {
    if (!user) return "user";
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      return snap.exists() && snap.data().role === "admin" ? "admin" : "user";
    } catch (e) {
      return "user";
    }
  }

  /* ═══════════ UI UPDATE ═══════════ */
  async function updateAuthUI(user) {
    currentUser = user;
    window.__mcuUser = user;

    if (!authArea) return;

    if (user) {
      const role = await getUserRole(user);
      window.__mcuUserRole = role;

      const name = user.displayName || user.email?.split("@")[0] || "User";
      const initial = name.trim().charAt(0).toUpperCase() || "U";

      authArea.innerHTML = `
        <div class="user-chip">
          <div class="user-avatar">
            ${user.photoURL
              ? `<img src="${user.photoURL}" alt="${window.escapeHTML(name)}">`
              : window.escapeHTML(initial)}
          </div>
          <span class="user-name">${window.escapeHTML(name)}</span>
          ${role === "admin" ? `<button class="icon-btn-mini" id="openAdminBtn" title="Admin Panel">🛡️</button>` : ""}
          <button class="icon-btn-mini" id="logoutBtn" title="Logout">🚪</button>
        </div>
      `;

      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) logoutBtn.onclick = handleLogout;

      const openAdminBtn = document.getElementById("openAdminBtn");
      if (openAdminBtn) {
        openAdminBtn.onclick = () => {
          const panel = document.getElementById("adminPanel");
          if (panel) {
            panel.classList.add("open");
            panel.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
            window.dispatchEvent(new CustomEvent("admin-open"));
          }
        };
      }
    } else {
      window.__mcuUserRole = null;
      authArea.innerHTML = `<button class="btn btn-primary" id="loginBtn">👤 Login</button>`;
      const newLoginBtn = document.getElementById("loginBtn");
      if (newLoginBtn) newLoginBtn.onclick = openAuthModal;
    }
  }

  /* ═══════════ EMAIL/PASSWORD SUBMIT ═══════════ */
  async function handleAuthSubmit(e) {
    e.preventDefault();
    if (!authForm) return;

    const mode = document.querySelector(".auth-tab.active")?.dataset.authTab || "login";
    const email = authEmail.value.trim();
    const password = authPassword.value;
    const name = authName?.value.trim() || "";

    if (!email || !password) return;

    authSubmitBtn.disabled = true;
    authSubmitBtn.textContent = "Please wait…";
    showAuthMessage("");

    try {
      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);

        if (name) {
          try {
            await updateProfile(cred.user, { displayName: name });
          } catch (e) {
            console.warn("Could not set display name:", e);
          }
        }

        await saveUserProfile(cred.user);
        await updateAuthUI(cred.user);

        closeAuthModal();
        window.showToast("✓ Account created successfully!", "ok");
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        await updateAuthUI(cred.user);

        closeAuthModal();
        window.showToast("✓ Logged in successfully!", "ok");
      }
    } catch (err) {
      console.error("Auth error:", err);
      const messages = {
        "auth/invalid-credential": "Email or password is incorrect.",
        "auth/email-already-in-use": "This email is already registered.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/network-request-failed": "Network error. Check your connection.",
        "auth/operation-not-allowed": "Email/Password sign-in is not enabled.",
        "auth/unauthorized-domain": "This domain is not authorized in Firebase.",
        "auth/user-disabled": "This account has been disabled.",
        "permission-denied": "Permission denied. Check Firestore rules."
      };
      showAuthMessage(messages[err.code] || err.message || "Authentication failed.");
    } finally {
      authSubmitBtn.disabled = false;
      authSubmitBtn.textContent = mode === "signup" ? "Create Account" : "Login";
    }
  }

  /* ═══════════ GOOGLE SIGN-IN ═══════════ */
  async function handleGoogleLogin() {
    if (!googleLoginBtn) return;

    const originalHTML = googleLoginBtn.innerHTML;
    googleLoginBtn.disabled = true;
    googleLoginBtn.innerHTML = "Signing in…";

    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      if (isMobile) {
        // Mobile: use redirect (popup often blocked)
        await signInWithRedirect(auth, provider);
        // Page will reload; result handled by getRedirectResult below
      } else {
        // Desktop: popup
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
          await saveUserProfile(result.user);
          await updateAuthUI(result.user);
          closeAuthModal();
          window.showToast("✓ Logged in with Google!", "ok");
        }
      }
    } catch (err) {
      console.error("Google login error:", err);
      const messages = {
        "auth/popup-blocked": "Popup blocked. Please allow popups and try again.",
        "auth/popup-closed-by-user": "Sign-in cancelled.",
        "auth/cancelled-popup-request": "Another sign-in is in progress.",
        "auth/unauthorized-domain": "Domain not authorized in Firebase.",
        "auth/network-request-failed": "Network error. Check your connection.",
        "auth/account-exists-with-different-credential": "This email uses another sign-in method.",
        "auth/operation-not-allowed": "Google sign-in is not enabled."
      };
      showAuthMessage(messages[err.code] || err.message || "Google sign-in failed.");
    } finally {
      googleLoginBtn.disabled = false;
      googleLoginBtn.innerHTML = originalHTML;
    }
  }

  /* ═══════════ LOGOUT ═══════════ */
  async function handleLogout() {
    try {
      await signOut(auth);
      window.showToast("✓ Logged out", "ok");
    } catch (err) {
      console.error("Logout error:", err);
      window.showToast("Logout failed", "error");
    }
  }

  /* ═══════════ EVENT BINDINGS ═══════════ */
  if (loginBtn) loginBtn.onclick = openAuthModal;

  document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", closeAuthModal);
  });

  if (authModal) {
    authModal.addEventListener("click", e => {
      if (e.target === authModal) closeAuthModal();
    });
  }

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && authModal?.classList.contains("open")) {
      closeAuthModal();
    }
  });

  document.querySelectorAll(".auth-tab").forEach(tab => {
    tab.addEventListener("click", () => setAuthMode(tab.dataset.authTab));
  });

  if (authForm) authForm.addEventListener("submit", handleAuthSubmit);
  if (googleLoginBtn) googleLoginBtn.addEventListener("click", handleGoogleLogin);

  /* ═══════════ PERSISTENCE ═══════════ */
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (e) {
    console.warn("Persistence setup failed:", e);
  }

  /* ═══════════ HANDLE REDIRECT RESULT (mobile) ═══════════ */
  try {
    const redirectResult = await getRedirectResult(auth);
    if (redirectResult && redirectResult.user) {
      await saveUserProfile(redirectResult.user);
      await updateAuthUI(redirectResult.user);
      window.showToast("✓ Logged in with Google!", "ok");
    }
  } catch (e) {
    if (e && e.code) console.warn("Redirect result:", e.code);
  }

  /* ═══════════ AUTH STATE LISTENER ═══════════ */
  onAuthStateChanged(auth, async user => {
    await updateAuthUI(user);

    if (user) {
      window.setSyncStatus("synced", "ok");
      document.dispatchEvent(new CustomEvent("user-logged-in", { detail: { user } }));
    } else {
      window.setSyncStatus("not signed in", "idle");
      document.dispatchEvent(new CustomEvent("user-logged-out"));
    }
  });

  /* ═══════════ GLOBAL EXPORTS ═══════════ */
  window.openAuthModal = openAuthModal;
  window.closeAuthModal = closeAuthModal;
  window.handleLogout = handleLogout;
  window.getUserRole = getUserRole;

  console.log("✅ Auth module loaded");
}