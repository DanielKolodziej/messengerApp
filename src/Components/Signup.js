import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { TextField } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Proptypes from 'prop-types';

import { formIsValid } from '../lib/util';

const firebase = require('firebase');

const useStyles = makeStyles(theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(
      3
    )}px`,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
  hasAccountHeader: {
    width: '100%',
  },
  logInLink: {
    width: '100%',
    textDecoration: 'none',
    color: '#303f9f',
    fontWeight: 'bolder',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
}));

export const Signup = ({ history }) => {
  const classes = useStyles();

  const [signup, setSignup] = useState({
    email: null,
    password: null,
    passwordConfirmation: null,
  });
  const [signupError, setSignupError] = useState('');

  const handleInputChange = e => {
    const { name, value } = e.target;

    setSignup({ ...signup, [name]: value });
    console.log(signup);
  };

  const submitSignup = e => {
    e.preventDefault();

    if (!formIsValid(signup)) {
      setSignupError('Passwords do not match!');
      return;
    }

    console.log(
      `Email: ${signup.email}, Pass: ${signup.password}, Conf: ${signup.passwordConfirmation}, Err: ${signupError}`
    );

    firebase
      .auth()
      .createUserWithEmailAndPassword(signup.email, signup.password)
      .then(
        authres => {
          const userObj = {
            email: authres.user.email,
          };
          firebase
            .firestore()
            .collection('users')
            .doc(signup.email)
            .set(userObj)
            .then(
              () => {
                history.push('/dashboard');
              },
              dbErr => {
                console(dbErr);
                setSignupError(dbErr.message);
              }
            );
        },
        authErr => {
          console.log(authErr);
          setSignupError(authErr.message);
        }
      );
  };

  return (
    <main className={classes.main}>
      <CssBaseline />
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign Up Page
        </Typography>
        <form onSubmit={e => submitSignup(e)} className={classes.form} data-testid="form">
          <TextField
            required
            fullWidth
            margin="normal"
            onChange={handleInputChange}
            name="email"
            autoComplete="email"
            autoFocus
            label="Enter your Email"
            id="sign-email-input"
            variant="outlined"
          />
          <TextField
            required
            fullWidth
            margin="normal"
            onChange={handleInputChange}
            name="password"
            type="password"
            label="Create a Password"
            id="sign-password-input"
            variant="outlined"
          />
          <TextField
            required
            fullWidth
            margin="normal"
            onChange={handleInputChange}
            name="passwordConfirmation"
            type="password"
            label="Confirm Password"
            id="signup-password-confirmation-input"
            variant="outlined"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>
        </form>
        {signupError ? (
          <Typography className={classes.errorText} component="h5" variant="h6">
            {signupError}
          </Typography>
        ) : null}
        <Typography
          component="h5"
          variant="h6"
          className={classes.hasAccountHeader}
        >
          Already have an account?
        </Typography>
        <Link className={classes.logInLink} to="/login">
          Log in!
        </Link>
      </Paper>
    </main>
  );
};

Signup.propTypes = {
  history: Proptypes.object,
};
