import { firebase, firestoreDB } from '../firebaseConfig';
import { v4 as uuidv4 } from 'uuid';

const DB_USERS = 'users';
const DB_USERS_LOGIN = 'usersLogin';
const DB_USERS_PERMISSIONS = 'permissions';
const DB_MOVIES = 'movies';
const DB_MEMBERS = 'members';
const DB_SUBSCRIPTIONS = 'subscriptions';

const getLastIdFromCollection = async (collectionName) => {
  let snapshot = await firestoreDB
    .collection(collectionName)
    .orderBy('id', 'desc')
    .get();
  return snapshot.empty ? 1 : snapshot.docs[0].data().id + 1;
};

const addDocument = (
  collectionName,
  newDocument,
  needToUpdateCounter = false
) => {
  let collectionRef = firestoreDB.collection(collectionName);

  collectionRef
    .add(newDocument)
    .then(() => {
      if (needToUpdateCounter) {
        let counterDocument = collectionRef.doc(`${collectionName}Counter`);
        updateCounter(true, counterDocument);
      }
    })
    .catch((error) => {
      console.error(
        `FirebaseApi (${collectionName} collection) : Error adding user document: `,
        error
      );
    });
};

const deleteDocument = async (
  collectionName,
  id,
  needToUpdateCounter = false
) => {
  let collectionRef = firestoreDB.collection(collectionName);
  let collectionSnapshot = await collectionRef.where('id', '==', id).get();

  if (!collectionSnapshot.empty) {
    collectionSnapshot.docs[0].ref
      .delete()
      .then(() => {
        if (needToUpdateCounter) {
          let counterDocument = collectionRef.doc(`${collectionName}Counter`);
          updateCounter(false, counterDocument);
        }
      })
      .catch((error) => {
        console.error(
          `FirebaseApi (${collectionName} collection) : Error adding user document: `,
          error
        );
      });
  }
};

const updateCounter = (increment, counterDoc) => {
  counterDoc.update({
    counter: increment
      ? firebase.firestore.FieldValue.increment(1)
      : firebase.firestore.FieldValue.increment(-1),
  });
};

const shouldUpdateCollection = async (collectionName) => {
  let counterDocument = firestoreDB
    .collection(collectionName)
    .doc(`${collectionName}Counter`);

  let doc = await counterDocument.get();
  if (doc.exists) {
    // counter doc exists - no need to fetch data again
    return false;
  } else {
    // counter doc not exists - need to fetch data for this collection + create the counter document
    await counterDocument.set({
      id: 0,
      counter: 0,
    });
    return true;
  }
};

const getAllUsersData = async () => {
  let usersSnapshot = await firestoreDB
    .collection(DB_USERS)
    .orderBy('id')
    .get();
  let usersLoginSnapshot = await firestoreDB
    .collection(DB_USERS_LOGIN)
    .orderBy('id')
    .get();
  let usersPermissionSnapshot = await firestoreDB
    .collection(DB_USERS_PERMISSIONS)
    .orderBy('id')
    .get();

  let usersDataArr;
  if (!usersSnapshot.empty) {
    usersDataArr = usersSnapshot.docs.map((doc) => {
      let userData = doc.data();
      return {
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        name: userData.firstName + ' ' + userData.lastName,
        userName: usersLoginSnapshot.empty
          ? ''
          : findUserNameById(userData.id, usersLoginSnapshot.docs),
        sessionTO: userData.sessionTimeOut,
        createdAt: userData.createdAt?.toDate(),
        permissions: usersPermissionSnapshot.empty
          ? []
          : findUserPermissionById(userData.id, usersPermissionSnapshot.docs),
      };
    });
    return usersDataArr;
  }
};

const findUserNameById = (id, docs) => {
  let arr = docs.filter((doc) => doc.data().id === id);
  if (arr.length > 0) {
    return arr[0].data().userName;
  }
};

const findUserPermissionById = (id, docs) => {
  let arr = docs.filter((doc) => doc.data().id === id);
  if (arr.length > 0) {
    return arr[0].data().permissions;
  }
};

