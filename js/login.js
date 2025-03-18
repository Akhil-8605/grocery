import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXZBgFo3SmvYX_B1_165DB2EQo5ksO6cY",
  authDomain: "grocery-47.firebaseapp.com",
  projectId: "grocery-47",
  storageBucket: "grocery-47.firebasestorage.app",
  messagingSenderId: "412954766156",
  appId: "1:412954766156:web:db164f0110e014524afde9",
  measurementId: "G-7XB7GC36H7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

document.addEventListener("DOMContentLoaded", function () {
  // Check if user is already logged in
  onAuthStateChanged(auth, async function (user) {
    if (user) {
      console.log("User is signed in:", user);
      // Store user info in localStorage for use in other pages
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        })
      );
      // If on login page, redirect to home page
      if (window.location.pathname.includes("login.html")) {
        window.location.href = "index.html";
      }
    } else {
      console.log("User is signed out");
      localStorage.removeItem("user");
    }
  });

  // Add event listener to login form (if applicable)
  const loginForm = document.querySelector(".main-login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }
      // For demo purposes: show success and redirect
      alert("Login successful!");
      window.location.href = "index.html";
    });
  }

  // Google Sign-In callback for One Tap (if used)
  window.handleCredentialResponse = function (response) {
    alert("Google Sign-In successful!");
    window.location.href = "index.html";
  };

  // Attach event listener to Google login button
  const googleLoginBtn = document.getElementById("google-login-btn");
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", signInWithGoogle);
  }
});

// Function to sign in with Google and save user data to Firestore
async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    // Save user data with immediate timestamp values
    await saveUserToFirestore(user);
    // Check if user is admin
    const isAdmin = user.email === "akhileshadam186@gmail.com";
    localStorage.setItem("isAdmin", isAdmin);
    alert("Login successful!");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    alert("Login failed. Please try again.");
  }
}

// Updated function to save user data using Timestamp.now()
async function saveUserToFirestore(user) {
  try {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    const userData = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      isAdmin: user.email === "akhileshadam186@gmail.com",
      lastLogin: Timestamp.now(), // immediate timestamp
    };
    // Set createdAt only if document doesn't exist yet
    if (!docSnap.exists()) {
      userData.createdAt = Timestamp.now();
    }
    await setDoc(userRef, userData, { merge: true });
    console.log("User data saved to Firestore");
  } catch (error) {
    console.error("Error saving user data:", error);
    alert("Error saving user data: " + error.message);
  }
}

// Function to sign out the user
window.signOutUser = function () {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("isAdmin");
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error signing out:", error);
      alert("Error signing out. Please try again.");
    });
};
a