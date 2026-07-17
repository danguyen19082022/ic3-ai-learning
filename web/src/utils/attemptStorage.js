const LAST_ATTEMPT_KEY = 'ic3_last_attempt';
const ATTEMPT_HISTORY_KEY = 'ic3_attempt_history';
const ATTEMPT_TTL = 7 * 24 * 60 * 60 * 1000;

export function readStoredAttempts() {
  try {
    const cutoff = Date.now() - ATTEMPT_TTL;
    const parsed = JSON.parse(localStorage.getItem(ATTEMPT_HISTORY_KEY) || '[]');
    const valid = Array.isArray(parsed) ? parsed.filter((attempt) => Date.parse(attempt.completedAt) >= cutoff) : [];
    if (valid.length !== parsed.length) localStorage.setItem(ATTEMPT_HISTORY_KEY, JSON.stringify(valid));
    return valid;
  } catch { return []; }
}

export function readLastAttempt() {
  try {
    const attempt = JSON.parse(localStorage.getItem(LAST_ATTEMPT_KEY) || 'null');
    return attempt && Date.parse(attempt.completedAt) >= Date.now() - ATTEMPT_TTL ? attempt : null;
  } catch { return null; }
}

export function saveAttempt(attempt) {
  const history = readStoredAttempts();
  const nextHistory = [attempt, ...history.filter((item) => item.id !== attempt.id)];
  localStorage.setItem(LAST_ATTEMPT_KEY, JSON.stringify(attempt));
  localStorage.setItem(ATTEMPT_HISTORY_KEY, JSON.stringify(nextHistory));
}
