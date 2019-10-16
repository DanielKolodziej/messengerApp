import React, { useState, useEffect, useCallback } from 'react';
import { useMediaQuery } from 'react-responsive';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Proptypes from 'prop-types';
import { ChatList } from './ChatList';
import { ChatView } from './ChatView';
import { ChatTextbox } from './ChatTextbox';
import { NewChat } from './NewChat';

const firebase = require('firebase');

const useStyles = makeStyles({
  signOutBtn: {
    position: 'absolute',
    bottom: '0px',
    left: '0px',
    width: '300px',
    borderRadius: '0px',
    backgroundColor: '#227092',
    height: '35px',
    boxShadow: '0px 0px 2px black',
    color: 'white',
    '&:hover': {
      backgroundColor: '#0069d9',
      borderColor: '#0062cc',
      boxShadow: '0px 0px 10px black',
    },
  },
  signOutBtnMobile: {
    position: 'absolute',
    bottom: '0px',
    left: '0px',
    width: '100px',
    borderRadius: '0px',
    backgroundColor: '#227092',
    height: '35px',
    boxShadow: '0px 0px 2px black',
    color: 'white',
    '&:hover': {
      backgroundColor: '#0069d9',
      borderColor: '#0062cc',
      boxShadow: '0px 0px 10px black',
    },
  },
});

