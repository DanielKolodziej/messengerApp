import React, { useState, useEffect } from 'react'

import { ChatList } from './ChatList';
import { ChatView } from './ChatView';
import { ChatTextbox } from './ChatTextbox';
import { NewChat } from './NewChat';

import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

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
    }
});

export const Dashboard = ({ history }) => {

    const classes = useStyles();

    const [selectedChat, setSelectedChat] = useState(null);
    const [newChatFormVisible, setNewChatFormVisible] = useState(false);
    const [email, setEmail] = useState(null);
    const [chats, setChats] = useState([]);

    const selectChat = async (chatIndex) => {
        // console.log(chatIndex)
        await setSelectedChat(chatIndex);
        await setNewChatFormVisible(false);
        messageRead(chatIndex);
    }

    const newChatBtnClicked = () => {
        // setNewChatFormVisible(true);
        // setSelectedChat(null);
    }
    
    const buildDocKey = (friend) => {
        return [email, friend].sort().join(';');
    }

    const clickedMessageWhereNotSender = (chatIndex) => {
        return chats[chatIndex].messages[chats[chatIndex].messages.length - 1].sender !== email;
    }
    const messageRead = (index) => {
        // ---HAVING ISSUE WITH selectedChat state!!!---
        
        const docKey = buildDocKey(chats[index].users.filter(_usr => _usr !== email)[0]);
        console.log('docKey', docKey);
        if(clickedMessageWhereNotSender(index)) {
          firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .update({ receiverHasRead: true });
        } else {
          console.log('Clicked message where the user was the sender');
        }
    }

    const signOut = () => {
        firebase.auth().signOut();
    }

    const submitMessage = (msg) => {
        const docKey = buildDocKey(chats[selectedChat]
            .users.filter(_usr => _usr !== email)[0]);
        
        firebase   
            .firestore()
            .collection('chats')
            .doc(docKey)
            .update({
                messages: firebase.firestore.FieldValue.arrayUnion({
                  sender: email,
                  message: msg,
                  timestamp: Date.now()
                }),
                receiverHasRead: false
            });
    }
    const goToChat = async (docKey, msg) => {
        const usersInChat = docKey.split(';');
        const chat = chats.find(_chat => usersInChat.every(_user => _chat.users.includes(_user)));
        setNewChatFormVisible(false);
        await selectChat(chats.indexOf(chat));
        submitMessage(msg);
    }

    const newChatSubmit = async (chatObj) => {
        const docKey = buildDocKey(chatObj.sendTo);
        await firebase  
            .firestore()
            .collection('chats')
            .doc(docKey)
            .set({
                receiverHasRead: false,
                users: [email, chatObj.sendTo],
                messages: [{
                    message: chatObj.message,
                    sender: email
                }]
            })
        setNewChatFormVisible(false);
        selectChat(chats.length - 1);
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged(async (_user) => {
            if (!_user) {
                history.push('/login')
            } else {
                await firebase
                    .firestore()
                    .collection('chats')
                    .where('users', 'array-contains', _user.email)
                    .onSnapshot(async (res) => {
                        const chatsMap = res.docs.map(_doc => _doc.data());
                        console.log('res:', res.docs);
                        await setEmail(_user.email);
                        await setChats(chatsMap);
                    })
            }
        })
    }, [history]);

    useEffect(() => {
        return () => {
        //   console.log('newChatFormVisible', newChatFormVisible);
        //   console.log('selectedChat', selectedChat);
          console.log("cleaned up");
        };
      }, []);

    if (email){
        // console.log(newChatFormVisible);
        return (
            <div id='dashboard-container'>
                <ChatList
                    history={history}
                    newChatBtnFn={newChatBtnClicked}
                    selectChatFn={selectChat}
                    chats={chats}
                    userEmail={email}
                    selectedChatIndex={selectedChat} />
                {
                    newChatFormVisible ?
                        null :
                        <ChatView
                            user={email}
                            chat={chats[selectedChat]} />
                }
                {
                    selectedChat !== null && !newChatFormVisible ?
                    <ChatTextbox submitMessageFn={submitMessage}
                        messageReadFn={messageRead}/> :
                    null
                }
                {
                    newChatFormVisible ? 
                    <NewChat goToChatFn={goToChat} 
                        newChatSubmitFn={newChatSubmit}/> :
                    null
                }
                <Button onClick={signOut} className={classes.signOutBtn}>Sign Out</Button>
            </div>
        )
    } else {
        return(
            <div>Loading...</div>
        )
    }
}