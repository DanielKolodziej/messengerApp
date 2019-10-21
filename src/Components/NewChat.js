import React, { useState } from 'react';
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
import Proptypes from 'prop-types';

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
    width: '350px',
    top: '50px',
    left: 'calc(50% + 150px - 175px)',
  },
  input: {},
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
}));

export const NewChat = ({ sender, goToChat, newChatSubmit }) => {
  const classes = useStyles();

  const [username, setUsername] = useState(null);
  const [message, setMessage] = useState(null);
  const [serverError, setServerError] = useState('');

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
  const buildDocKey = () =>
    [firebase.auth().currentUser.email, username].sort().join(';');
  const chatExists = async () => {
    const docKey = buildDocKey();
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
        ? goToChat(buildDocKey(), message)
        : newChatSubmit({
            sendTo: username,
            message,
            // adding timestamp
            timestamp: Date(),
          });
    }
    setServerError('User does not exist or is sender');
  };

  return (
    <main className={classes.main}>
      <CssBaseline />
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h5">
          Send a Message
        </Typography>
        <form onSubmit={e => submitNewChat(e)} className={classes.form}>
          <FormControl fullWidth>
            <InputLabel htmlFor="new-chat-username">
              Enter your friend's email
            </InputLabel>
            <Input
              required
              name="username"
              className={classes.input}
              autoFocus
              onChange={handleInputChange}
              id="new-chat-username"
            />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel htmlFor="new-chat-message">
              Enter your message
            </InputLabel>
            <Input
              required
              name="message"
              className={classes.input}
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
};