export const Dashboard = ({ history }) => {
  const isNotMobile = useMediaQuery({ minWidth: 650 });
  const classes = useStyles();

  const [selectedChat, setSelectedChat] = useState(null);
  const [newChatFormVisible, setNewChatFormVisible] = useState(false);
  const [email, setEmail] = useState(null);
  const [chats, setChats] = useState([]);

  // useEffect(() => {
  //     console.log('selectedChat is:', selectedChat);
  //     console.log('chats[selectedChat] is:', chats[selectedChat]);
  // }, [selectedChat, chats])

  const newChatBtnClicked = () => {
    setNewChatFormVisible(true);
    setSelectedChat(null);
    console.log('newChatBtnClicked fired!');
  };

  // const buildDocKey = useCallback(friend => [email, friend].sort().join(';'), [
  //   email,
  // ]);
  const buildDocKey = friend => [email, friend].sort().join(';');

  const clickedMessageWhereNotSender = chatIndex =>
    chats[chatIndex].messages[chats[chatIndex].messages.length - 1].sender !==
    email;

  const messageRead = () => {
    // ---HAVING ISSUE WITH selectedChat state being call as null---
    // one render behind

    // if statment to check for not null -> bypass the above issue
    if (selectedChat != null) {
      console.log('currently.....', selectedChat);
      const docKey = buildDocKey(
        chats[selectedChat].users.filter(_usr => _usr !== email)[0]
      );

      if (clickedMessageWhereNotSender(selectedChat)) {
        firebase
          .firestore()
          .collection('chats')
          .doc(docKey)
          .update({ receiverHasRead: true });
      } else {
        console.log('Clicked message where the user was the sender');
      }
    } else {
      console.log('selectedChat is null and hasnt updated for some reason.');
    }
  };

  // useEffect for messageRead functionality
  // useEffect(() => {
  //   const clickedMessageWhereNotSender = chatIndex =>
  //     chats[chatIndex].messages[chats[chatIndex].messages.length - 1].sender !==
  //     email;

  //   if (selectedChat != null) {
  //     console.log('currently.....', selectedChat);
  //     const docKey = buildDocKey(
  //       chats[selectedChat].users.filter(_usr => _usr !== email)[0]
  //     );

  //     if (clickedMessageWhereNotSender(selectedChat)) {
  //       firebase
  //         .firestore()
  //         .collection('chats')
  //         .doc(docKey)
  //         .update({ receiverHasRead: true });
  //     } else {
  //       console.log('Clicked message where the user was the sender');
  //     }
  //   } else {
  //     console.log('selectedChat is null and hasnt updated for some reason.');
  //   }
  // }, [buildDocKey, chats, selectedChat, email]);

  const selectChat = chatIndex => {
    console.log('selectedChat fired!');
    console.log('chatIndex in selectChat', chatIndex);
    // console.log('selectedChat state', selectedChat);
    setSelectedChat(chatIndex);

    setNewChatFormVisible(false);
    messageRead();
  };

  const signOut = () => {
    firebase.auth().signOut();
  };

  const submitMessage = msg => {
    console.log('submitMessage Fired!');
    if (selectedChat != null) {
      const docKey = buildDocKey(
        chats[selectedChat].users.filter(_usr => _usr !== email)[0]
      );

      firebase
        .firestore()
        .collection('chats')
        .doc(docKey)
        .update({
          messages: firebase.firestore.FieldValue.arrayUnion({
            sender: email,
            message: msg,
            timestamp: Date.now(),
          }),
          receiverHasRead: false,
        });
    } else {
      console.log('selectedChat is null');
    }
  };

  // useEffect for submit message
  // useEffect(()=>{
  //   console.log('useeffeect for submitMessage Fired!');
  //   if (selectedChat != null) {
  //     const docKey = buildDocKey(
  //       chats[selectedChat].users.filter(_usr => _usr !== email)[0]
  //     );

  //     firebase
  //       .firestore()
  //       .collection('chats')
  //       .doc(docKey)
  //       .update({
  //         messages: firebase.firestore.FieldValue.arrayUnion({
  //           sender: email,
  //           message: msg,
  //           timestamp: Date.now(),
  //         }),
  //         receiverHasRead: false,
  //       });
  //   } else {
  //     console.log('selectedChat is null');
  //   }
  // })

  const goToChat = async (docKey, msg) => {
    console.log('goToChat fired!');
    const usersInChat = docKey.split(';');
    console.log('users in chat', usersInChat);
    const specificChat = chats.find(_chat =>
      usersInChat.every(_user => _chat.users.includes(_user))
    );
    console.log('All existant chats between user and others', chats);
    console.log(
      'Existant chat between user and specific receiver',
      specificChat
    );
    console.log(
      'Index of the specific chat from all chats',
      chats.indexOf(specificChat)
    );
    console.log('message that will be sent', msg);
    setNewChatFormVisible(false);

    // await
    await selectChat(chats.indexOf(specificChat));
    console.log('goToChat index', chats.indexOf(specificChat));
    //--------------------------
    console.log('submitMessage called!');
    submitMessage(msg);
  };

  const newChatSubmit = async chatObj => {
    console.log('newChatSubmit fired!');
    console.log('chatObj passed in', chatObj);
    const docKey = buildDocKey(chatObj.sendTo);
    console.log('docKey in newChatSubmit', docKey);
    await firebase
      .firestore()
      .collection('chats')
      .doc(docKey)
      .set({
        receiverHasRead: false,
        users: [email, chatObj.sendTo],
        messages: [
          {
            message: chatObj.message,
            sender: email,
          },
        ],
      });
    setNewChatFormVisible(false);
    selectChat(chats.length - 1);
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async _user => {
      if (!_user) {
        history.push('/login');
      } else {
        await firebase
          .firestore()
          .collection('chats')
          .where('users', 'array-contains', _user.email)
          .onSnapshot(async res => {
            const chatsMap = res.docs.map(_doc => _doc.data());
            console.log('res:', res.docs);
            await setEmail(_user.email);
            await setChats(chatsMap);
          });
      }
    });

    return function cleanup() {
      console.log('cleaned up');
    };
  }, [history]);
  // selectedChat added as dependency for change in order to trigger a rerender and work correctly???

  if (email) {
    return (
      <div id="dashboard-container">
        <ChatList
          history={history}
          newChatBtnClicked={newChatBtnClicked}
          selectChat={selectChat}
          chats={chats}
          userEmail={email}
          selectedChat={selectedChat}
          buildDocKey={buildDocKey}
          // messageRead={messageRead}
        />
        {newChatFormVisible ? null : (
          <ChatView user={email} chat={chats[selectedChat]} />
        )}
        {selectedChat !== null && !newChatFormVisible ? (
          <ChatTextbox
            submitMessage={submitMessage}
            // messageRead={messageRead}
          />
        ) : null}
        {newChatFormVisible ? (
          <NewChat
            sender={email}
            goToChat={goToChat}
            newChatSubmit={newChatSubmit}
          />
        ) : null}
        {isNotMobile ? (
          <Button onClick={() => signOut()} className={classes.signOutBtn}>
            {email.split('@')[0]}, Sign Out
          </Button>
        ) : (
          <Button
            onClick={() => signOut()}
            className={classes.signOutBtnMobile}
          >
            <MeetingRoomIcon />
            <ArrowBackIcon fontSize="small" />
          </Button>
        )}
      </div>
    );
  }
  return <div>Loading...</div>;
};

Dashboard.propTypes = {
  history: Proptypes.object,
};
