import { getAuth } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { FIRESTORE_DB } from './FirebaseConfig';

export const formatDate = (date) => {
  const day = date.getDate();
  const daySuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day}${daySuffix(day)} ${month} ${year}`;
};

export const formatRelativeDate = (timestamp) => {
  if (!timestamp) return 'Unknown date';

  const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
  const now = new Date().getTime();
  const difference = now - date.getTime();

  const minutes = Math.floor(difference / (1000 * 60));
  const hours = Math.floor(difference / (1000 * 60 * 60));
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(difference / (1000 * 60 * 60 * 24 * 7));
  const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));
  const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));

  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else if (weeks < 4) {
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  } else if (months < 12) {
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  } else {
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }
};

export const getCurrentUserId = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  return user ? user.uid : null;
};

export const getCurrentUserRole = async () => {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error('User is not authenticated');
  }

  const userDocRef = doc(FIRESTORE_DB, 'users', userId);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();
    return userData.role;
  } else {
    throw new Error('User does not exist in the database');
  }
};

export const getIsLoginRequired = ({ setIsLoginRequired }) => {
  if (setIsLoginRequired == null) return false;
  return setIsLoginRequired ? true : false;
};

export const updateIsLoginRequired = (setIsLoginRequired, value) => {
  if (typeof setIsLoginRequired === 'function') {
    setIsLoginRequired(value);
  } else {
  }
};

export const updateUser = (setUser, value) => {
  if (typeof setUser === 'function') {
    setUser(value);
  } else {
  }
};