const deleteUserData = async (userId) => {
  let userSnapshot = await firestoreDB
    .collection(DB_USERS)
    .where('id', '==', userId)
    .get();
  let userLoginSnapshot = await firestoreDB
    .collection(DB_USERS_LOGIN)
    .where('id', '==', userId)
    .get();
  let userPermissionsSnapshot = await firestoreDB
    .collection(DB_USERS_PERMISSIONS)
    .where('id', '==', userId)
    .get();
  if (!userSnapshot.empty) {
    userSnapshot.docs[0].ref.delete();
  }

  if (!userLoginSnapshot.empty) {
    userLoginSnapshot.docs[0].ref.delete();
  }

  if (!userPermissionsSnapshot.empty) {
    userPermissionsSnapshot.docs[0].ref.delete();
  }
};

const updateDocument = async (collectionName, docToUpdate) => {
  let collectionSnapshot = await firestoreDB
    .collection(collectionName)
    .orderBy('id')
    .get();

  if (!collectionSnapshot.empty) {
    let docs = collectionSnapshot.docs;
    let arr = docs.filter((doc) => doc.data().id === docToUpdate.id);
    if (arr.length > 0) {
      firestoreDB.collection(collectionName).doc(arr[0].id).update(docToUpdate);
    }
  }
};

const getAllMoviesData = async () => {
  let moviesSnapshot = await firestoreDB
    .collection(DB_MOVIES)
    .where('id', '!=', 0)
    .orderBy('id')
    .get();

  let moviesDataArr;
  if (!moviesSnapshot.empty) {
    moviesDataArr = moviesSnapshot.docs.map((doc) => {
      let movieData = doc.data();
      return {
        id: movieData.id,
        name: movieData.name,
        image: movieData.image,
        premiered: movieData.premiered?.toDate(),
        genres: movieData.genres,
      };
    });
  }

  return moviesDataArr;
};

const getDummyAllMoviesData = async () => {
  let fakeMoviesArr = [];
  for (let index = 0; index < 25; index++) {
    let fakeMovie = {
      id: index + 1,
      name: `fake movie #${index + 1}`,
      image:
        'http://static.tvmaze.com/uploads/images/medium_portrait/81/202627.jpg',
      premiered: new Date(),
      genres: ['action, horror', 'comedy'],
    };
    fakeMoviesArr.push(fakeMovie);
  }
  return fakeMoviesArr;
};


const createMovieMap = async () => {
  let moviesSnapshot = await firestoreDB
    .collection(DB_MOVIES)
    .where('id', '!=', 0)
    .orderBy('id')
    .get();

  let moviesMap = new Map();
  if (!moviesSnapshot.empty) {
    moviesSnapshot.docs.forEach(doc => {
      let movieData = doc.data();
      moviesMap[movieData.id] = movieData.name;
    })
  }
  return moviesMap;
};

const getAllMembersData = async () => {
  let membersSnapshot = await firestoreDB
    .collection(DB_MEMBERS)
    .where('id', '!=', 0)
    .orderBy('id')
    .get();

  let membersSubscriptionsSnapshot = await firestoreDB
    .collection(DB_SUBSCRIPTIONS)
    .get();

  let moviesMap = await createMovieMap()

  let membersDataArr;
  if (!membersSnapshot.empty) {

    membersDataArr = membersSnapshot.docs.map((doc) => {
      let memberData = doc.data();
 
      return {
        id: memberData.id,
        name: memberData.name,
        email: memberData.email,
        city: memberData.city,
        moviesSubscriptions: findMemberMovieSubscription(
          memberData.id,
          membersSubscriptionsSnapshot,
          moviesMap
        ),
      };
    });

    return membersDataArr;
  }
};


