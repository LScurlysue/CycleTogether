// firebase-config.js — PeakPhase Firebase / FCM Setup
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
//  e.g. "https://peakphase.yourdomain.com" or "http://localhost:3000"
// ─────────────────────────────────────────────────────────────────────────────

window.FIREBASE_CONFIG = {
  apiKey:            "AIzaSyBoosFR1K_YVuIDFqpePFsQWBH0tX0eg",
  authDomain:        "peakphase-42bcf.firebaseapp.com",
  projectId:         "peakphase-42bcf",
  storageBucket:     "peakphase-42bcf.firebasestorage.app",
  messagingSenderId: "185492018588",
  appId:             "1:185492018588:web:c4d5d87bce35c33ebb640a",
  measurementId:     "G-YQkEx8QbB5",

  // Web Push certificate key pair — from Firebase Console → Cloud Messaging
  // → Web Push certificates → Generate key pair → paste here
  vapidKey:          "YOUR_VAPID_KEY",
};

// URL of the PeakPhase backend server (ser