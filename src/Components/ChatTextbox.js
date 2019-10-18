import React, { useState } from 'react';

import { useMediaQuery } from 'react-responsive';
import { TextField } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  sendBtn: {
    color: 'blue',
    cursor: 'pointer',
    '&:hover': {
      color: 'gray',
    },
  },

  chatTextBoxContainer: {
    position: 'absolute',
    bottom: '15px',
    left: '315px',
    boxSizing: 'border-box',
    overflow: 'auto',
    width: 'calc(100% - 300px - 50px)',
  },

  chatTextBox: {
    width: 'calc(100% - 25px)',
  },

  chatTextBoxContainerMobile: {
    position: 'absolute',
    bottom: '15px',
    left: '115px',
    boxSizing: 'border-box',
    overflow: 'auto',
    width: 'calc(100% - 130px)',
  },
});

export const ChatTextbox = ({ submitMessage, selectedChat, messageRead }) => {
  const isNotMobile = useMediaQuery({ minWidth: 650 });
  const classes = useStyles();

  const [chatText, setChatText] = useState('');

  const messageValid = txt => txt && txt.replace(/\s/g, '').length;
  const submitValidMessage = () => {
    if (messageValid(chatText)) {
      console.log('submitValidMessage fired!');
      submitMessage(chatText, selectedChat);
      // setChatText('');
      document.getElementById('chattextbox').value = '';
    }
  };
  const userTyping = e => {
    console.log('user typing');
    return e.keyCode === 13
      ? submitValidMessage()
      : setChatText(e.target.value);
  };

  return (
    <div
      className={
        isNotMobile
          ? classes.chatTextBoxContainer
          : classes.chatTextBoxContainerMobile
      }
    >
      <TextField
        onKeyUp={e => userTyping(e)}
        id="chattextbox"
        className={classes.chatTextBox}
        // onFocus={() => props.messageRead} works
        onFocus={() => messageRead()}
        placeholder="Type your message"
      />
      <Send onClick={() => submitValidMessage()} className={classes.sendBtn} />
    </div>
  );
};

ChatTextbox.propTypes = {
  submitMessage: PropTypes.func,
};
