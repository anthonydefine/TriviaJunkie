import { db } from "./firebase";
import { doc, getDoc, collection, getDocs, updateDoc, query, where } from "firebase/firestore";

export const colorCard = (color) => {
  if (color === 'blue') {
    return 'blue-card'
  } else if (color === 'orange') {
    return 'orange-card'
  } else if (color === 'purple') {
    return 'purple-card'
  } else return 'green-card'
};

export const colorQuiz = (color) => {
  if (color === 'blue') {
    return 'blue-quiz'
  } else if (color === 'orange') {
    return 'orange-quiz'
  } else if (color === 'purple') {
    return 'purple-quiz'
  } else return 'green-quiz'
};

export const getUser = async (id) => {
  try {
    const userDocRef = doc(db, 'users', id);
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      return userData;
    } else {
      console.log('User document does not exist.');
    }
  } catch (error) {
    console.error('Error fetching user document:', error.message);
  }
};

export const checkUserBadges = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      // Check for sets created
      const setsCollectionRef = collection(db, 'sets');
      const setsSnapshot = await getDocs(setsCollectionRef);
      const setsData = setsSnapshot.docs.map((setDoc) => setDoc.data());
      const createdSets = setsData.filter(set => set.creatorId === userId);
      // Add badge names based on conditions
      const badgesArray = [];
      if (createdSets.length >= 1) {
        badgesArray.push('Set Pioneer');
      }
      if (createdSets.length >= 5) {
        badgesArray.push('Set Explorer');
      }
      if (createdSets.length >= 10) {
        badgesArray.push('Set Master');
      }
      // Update the user's badges array
      await updateDoc(userDocRef, { badges: badgesArray });
      return { badgesArray };
    } else {
      console.log('User not found.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    throw error;
  }
};

export const subjectOptions = [
  {
    value: 'math', 
    label: 'Math'
  },
  {
    value: 'geography', 
    label: 'Geography'
  },
  {
    value: 'celebrity', 
    label: 'Celebrity'
  },
  {
    value: 'history', 
    label: 'History'
  },
  {
    value: 'science', 
    label: 'Science'
  },
];

export const difficultyOptions = [
  {
    value: 'basic',
    label: 'Basic',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
  },
  {
    value: 'expert',
    label: 'Expert',
  },
  {
    value: 'genius',
    label: 'Genius',
  },
]