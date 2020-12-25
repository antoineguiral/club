import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import R from 'ramda';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';

import Box from 'react-bulma-companion/lib/Box';
import Button from 'react-bulma-companion/lib/Button';
import Title from 'react-bulma-companion/lib/Title';
import Field from 'react-bulma-companion/lib/Field';
import Control from 'react-bulma-companion/lib/Control';
import Icon from 'react-bulma-companion/lib/Icon';
import Input from 'react-bulma-companion/lib/Input';
import Label from 'react-bulma-companion/lib/Label';
import Help from 'react-bulma-companion/lib/Help';

import useKeyPress from '_hooks/useKeyPress';
import { postCheckEmail } from '_api/users';
import { validateEmail, validatePassword } from '_utils/validation';
import { attemptRegister } from '_thunks/auth';

export default function Register() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [password, setPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const checkPassword = (newEmail, newPassword) => {
    const { valid, message } = validatePassword(newEmail, newPassword);

    setPasswordValid(valid);
    setPasswordMessage(message);
  };

  const checkEmail = newEmail => {
    const { valid, message } = validateEmail(newEmail);

    if (valid) {
      setEmailMessage('Checking email...');
      setEmailAvailable(false);

      postCheckEmail(newEmail)
        .then(res => {
          setEmailAvailable(res.available);
          setEmailMessage(res.message);
        })
        .catch(R.identity);
    } else {
      setEmailAvailable(valid);
      setEmailMessage(message);
    }
  };

  const updateEmail = newEmail => {
    setEmail(newEmail);
    checkPassword(newEmail, password);
  };

  const handleEmailChange = e => {
    updateEmail(e.target.value);
    checkEmail(e.target.value);
  };

  const handlePasswordChange = e => {
    setPassword(e.target.value);
    checkPassword(email, e.target.value);
  };

  const register = () => {
    if (emailAvailable && passwordValid) {
      const newUser = {
        email,
        password,
      };

      dispatch(attemptRegister(newUser))
        .catch(R.identity);
    }
  };

  useKeyPress('Enter', register);

  return (
    <Box className="register">
      <Title size="3">
        Sign Up
      </Title>
      <hr className="separator" />
      <p className="has-space-below">
        Already a member?&nbsp;
        <Link to="/login">
          Login
        </Link>
      </p>
      <Field>
        <Label htmlFor="email">
          Email
        </Label>
        <Control iconsRight>
          <Input
            id="email"
            placeholder="email"
            color={email ? (emailAvailable ? 'success' : 'danger') : undefined}
            value={email}
            onChange={handleEmailChange}
          />
          {email && (
            <Icon
              size="small"
              align="right"
              color={emailAvailable ? 'success' : 'danger'}
            >
              <FontAwesomeIcon
                icon={emailAvailable ? faCheck : faExclamationTriangle}
              />
            </Icon>
          )}
        </Control>
        {email && (
          <Help color={emailAvailable ? 'success' : 'danger'}>
            {emailMessage}
          </Help>
        )}
      </Field>
      <Field>
        <Label htmlFor="password">
          Password
        </Label>
        <Control iconsRight>
          <Input
            id="password"
            placeholder="Password"
            type="password"
            color={password ? (passwordValid ? 'success' : 'danger') : undefined}
            value={password}
            onChange={handlePasswordChange}
          />
          {password && (
            <Icon
              size="small"
              align="right"
              color={passwordValid ? 'success' : 'danger'}
            >
              <FontAwesomeIcon
                icon={passwordValid ? faCheck : faExclamationTriangle}
              />
            </Icon>
          )}
        </Control>
        {password && (
          <Help color={passwordValid ? 'success' : 'danger'}>
            {passwordMessage}
          </Help>
        )}
      </Field>
      <hr className="separator" />
      <div className="has-text-right">
        <Button color="success" onClick={register} disabled={!passwordValid || !emailAvailable}>
          Create Account
        </Button>
      </div>
    </Box>
  );
}
