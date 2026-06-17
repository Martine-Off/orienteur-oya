const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return typeof email === "string" && EMAIL_REGEX.test(email.trim());
}

export function isAnswered(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  // Checkbox group {key: bool} → valide si au moins une case cochée.
  // {} seul retournerait true avec l'ancienne logique — d'où ce cas spécial.
  if (typeof value === "object") return Object.values(value).some((v) => v === true);
  return true;
}
