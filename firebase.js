 // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAzQXoBPPLcMIfUypbQjkaPY2v9f2Ev_x0",
    authDomain: "megaelectronic-4ed48.firebaseapp.com",
    projectId: "megaelectronic-4ed48",
    storageBucket: "megaelectronic-4ed48.firebasestorage.app",
    messagingSenderId: "255667020150",
    appId: "1:255667020150:web:40c9a3b6d380afc8cdda57",
    measurementId: "G-6B6D8QGHVQ"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);