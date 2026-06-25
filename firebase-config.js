// firebase-config.js — CycleTogether Firebase / FCM Setup
// ─────────────────────────────────────────────────────────────────────────────
// Fill in your Firebase project credentials below, then do the same in
// firebase-messaging-sw.js (Firebase needs the config in both places).
//
// WHERE TO GET THESE VALUES
// ─────────────────────────
//  1. Go to https://console.firebase.google.com
//  2. Open (or create) your project
//  3. Project Settings → General → Your apps → Add app → Web (</>)
//  4. Copy the firebaseConfig object into FIREBASE_CONFIG below
//
//  For vapidKey:
//  Project Settings → Cloud Messaging → Web Push certificates
//  → "Generate key pair" if empty → copy the Key pair value
//
//  For BACKEND_URL:
//  Set this to the URL where your server/server.js is running,
//  e.g. "https://cycletogether.yourdomain.com" or "http://localhost:3000"
// ─────────────────────────────────────────────────────────────────────────────

window.FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID",

  // Web Push certificate key pair — from Firebase Console → Cloud Messaging
  vapidKey:          "YOUR_VAPID_KEY",
};

// URL of the CycleTogether backend server (server/server.js).
// Partner devices POST their FCM token here so the server can send daily pushes.
window.BACKEND_URL = "http://localhost:3000";
