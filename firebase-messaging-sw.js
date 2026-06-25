// firebase-messaging-sw.js — FCM Background Message Handler
// ─────────────────────────────────────────────────────────────────────────────
// Firebase Cloud Messaging requires this file to exist at the root of your app
// to receive push notifications while the browser/app is in the background.
//
// SETUP REQUIRED — fill in your Firebase project config below:
//   Firebase Console → Project Settings → General → Your apps → Web app
// ─────────────────────────────────────────────────────────────────────────────

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// ─── YOUR FIREBASE CONFIG ────────────────────────────────────────────────────
// Must match the config in firebase-config.js exactly.
firebase.initializeApp({
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID",
});
// ─────────────────────────────────────────────────────────────────────────────

const messaging = firebase.messaging();

// Handle push messages received while the app is in the background or closed.
// The server sends phase info and "how to support" text as notification fields.
messaging.onBackgroundMessage((payload) => {
  // Firebase may deliver the message as notification, data, or both
  const notif = payload.notification || {};
  const data  = payload.data       || {};

  const title = notif.title || data.title || 'CycleTogether';
  const body  = notif.body  || data.body  || '';

  const options = {
    body,
    icon:  './icons/icon-192.png',
    badge: './icons/icon-192.png',
    tag:   data.tag || 'partner-daily',
    // Store URL so notificationclick can open it
    data:  { url: data.openUrl || './' },
    requireInteraction: false,
  };

  // Action button (e.g. "See today's full insight →")
  if (data.actionTitle) {
    options.actions = [{ action: 'open', title: data.actionTitle }];
  }

  self.registration.showNotification(title, options);
});

// Open / focus the app when the notification (or its action button) is tapped.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || './';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((list) => {
        for (const client of list) {
          if ('focus' in client) return client.focus();
        }
        return self.clients.openWindow(url);
      })
  );
});
