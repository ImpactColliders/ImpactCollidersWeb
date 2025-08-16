import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, runTransaction } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFhBZWx3TUC-hdRAZ0noaD_jRTV7rgmE0",
  authDomain: "impactcolliders-afc54.firebaseapp.com",
  projectId: "impactcolliders-afc54",
  storageBucket: "impactcolliders-afc54.firebasestorage.app",
  messagingSenderId: "914866963026",
  appId: "1:914866963026:web:79dea52fc349bfe445158b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginError = document.getElementById("login-error");
const registerError = document.getElementById("register-error");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.textContent = "";
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const code = document.getElementById("login-code").value.trim();
  try {
    const codeRef = doc(db, "codes", code);
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(codeRef);
      if (!snap.exists()) throw new Error("Invalid code");
      const data = snap.data() || {};
      if ((data.usage || 0) <= 0) throw new Error("Code not activated");
    });
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "public/game.html";
  } catch (err) {
    loginError.textContent = err.message || "Login failed";
  }
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  registerError.textContent = "";
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value;
  const code = document.getElementById("register-code").value.trim();
  try {
    await runTransaction(db, async (tx) => {
      const codeRef = doc(db, "codes", code);
      const snap = await tx.get(codeRef);
      if (!snap.exists()) throw new Error("Invalid code");
      const data = snap.data() || {};
      const usage = data.usage || 0;
      const limit = data.limit || 3;
      if (usage >= limit) throw new Error("Code reached limit");
      tx.update(codeRef, { usage: usage + 1 });
    });
    await createUserWithEmailAndPassword(auth, email, password);
    window.location.href = "public/game.html";
  } catch (err) {
    registerError.textContent = err.message || "Registration failed";
  }
});
