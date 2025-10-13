import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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

const codeForm = document.getElementById("codeForm");
const codeError = document.getElementById("code-error");

codeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  codeError.textContent = "";
  const code = document.getElementById("code-input").value.trim();

  try {
    // Check if code exists
    const codeRef = doc(db, "codes", code);
    const codeSnap = await getDoc(codeRef);
    if (!codeSnap.exists()) throw new Error("Invalid code");

    // Sign in anonymously
    const userCred = await signInAnonymously(auth);
    const uid = userCred.user.uid;

    // Store code in user's profile (for future tracking)
    await setDoc(doc(db, "users", uid), { code }, { merge: true });

    // Redirect to game
    window.location.href = "public/game.html";
  } catch (err) {
    codeError.textContent = err.message || "Access failed";
  }
});
