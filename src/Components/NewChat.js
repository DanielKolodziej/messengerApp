import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  Paper,
  CssBaseline,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { useMediaQuery } from 'react-responsive';
import Proptypes from 'prop-types';

import { buildDocKey } from '../lib/util';

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
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(
      3
    )}px`,
    position: 'absolute',
    width: '300px',
    top: '50px',
    left: 'calc(50% - 25px)',
  },
  paperDark: {
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(
      3
    )}px`,
    position: 'absolute',
    width: '300px',
    top: '50px',
    left: 'calc(50% - 25px)',
    backgroundColor: '#3D3D3D',
    color: 'white',
    boxShadow: '0 0 10px black',
  },
  inputDark: { color: 'white' },
  form: {
    width: '100%',
    marginTop: theme.spacing(),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  paperMobile: {
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(
      3
    )}px`,
    position: 'absolute',
    width: '320px',
    top: '50px',
    left: 'calc(50% - 125px)',
  },
  paperMobileDark: {
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(
      3
    )}px`,
    position: 'absolute',
    width: '320px',
    top: '50px',
    left: 'calc(50% - 125px)',
    backgroundColor: '#3D3D3D',
    color: 'white',
    boxShadow: '0 0 10px black',
  },
}));

export const NewChat = ({ sender, goToChat, newChatSubmit, userInfo }) => {
  const isNotMobile = useMediaQuery({ minWidth: 650 });
  const classes = useStyles();

  const [username, setUsername] = useState(null);
  const [message, setMessage] = useState(null);
  const [serverError, setServerError] = useState('');
  const [contentStyle, setContentStyle] = useState(classes.paper);

  useEffect(() => {
    if (userInfo.darkModeStatus && isNotMobile) {
      setContentStyle(classes.paperDark);
    } else if (userInfo.darkModeStatus && !isNotMobile) {
      setContentStyle(classes.paperMobileDark);
    } else if (!userInfo.darkModeStatus && !isNotMobile) {
      setContentStyle(classes.paperMobile);
    } else {
      setContentStyle(classes.paper);
    }
    // console.log(contentStyle);
  }, [
    classes.paper,
    classes.paperDark,
    classes.paperMobile,
    classes.paperMobileDark,
    isNotMobile,
    userInfo.darkModeStatus,
  ]);

  const handleInputChange = e => {
    const { name, value } = e.target;

    return name === 'username' ? setUsername(value) : setMessage(value);
  };

  const userExists = async () => {
    const usersSnapshot = await firebase
      .firestore()
      .collection('users')
      .get();
    const exists = usersSnapshot.docs
      .map(_doc => _doc.data().email)
      .includes(username);
    console.log(`existance of receiving user: (${username}) `, exists);
    return exists;
  };

  const chatExists = async () => {
    const docKey = buildDocKey(firebase.auth().currentUser.email, username);
    const chat = await firebase
      .firestore()
      .collection('chats')
      .doc(docKey)
      .get();
    console.log(
      `existance of dialog between sender(${sender})/receiver(${username}): `,
      chat.exists
    );
    return chat.exists;
  };

  const submitNewChat = async e => {
    e.preventDefault();
    console.log('submitNewChat fired!');
    // result from userExists function
    const user = await userExists();
    if (user && sender !== username) {
      // result from chatExists function
      const chatExist = await chatExists();
      return chatExist
        ? goToChat(
            buildDocKey(firebase.auth().currentUser.email, username),
            message
          )
        : newChatSubmit({
            sendTo: username,
            message,
            // adding timestamp Date() or moment()
            timestamp: moment().format('MMM Do YYYY, h:mm:ss a'),
          });
    }
    setServerError('User does not exist or is sender');
  };

  return (
    <main className={classes.main}>
      {/* <CssBaseline /> */}
      {/* <Paper className={isNotMobile ? classes.paper : classes.paperMobile}> */}
      <Paper
        // className={
        //   userInfo.darkModeStatus ? classes.paperDark : classes.paperMobileDark
        // }
        className={contentStyle}
      >
        <Typography component="h1" variant="h5">
          Send a Message
        </Typography>
        <form onSubmit={e => submitNewChat(e)} className={classes.form}>
          <FormControl fullWidth>
            <InputLabel
              htmlFor="new-chat-username"
              style={{ color: '#dcdcdc' }}
            >
              Enter your friend's email
            </InputLabel>
            <Input
              required
              name="username"
              className={
                userInfo.darkModeStatus ? classes.inputDark : classes.input
              }
              autoFocus
              onChange={handleInputChange}
              id="new-chat-username"
            />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel htmlFor="new-chat-message" style={{ color: '#dcdcdc' }}>
              Enter your message
            </InputLabel>
            <Input
              required
              name="message"
              className={
                userInfo.darkModeStatus ? classes.inputDark : classes.input
              }
              onChange={handleInputChange}
              id="new-chat-message"
            />
          </FormControl>
          {serverError ? (
            <Typography
              className={classes.errorText}
              component="h5"
              variant="h6"
            >
              {serverError}
            </Typography>
          ) : null}
          <Button
            fullWidth
            className={classes.submit}
            variant="contained"
            color="primary"
            type="submit"
          >
            Send
          </Button>
        </form>
      </Paper>
    </main>
  );
};

NewChat.propTypes = {
  sender: Proptypes.string,
  goToChat: Proptypes.func,
  newChatSubmit: Proptypes.func,
  userInfo: Proptypes.object,
};
