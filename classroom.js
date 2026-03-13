import { db, auth } from './firebase.js';
import {
  collection, doc, setDoc, getDoc, getDocs,
  onSnapshot, serverTimestamp, query, where
} from 'firebase/firestore';

// Generate a 6-char class code
function genCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Teacher: create classroom
export async function createClassroom(teacherName) {
  const code = genCode();
  const uid = auth.currentUser.uid;
  const ref = doc(db, 'classrooms', code);
  await setDoc(ref, {
    code,
    teacherId: uid,
    teacherName,
    createdAt: serverTimestamp(),
    students: {}
  });
  return code;
}

// Student: join classroom by code
export async function joinClassroom(code) {
  const user = auth.currentUser;
  const ref = doc(db, 'classrooms', code);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Classroom not found');

  await setDoc(doc(db, 'classrooms', code, 'students', user.uid), {
    uid: user.uid,
    name: user.displayName,
    photoURL: user.photoURL,
    joinedAt: serverTimestamp(),
    online: true
  }, { merge: true });

  // Save to user profile
  await setDoc(doc(db, 'users', user.uid), {
    classroomCode: code
  }, { merge: true });

  return snap.data();
}

// Teacher: live-listen to students in classroom
export function watchStudents(code, callback) {
  const studentsRef = collection(db, 'classrooms', code, 'students');
  return onSnapshot(studentsRef, (snap) => {
    const students = [];
    snap.forEach(d => students.push(d.data()));
    callback(students);
  });
}

// Teacher: get all classrooms they own
export async function getMyClassrooms() {
  const uid = auth.currentUser.uid;
  const q = query(collection(db, 'classrooms'), where('teacherId', '==', uid));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
}

// Get student's saved classroom
export async function getStudentClassroom() {
  const uid = auth.currentUser.uid;
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  const { classroomCode } = snap.data();
  if (!classroomCode) return null;
  const cSnap = await getDoc(doc(db, 'classrooms', classroomCode));
  return cSnap.exists() ? cSnap.data() : null;
}
