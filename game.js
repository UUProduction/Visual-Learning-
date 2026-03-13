import { getRank, calcMultiplier, getBonuses } from './rank.js';
import { db, auth } from './firebase.js';
import { doc, getDoc, setDoc, increment, updateDoc } from 'firebase/firestore';

let state = {
  points: 0,
  multiplier: 1.0,
  streak: 0,
  questionStart: 0,
  currentWord: null,
  currentChoices: [],
  wrongThisRound: false,
};

export async function loadQuestion() {
  // Fetch from Anthropic API
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Generate a vocabulary question. Return ONLY valid JSON in this exact format, no markdown:
{
  "word": "someword",
  "correct": "the correct definition",
  "choices": ["correct definition", "wrong def 1", "wrong def 2", "wrong def 3"]
}
Shuffle the choices randomly. The word should be appropriate for grades 1-6 ELA.`
      }]
    })
  });

  const data = await res.json();
  const text = data.content[0].text.trim();
  const parsed = JSON.parse(text);

  state.currentWord = parsed.word;
  state.currentChoices = parsed.choices;
  state.questionStart = Date.now();
  state.wrongThisRound = false;

  return parsed;
}

export function submitAnswer(chosen, correct) {
  const timeTaken = Date.now() - state.questionStart;
  const isCorrect = chosen === correct;

  if (!isCorrect) {
    state.streak = 0;
    state.wrongThisRound = true;
    state.multiplier = Math.max(1.0, state.multiplier - 0.25);
    return { correct: false, rank: getRank(state.points, state.multiplier), bonuses: ['INTERRUPTION'] };
  }

  state.streak++;
  state.points++;
  state.multiplier = calcMultiplier(state.streak, timeTaken);
  const bonuses = getBonuses(state.streak, timeTaken, false);
  const rank = getRank(state.points, state.multiplier);

  return {
    correct: true,
    points: state.points,
    multiplier: state.multiplier,
    streak: state.streak,
    rank,
    bonuses,
    timeTaken
  };
}

export function getState() { return { ...state }; }

export async function saveScore(userId, classroomId) {
  const ref = doc(db, 'classrooms', classroomId, 'scores', userId);
  await setDoc(ref, {
    points: state.points,
    multiplier: state.multiplier,
    rankId: getRank(state.points, state.multiplier).id,
    updatedAt: new Date()
  }, { merge: true });
}
