import R from 'ramda';
import validator from 'validator';

export const validateEmail = email => {
  let valid = true;
  let message = 'Email Valid';

  if (!validator.isEmail(email)) {
    message = 'Invalid email!';
    valid = false;
  }
  return { valid, message };
};

export const validatePassword = (username, password) => {
  let valid = true;
  let message = 'Password valid';

  if (password.length < 6) {
    valid = false;
    message = 'Password must be at least six characters';
  } else if (password.length > 16) {
    valid = false;
    message = 'Password must be 16 characters or less';
  } else if (username === password) {
    valid = false;
    message = 'Username and password must be different';
  } else if (!R.match(/[0-9]/, password).length) {
    valid = false;
    message = 'Password must include at least one number';
  }

  return { valid, message };
};

export const validateName = name => {
  if (name === '') {
    return true;
  }
  if (!R.match(/^[a-zA-ZÀ-ÿ'.\s]+$/, name).length) {
    return false;
  }
  if (name.length > 20) {
    return false;
  }
  return true;
};
