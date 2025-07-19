// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

// AdMob configuration
document.addEventListener('DOMContentLoaded', function() {
  if(typeof admob !== 'undefined') {
    admob.initAdmob("ca-app-pub-1749527081276279~5871964075", "ca-app-pub-1749527081276279/9185642681");
    admob.setOptions({
      publisherId: "ca-app-pub-1749527081276279~5871964075",
      interstitialAdId: "ca-app-pub-1749527081276279/9185642681",
      bannerAtTop: false,
      overlap: true,
      offsetStatusBar: false,
      isTesting: false
    });
  }
});
