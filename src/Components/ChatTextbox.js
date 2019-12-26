// import React, { useState } from 'react';

// import { useMediaQuery } from 'react-responsive';
// import { TextField } from '@material-ui/core';
// import { Send } from '@material-ui/icons';
// import { makeStyles } from '@material-ui/core/styles';
// import PropTypes from 'prop-types';

// import { messageValid } from '../lib/util';

// const useStyles = makeStyles({
//   sendBtn: {
//     color: 'blue',
//     cursor: 'pointer',
//     '&:hover': {
//       color: 'gray',
//     },
//   },

//   chatTextBoxContainer: {
//     position: 'absolute',
//     bottom: '15px',
//     left: '315px',
//     boxSizing: 'border-box',
//     overflow: 'auto',
//     width: 'calc(100% - 300px - 50px)',
//   },
//   // chatTextBoxContainerDark: {
//   //   backgroundColor: '#3D3D3D',
//   //   position: 'absolute',
//   //   bottom: '15px',
//   //   left: '315px',
//   //   boxSizing: 'border-box',
//   //   overflow: 'auto',
//   //   width: 'calc(100% - 300px - 50px)',
//   // },

//   chatTextBox: {
//     width: 'calc(100% - 25px)',
//     textIndent: '1em',
//   },
//   chatTextBoxDark: {
//     // width: 'calc(100% - 25px)',
//     backgroundColor: '#3D3D3D',
//     color: 'white',
//     textIndent: '40px',
//   },

//   chatTextBoxContainerMobile: {
//     position: 'absolute',
//     bottom: '15px',
//     left: '115px',
//     boxSizing: 'border-box',
//     overflow: 'auto',
//     width: 'calc(100% - 130px)',
//   },
// });

// export const ChatTextbox = ({
//   submitMessage,
//   selectedChat,
//   messageRead,
//   userInfo,
// }) => {
//   const isNotMobile = useMediaQuery({ minWidth: 650 });
//   const classes = useStyles();

//   const [chatText, setChatText] = useState('');

//   const submitValidMessage = () => {
//     if (messageValid(chatText)) {
//       console.log('submitValidMessage fired!');
//       submitMessage(chatText, selectedChat);
//       // setChatText('');
//       document.getElementById('chattextbox').value = '';
//     }
//   };
//   const userTyping = e => {
//     console.log('user typing');
//     return e.keyCode === 13
//       ? submitValidMessage()
//       : setChatText(e.target.value);
//   };

//   return (
//     <div
//       className={
//         isNotMobile
//           ? classes.chatTextBoxContainer
//           : classes.chatTextBoxContainerMobile
//       }
//     >
//       <TextField
//         onKeyUp={e => userTyping(e)}
//         id="chattextbox"
//         // className={classes.chatTextBoxDark}
//         onFocus={() => messageRead(selectedChat)}
//         placeholder="Type your message"
//         // InputProps={{
//         //   className: userInfo.darkModeStatus
//         //     ? classes.chatTextBoxDark
//         //     : classes.chatTextBox,
//         // }}
//       />
//       <Send onClick={() => submitValidMessage()} className={classes.sendBtn} />
//     </div>
//   );
// };

// ChatTextbox.propTypes = {
//   submitMessage: PropTypes.func,
//   selectedChat: PropTypes.number,
//   messageRead: PropTypes.func,
//   userInfo: PropTypes.object,
// };

//--------------
import React, { useState, useEffect } from 'react';

import { useMediaQuery } from 'react-responsive';
import { TextField } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { messageValid } from '../lib/util';

const useStyles = makeStyles({
  sendBtn: {
    color: '#227092',
    paddingTop: '16px',
    textShadow: '0 0 20px #227092',
    '&:hover': {
      color: '#0069d9',
      borderColor: '#0062cc',
      textShadow: '0 0 30px red',
    },
  },

  chatTextBoxContainer: {
    height: '65px',
    position: 'absolute',
    bottom: 0,
    left: '300px',
    boxSizing: 'border-box',
    overflow: 'auto',
    width: 'calc(100% - 300px)',
  },
  chatTextBoxContainerDark: {
    border: '0.5px solid black',
    backgroundColor: '#3D3D3D',
    height: '65px',
    position: 'absolute',
    bottom: 0,
    left: '300px',
    boxSizing: 'border-box',
    overflow: 'auto',
    width: 'calc(100% - 300px)',
    color: 'white',
  },

  chatTextBox: {
    width: 'calc(100% - 60px)',
    paddingTop: '8px',
    paddingLeft: '16px',
  },
  chatTextBoxDark: {
    width: 'calc(100% - 60px)',
    paddingTop: '8px',
    paddingLeft: '16px',
    color: 'white',
    borderBottom: '2px solid #E3E3E3',
    '&:focus': {
      borderBottom: '2px solid red',
    },
  },

  chatTextBoxContainerMobileDark: {
    border: '0.5px solid black',
    backgroundColor: '#3D3D3D',
    height: '65px',
    position: 'absolute',
    bottom: 0,
    left: '100px',
    boxSizing: 'border-box',
    overflow: 'auto',
    width: 'calc(100% - 120px)',
    color: 'white',
  },

  chatTextBoxContainerMobile: {
    position: 'absolute',
    height: '65px',
    bottom: 0,
    left: '100px',
    boxSizing: 'border-box',
    overflow: 'auto',
    width: 'calc(100% - 120px)',
  },
});

