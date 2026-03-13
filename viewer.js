import { db } from './firebase.js';
import { collection, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Student: ping their current activity every 5s
export function startStudentPing(classroomCode, activity = 'game') {
  const uid = window._vlUser?.uid;
  if (!uid) return;
  const ping = () => {
    setDoc(doc(db, 'classrooms', classroomCode, 'students', uid), {
      lastSeen: serverTimestamp(),
      currentActivity: activity,
      online: true
    }, { merge: true });
  };
  ping();
  return setInterval(ping, 5000);
}

// Teacher: watch all students live
export function watchViewer(classroomCode, onUpdate) {
  const ref = collection(db, 'classrooms', classroomCode, 'students');
  return onSnapshot(ref, snap => {
    const students = [];
    snap.forEach(d => {
      const data = d.data();
      const lastSeen = data.lastSeen?.toDate?.() || null;
      const isOnline = lastSeen && (Date.now() - lastSeen.getTime() < 12000);
      students.push({ ...data, isOnline });
    });
    onUpdate(students);
  });
}

// Teacher: render viewer grid into a container element
export function renderViewerGrid(students, container) {
  container.innerHTML = '';
  if (students.length === 0) {
    container.innerHTML = '<p class="viewer-empty">No students connected.</p>';
    return;
  }
  students.forEach(s => {
    const card = document.createElement('div');
    card.className = `viewer-card ${s.isOnline ? 'online' : 'offline'}`;
    card.innerHTML = `
      <img src="${s.photoURL || 'assets/default-avatar.png'}" alt="${s.name}" />
      <div class="viewer-info">
        <span class="viewer-name">${s.name || 'Student'}</span>
        <span class="viewer-status">${s.isOnline ? s.currentActivity || 'Active' : 'Offline'}</span>
      </div>
      <div class="viewer-dot ${s.isOnline ? 'dot-green' : 'dot-red'}"></div>
    `;
    container.appendChild(card);
  });
}
