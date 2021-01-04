import firebase from 'firebase/app';
import 'firebase/firestore';

let config = {
  apiKey: 'AIzaSyCCHH-ZzvuSCxfiqoXeWtQB9yDUass335g',
  authDomain: 'react-imdb-97ffa.firebaseapp.com',
  databaseURL: 'https://react-imdb-97ffa.firebaseio.com',
  projectId: 'react-imdb-97ffa',
  storageBucket: 'react-imdb-97ffa.appspot.com',
  messagingSenderId: '326638028636',
  appId: '1:326638028636:web:bef802b755343b2ba16399',
};

firebase.initializeApp(config);

const firestoreDB = firebase.firestore();

export { firebase, firestoreDB }