export const ChatTextbox = ({
  submitMessage,
  selectedChat,
  messageRead,
  userInfo,
}) => {
  const isNotMobile = useMediaQuery({ minWidth: 650 });
  const classes = useStyles();

  const [chatText, setChatText] = useState('');
  const [contentStyle, setContentStyle] = useState(classes.content);

  const submitValidMessage = () => {
    if (messageValid(chatText)) {
      console.log('submitValidMessage fired!');
      submitMessage(chatText, selectedChat);
      document.getElementById('chattextbox').value = '';
    }
  };
  const userTyping = e => {
    console.log('user typing');
    return e.keyCode === 13
      ? submitValidMessage()
      : setChatText(e.target.value);
  };

  useEffect(() => {
    if (userInfo.darkModeStatus && isNotMobile) {
      setContentStyle(classes.chatTextBoxContainerDark);
    } else if (userInfo.darkModeStatus && !isNotMobile) {
      setContentStyle(classes.chatTextBoxContainerMobileDark);
    } else if (!userInfo.darkModeStatus && !isNotMobile) {
      setContentStyle(classes.chatTextBoxContainerMobile);
    } else {
      setContentStyle(classes.chatTextBoxContainer);
    }
    // console.log(contentStyle);
  }, [
    classes.chatTextBoxContainer,
    classes.chatTextBoxContainerDark,
    classes.chatTextBoxContainerMobile,
    classes.chatTextBoxContainerMobileDark,
    isNotMobile,
    userInfo.darkModeStatus,
  ]);

  return (
    <div
      className={contentStyle}
      // isNotMobile
      //   ? classes.chatTextBoxContainer
      //   : classes.chatTextBoxContainerMobile
      // userInfo.darkModeStatus
      //   ? classes.chatTextBoxContainerDark
      //   : classes.chatTextBoxContainer
      // }
    >
      <TextField
        onKeyUp={e => userTyping(e)}
        id="chattextbox"
        className={classes.chatTextBox}
        onFocus={() => messageRead(selectedChat)}
        placeholder="Type your message"
        InputProps={{
          className: userInfo.darkModeStatus
            ? classes.chatTextBoxDark
            : classes.chatTextBox,
        }}
      />
      <Send
        onClick={() => submitValidMessage()}
        className={classes.sendBtn}
        fontSize="large"
        InputProps={{
          className: classes.sendBtn,
        }}
      />
    </div>
    // <div
    //   style={{
    //     backgroundColor: 'red',
    //     position: 'absolute',
    //     bottom: 0,
    //     left: '300px',
    //     zIndex: 2,
    //     width: 'calc(100% - 300px)',
    //     height: '65px',
    //     // textAlign: 'center',
    //     // width: 'calc(100% - 50px)',
    //   }}
    // >
    //   <TextField
    //     onKeyUp={e => userTyping(e)}
    //     id="chattextbox"
    //     // className={classes.chatTextBox}
    //     onFocus={() => messageRead(selectedChat)}
    //     placeholder="Type your message"
    //     // style={{ padding: '15px 0 5px 10px' }}
    //     style={{ paddingTop: '16px' }}
    //     // style={{ position: 'absolute', top: 'calc(50% - 16px)' }}
    //     // style={{ textAlign: 'center' }}
    //     // style={{ width: 'calc(100% - 50px)' }}
    //   />
    //   <Send onClick={() => submitValidMessage()} className={classes.sendBtn} />
    // </div>
  );
};

// height 65px for chatbox

ChatTextbox.propTypes = {
  submitMessage: PropTypes.func,
  selectedChat: PropTypes.number,
  messageRead: PropTypes.func,
  userInfo: PropTypes.object,
};
