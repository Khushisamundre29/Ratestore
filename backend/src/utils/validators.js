// simple validation helpers,just checking against the rules
// given in the requirements doc

function isValidName(name) {
  if (!name) return false;
  const trimmed = name.trim();
  return trimmed.length >= 20 && trimmed.length <= 60;
}

function isValidAddress(address) {
  if (!address) return false;
  return address.trim().length > 0 && address.trim().length <= 400;
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isValidPassword(password) {
  if (!password) return false;
  if (password.length < 8 || password.length > 16) return false;
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(password);
  return hasUpper && hasSpecial;
}

function isValidRating(rating) {
  const num = Number(rating);
  return Number.isInteger(num) && num >= 1 && num <= 5;
}

module.exports = {
  isValidName,
  isValidAddress,
  isValidEmail,
  isValidPassword,
  isValidRating
};