const findMemberMovieSubscription = (memberId, membersSubscriptionsSnapshot, moviesMap) => {

  if(membersSubscriptionsSnapshot?.empty)
    return [];
  
  let docs = membersSubscriptionsSnapshot.docs;
  let arr = docs.filter((doc) => doc.data().memberId === memberId);
  if (arr.length > 0) {
    let memberMoviesSubsArr = arr[0].data().movies;

    return memberMoviesSubsArr.map(movie => {
      return {
        id : movie.id,
        name : moviesMap[movie.id],
        date : movie.date.toDate()
      };
    })
  }

  return [];
};

const deleteMemberData = async (memberId) => {
  let memberSnapshot = await firestoreDB
    .collection(DB_MEMBERS)
    .where('id', '==', memberId)
    .get();

  let memberMoviesSubscriptionsSnapshot = await firestoreDB
    .collection(DB_SUBSCRIPTIONS)
    .where('memberId', '==', memberId)
    .get();

  if (!memberSnapshot.empty) {
    memberSnapshot.docs[0].ref.delete();
  }

  if (!memberMoviesSubscriptionsSnapshot.empty) {
    memberMoviesSubscriptionsSnapshot.docs[0].ref.delete();
  }
};

const getLoginUser = async (userName, password) => {
  let usersLoginSnapshot = await firestoreDB
    .collection(DB_USERS_LOGIN)
    .where('userName', '==', userName)
    .where('password', '==', password)
    .get();

  if (!usersLoginSnapshot.empty) {
    // user exists in DB and password is correct
    let userLoginDoc = usersLoginSnapshot.docs[0].data();

    let usersSnapshot = await firestoreDB
      .collection(DB_USERS)
      .where('id', '==', userLoginDoc.id)
      .get();

    let permissionsSnapshot = await firestoreDB
      .collection(DB_USERS_PERMISSIONS)
      .where('id', '==', userLoginDoc.id)
      .get();

    if (!usersSnapshot.empty) {
      //get user extra data
      let userDoc = usersSnapshot.docs[0].data();
      return {
        id: userDoc.id,
        userName: userLoginDoc.userName,
        fullName: `${userDoc.firstName} ${userDoc.lastName}`,
        sessionTO : userDoc.sessionTimeOut,
        isAdmin : userLoginDoc.userName === 'admin', //TODO : FIX THIS
        permissions: permissionsSnapshot.empty
          ? []
          : permissionsSnapshot.docs[0].data().permissions,
      };
    } else {
      console.error(`cant retrieve user: ${userName} data from DB`);
      return false;
    }
  } else {
    //user doesn't exists or password is incorrect
    console.error(`user: ${userName} doesn't exists or password is incorrect`);
    return false;
  }
};

const subscribeNewMovie = async(memberId, movieName, movieId, movieDate) => {
  const snapShot = await firestoreDB
  .collection(DB_SUBSCRIPTIONS)
  .where('memberId', '==', memberId)
  .get();
  
  if(snapShot.empty)
  {
    // Add new document 
    let doc = {
      id : uuidv4(),
      memberId : memberId,
      movies : [
        {
          date : movieDate,
          id : movieId,
          name : movieName
        }
      ]
    }
    addDocument(DB_SUBSCRIPTIONS, doc);
  }
  else{
    // update document
    let doc = snapShot.docs[0].data();

    let docToUpdate = {
      ...doc,
      movies : [...doc.movies, {
        date : movieDate,
        id : movieId,
        name : movieName
      }]
    }
    updateDocument(DB_SUBSCRIPTIONS, docToUpdate)
  }
}

const getAllSubscriptions = async() => {
  let subsSnapshot = await firestoreDB
  .collection(DB_SUBSCRIPTIONS)
  .get();

  if(!subsSnapshot.empty){
    let subsArr = subsSnapshot.docs.map(doc => {
      return doc.data();
    })

    return subsArr;
  }
}

export default {
  addDocument,
  deleteDocument,
  shouldUpdateCollection,
  getLastIdFromCollection,
  getAllUsersData,
  deleteUserData,
  updateDocument,
  getAllMoviesData,
  getDummyAllMoviesData, //todo: delete this,
  getAllMembersData,
  deleteMemberData,
  getLoginUser,
  subscribeNewMovie,
  getAllSubscriptions
};
