export function arraysEqual(a, b) {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((value, index) => value === b[index]);
}

export function isQuestionAnswered(question, answer) {
  if (!question || answer === undefined || answer === null) return false;
  if (question.type === 'single') return Number.isInteger(answer);
  if (question.type === 'multiple') return Array.isArray(answer) && answer.length > 0;
  if (question.type === 'boolean') return question.statements.every((_, index) => typeof answer[index] === 'boolean');
  if (question.type === 'matching') return question.pairs.every((_, index) => typeof answer[index] === 'string' && answer[index].length > 0);
  if (question.type === 'reorder') return Array.isArray(answer) && answer.length === question.items.length;
  if (question.type === 'hotspot') return Number.isFinite(answer.x) && Number.isFinite(answer.y);
  return false;
}

export function isQuestionCorrect(question, answer) {
  if (!isQuestionAnswered(question, answer)) return false;
  if (question.type === 'single') return answer === question.correct;
  if (question.type === 'multiple') return arraysEqual([...answer].sort((a, b) => a - b), [...question.correct].sort((a, b) => a - b));
  if (question.type === 'boolean') return question.statements.every(([, correct], index) => answer[index] === correct);
  if (question.type === 'matching') return question.pairs.every(([term], index) => answer[index] === term);
  if (question.type === 'reorder') return arraysEqual(answer, question.correctOrder);
  if (question.type === 'hotspot') {
    const region = question.correctRegion;
    return answer.x >= region.xMin && answer.x <= region.xMax && answer.y >= region.yMin && answer.y <= region.yMax;
  }
  return false;
}

export function calculateAttemptResult({ attemptQuestions, answers, mode, scope, initialSeconds, remainingSeconds, submittedByTimeout = false }) {
  const totalQuestions = attemptQuestions.length;
  const correctCount = attemptQuestions.filter((question) => isQuestionCorrect(question, answers[question.id])).length;
  const unansweredCount = attemptQuestions.filter((question) => !isQuestionAnswered(question, answers[question.id])).length;
  return {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    mode, scope, questions: attemptQuestions, totalQuestions, answers, correctCount,
    wrongCount: totalQuestions - correctCount,
    unansweredCount,
    score: totalQuestions ? Math.round((correctCount / totalQuestions) * 1000) : 0,
    initialSeconds,
    remainingSeconds,
    elapsedSeconds: initialSeconds - remainingSeconds,
    completedAt: new Date().toISOString(),
    submittedByTimeout
  };
}
