import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import moment from 'moment';
import Proptypes from 'prop-types';
import { ChatList } from './ChatList';
import { ChatView } from './ChatView';
import { ChatTextbox } from './ChatTextbox';
import { NewChat } from './NewChat';
import { clickedMessageWhereNotSender, buildDocKey } from '../lib/util';

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
  // -------------------temp
  chatHeader: {
    width: 'calc(100% - 301px)',
    height: '36px',
    backgroundColor: '#344195',
    // position: 'fixed',
    marginLeft: '301px',
    fontSize: '18px',
    textAlign: 'center',
    color: 'white',
    paddingTop: '10px',
    boxSizing: 'border-box',
  },
  chatHeaderMobile: {
    width: 'calc(100% - 101px)',
    height: '36px',
    backgroundColor: '#344195',
    // position: 'fixed',
    marginLeft: '101px',
    fontSize: '18px',
    textAlign: 'center',
    color: 'white',
    paddingTop: '10px',
    boxSizing: 'border-box',
  },
});

export const Dashboard = ({ history }) => {
  const isNotMobile = useMediaQuery({ minWidth: 650 });
  const classes = useStyles();

  const [selectedChat, setSelectedChat] = useState(null);
  const [newChatFormVisible, setNewChatFormVisible] = useState(false);
  const [email, setEmail] = useState(null);
  const [chats, setChats] = useState([]);

  const newChatBtnClicked = () => {
    setNewChatFormVisible(true);
    setSelectedChat(null);
    console.log('newChatBtnClicked fired!');
  };

  // const buildDocKey = friend => [email, friend].sort().join(';');

  const messageRead = ind => {
    const docKey = buildDocKey(
      email,
      chats[ind].users.filter(_usr => _usr !== email)[0]
    );

    if (clickedMessageWhereNotSender(ind, chats, email)) {
      firebase
        .firestore()
        .collection('chats')
        .doc(docKey)
        .update({ receiverHasRead: true });
    } else {
      console.log('Clicked message where the user was the sender');
    }
  };

  const selectChat = chatIndex => {
    console.log('selectedChat fired!');
    console.log('chatIndex in selectChat', chatIndex);
    setSelectedChat(chatIndex);

    setNewChatFormVisible(false);
    messageRead(chatIndex);
  };

  const signOut = () => {
    firebase.auth().signOut();
  };

  const submitMessage = (msg, ind) => {
    console.log('submitMessage Fired!');
    const docKey = buildDocKey(
      email,
      chats[ind].users.filter(_usr => _usr !== email)[0]
    );

    firebase
      .firestore()
      .collection('chats')
      .doc(docKey)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          sender: email,
          message: msg,
          timestamp: moment().format('MMM Do YYYY, h:mm:ss a'),
          // Date().substring(16, 24), current time
          // Date().substring(4, 11), month day
        }),
        receiverHasRead: false,
      });
  };

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

    await selectChat(chats.indexOf(specificChat));
    console.log('goToChat index', chats.indexOf(specificChat));
    //--------------------------
    console.log('submitMessage called!');
    submitMessage(msg, chats.indexOf(specificChat));
  };

  const newChatSubmit = async chatObj => {
    console.log('newChatSubmit fired!');
    console.log('chatObj passed in', chatObj);
    const docKey = buildDocKey(email, chatObj.sendTo);
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
            timestamp: chatObj.timestamp,
          },
        ],
      });
    setNewChatFormVisible(false);
    const arr2 = chats;
    arr2.push({
      receiverHasRead: false,
      users: [email, chatObj.sendTo],
      messages: [
        {
          message: chatObj.message,
          sender: email,
          timestamp: chatObj.timestamp,
        },
      ],
    });
    const idArr = arr2.map(_chat => _chat.users.sort().join(';'));
    selectChat(idArr.sort().indexOf(docKey));
  };

  useEffect(() => {
    let unsubscribeSnapshot;
    const unsubscribeAuth = firebase.auth().onAuthStateChanged(_user => {
      // you're not dealing with promises but streams so async/await is not needed here
      if (!_user) {
        history.push('/login');
      } else {
        unsubscribeSnapshot = firebase
          .firestore()
          .collection('chats')
          .where('users', 'array-contains', _user.email)
          .onSnapshot(res => {
            const chatsMap = res.docs.map(_doc => _doc.data());
            console.log('res:', res.docs);
            setEmail(_user.email);
            setChats(chatsMap);
          });
      }
    });

    return () => {
      unsubscribeAuth();
      // eslint-disable-next-line no-unused-expressions
      unsubscribeSnapshot && unsubscribeSnapshot();
    };
  }, [history]); // setters are stable between renders so you don't have to put them here

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
        />
        {/* temp */}

        <div
          className={
            isNotMobile ? classes.chatHeader : classes.chatHeaderMobile
          }
        >
          {chats[selectedChat]
            ? `Your conversation with
          ${chats[selectedChat].users.filter(_usr => _usr !== email)[0]}`
            : `No chat selected...`}
        </div>

        {/* temp */}
        {newChatFormVisible ? null : (
          <ChatView user={email} chat={chats[selectedChat]} />
        )}
        {/* {newChatFormVisible ? null : selectedChat ? (
          <ChatView user={email} chat={chats[selectedChat]} />
        ) : (
          <div>Select a message from the ChatList!</div>
        )} */}
        {chats[selectedChat] && !newChatFormVisible ? (
          <ChatTextbox
            submitMessage={submitMessage}
            selectedChat={selectedChat}
            messageRead={messageRead}
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
