import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, runTransaction, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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
const forgotPasswordLink = document.getElementById("forgot-password");

// Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.textContent = "";
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create a blank record if missing
      await setDoc(userRef, { code: null }, { merge: true });
      throw new Error("Your account is missing a unique code. Please register again.");
    }

    const userData = userSnap.data();

    if (!userData.code) {
      throw new Error("No unique code linked to this account. Please register again.");
    }

    window.location.href = "public/game.html";
  } catch (err) {
    loginError.textContent = err.message || "Login failed";
  }
});



// Register
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

    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;
    await setDoc(doc(db, "users", uid), { code }, { merge: true });

    window.location.href = "public/game.html";
  } catch (err) {
    registerError.textContent = err.message || "Registration failed";
  }
});

// Forgot Password
forgotPasswordLink.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  if (!email) {
    loginError.textContent = "Enter your email first";
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    loginError.textContent = "Password reset email sent!";
  } catch (err) {
    loginError.textContent = err.message || "Failed to send reset email";
  }
});
