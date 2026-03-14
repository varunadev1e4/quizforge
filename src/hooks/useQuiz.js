import { useState, useEffect, useRef, useCallback } from 'react';
import { getQuizQuestions, getGrandLevelLabel } from '../data/questions';
import { applyQuizResult } from '../utils/quizEngine';
import { SECONDS_PER_QUESTION } from '../data/constants';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { BADGES } from '../data/badges';

export function useQuiz() {
  const { store, persist }   = useStore();
  const { currentUser }      = useAuth();
  const { notify }           = useNotification();

  const [quizSession, setQuizSession] = useState(null);
  // quizSession shape:
  // { subject, level, questions[], current, answers[], startTime, timeLeft, phase: 'answering'|'confirmed'|'result' }

  const timerRef = useRef(null);

  // ── Start a quiz ────────────────────────────────────────────────────────
  const startQuiz = useCallback((subject, level) => {
    const questions = getQuizQuestions(subject, level, store.customQuestions);
    const normalizedLevel = subject === 'grand' ? getGrandLevelLabel(level) : level;
    setQuizSession({
      subject,
      level: normalizedLevel,
      levelBySubject: subject === 'grand' ? level : null,
      questions,
      current: 0,
      answers: [],
      startTime: Date.now(),
      questionStart: Date.now(),
      timeLeft: SECONDS_PER_QUESTION,
      phase: 'answering',
      selectedOption: null,
      timings: [],
      result: null,
    });
  }, [store.customQuestions]);

  // ── Timer tick ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!quizSession || quizSession.phase !== 'answering') {
      clearInterval(timerRef.current);
      return;
    }
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setQuizSession(prev => {
        if (!prev || prev.phase !== 'answering') return prev;
        if (prev.timeLeft <= 1) {
          // Auto-submit timeout as -1
          return advanceQuestion(prev, -1);
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [quizSession?.current, quizSession?.phase]);

  // ── Select an option ────────────────────────────────────────────────────
  const selectOption = useCallback((idx) => {
    setQuizSession(prev => {
      if (!prev || prev.phase !== 'answering') return prev;
      return { ...prev, selectedOption: idx };
    });
  }, []);

  // ── Confirm selection ───────────────────────────────────────────────────
  const confirmAnswer = useCallback(() => {
    clearInterval(timerRef.current);
    setQuizSession(prev => {
      if (!prev || prev.phase !== 'answering') return prev;
      if (prev.selectedOption === null) return prev;
      return { ...prev, phase: 'confirmed' };
    });
  }, []);

  // ── Proceed to next question ────────────────────────────────────────────
  const nextQuestion = useCallback(() => {
    setQuizSession(prev => {
      if (!prev) return prev;
      return advanceQuestion(prev, prev.selectedOption ?? -1);
    });
  }, []);

  // ── Internal: move to next Q or finalize ────────────────────────────────
  function advanceQuestion(prev, answer) {
    const newAnswers  = [...prev.answers, answer];
    const timeTaken   = Math.round((Date.now() - prev.questionStart) / 1000);
    const newTimings  = [...prev.timings, timeTaken];
    const isLast      = prev.current === prev.questions.length - 1;

    if (isLast) {
      const { updatedUser, score, correct, xpEarned, newBadgeIds } = applyQuizResult(
        store.users[currentUser],
        {
          subject: prev.subject,
          level: prev.level,
          levelBySubject: prev.levelBySubject,
          answers: newAnswers,
          questions: prev.questions,
        }
      );
      // Patch timeTaken into latest history entry
      const totalTime = Math.round((Date.now() - prev.startTime) / 1000);
      updatedUser.history[0] = { ...updatedUser.history[0], timeTaken: totalTime };

      persist(s => ({ ...s, users: { ...s.users, [currentUser]: updatedUser } }));

      // Badge notifications
      newBadgeIds.forEach(id => {
        const badge = BADGES.find(b => b.id === id);
        if (badge) notify(`${badge.icon} Badge unlocked: ${badge.name}`, 'badge', 4000);
      });

      return {
        ...prev,
        answers: newAnswers,
        timings: newTimings,
        phase: 'result',
        result: { score, correct, total: prev.questions.length, xpEarned, newBadgeIds },
      };
    }

    return {
      ...prev,
      current:       prev.current + 1,
      answers:       newAnswers,
      timings:       newTimings,
      selectedOption: null,
      phase:         'answering',
      timeLeft:      SECONDS_PER_QUESTION,
      questionStart: Date.now(),
    };
  }

  const exitQuiz = useCallback(() => setQuizSession(null), []);

  return { quizSession, startQuiz, selectOption, confirmAnswer, nextQuestion, exitQuiz };
}
