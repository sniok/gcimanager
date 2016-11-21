import * as firebase from 'firebase'

var config = {
  apiKey: "AIzaSyCicAEw6Zw0bhvRulbnDRO5b4qpanRC7_Q",
  authDomain: "gcimanager-94401.firebaseapp.com",
  databaseURL: "https://gcimanager-94401.firebaseio.com",
  storageBucket: "gcimanager-94401.appspot.com",
  messagingSenderId: "255358246653"
};
firebase.initializeApp(config)

export default firebase