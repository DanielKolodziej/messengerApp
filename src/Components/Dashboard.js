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

    const selectChat = (chatIndex) => {
        console.log('selectedChat fired!');
        console.log('chatIndex in selectChat', chatIndex)
        setSelectedChat(chatIndex);
        messageRead();
        setNewChatFormVisible(false);
    }

    // useEffect(() => {
    //     console.log('selectedChat is:', selectedChat);
    //     console.log('chats[selectedChat] is:', chats[selectedChat]);
    // }, [selectedChat, chats])


    const newChatBtnClicked = () => {
        setNewChatFormVisible(true);
        // setSelectedChat(null);
        console.log('newChatBtnClicked fired!');
    }

    const buildDocKey = (friend) => {
        return [email, friend].sort().join(';');
    }

    const clickedMessageWhereNotSender = (chatIndex) => {
        return chats[chatIndex].messages[chats[chatIndex].messages.length - 1].sender !== email;
    }

    const messageRead = () => {
        // ---HAVING ISSUE WITH selectedChat state being call as null---
        // one render behind

        //if statment to check for not null -> bypass the above issue
        if (selectedChat != null){
            console.log('currently.....',selectedChat)
            const docKey = buildDocKey(chats[selectedChat].users.filter(_usr => _usr !== email)[0]);
        
            if(clickedMessageWhereNotSender(selectedChat)) {
            firebase
                .firestore()
                .collection('chats')
                .doc(docKey)
                .update({ receiverHasRead: true });
                } else {
                console.log('Clicked message where the user was the sender');
            }
        } else {
            console.log('selectedChat is null and hasnt updated for some reason.')
        }
        // const docKey = buildDocKey(chats[selectedChat].users.filter(_usr => _usr !== email)[0]);
        // // // console.log('docKey', docKey);
        // if(clickedMessageWhereNotSender(selectedChat)) {
        //   firebase
        //     .firestore()
        //     .collection('chats')
        //     .doc(docKey)
        //     .update({ receiverHasRead: true });
        // } else {
        //   console.log('Clicked message where the user was the sender');
        // }
    }

    const signOut = () => {
        firebase.auth().signOut();
    }

    const submitMessage = (msg) => {
        console.log('submitMessage Fired!');
        if (selectedChat != null){
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
        } else {
            console.log('selectedChat is null')
        }

        // const docKey = buildDocKey(chats[selectedChat]
        //     .users.filter(_usr => _usr !== email)[0]);

        // firebase
        //     .firestore()
        //     .collection('chats')
        //     .doc(docKey)
        //     .update({
        //         messages: firebase.firestore.FieldValue.arrayUnion({
        //             sender: email,
        //             message: msg,
        //             timestamp: Date.now()
        //         }),
        //         receiverHasRead: false
        //     });
    }
    const goToChat = async (docKey, msg) => {
        console.log('goToChat fired!');
        const usersInChat = docKey.split(';');
        console.log('users in chat',usersInChat)
        const specificChat = chats.find(_chat => usersInChat.every(_user => _chat.users.includes(_user)));
        console.log('All existant chats between user and others',chats);
        console.log('Existant chat between user and specific receiver',specificChat);
        console.log('Index of the specific chat from all chats',chats.indexOf(specificChat));
        console.log('message that will be sent', msg)
        setNewChatFormVisible(false);
        
        // await 
        await selectChat(chats.indexOf(specificChat))
        // await console.log('awaited selectChat(index)')
        //--------------------------
        // console.log('submitMessage called!')
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

        return function cleanup() {
            console.log("cleaned up");
        }
    }, [history]);
    //selectedChat added as dependency for change in order to trigger a rerender and work correctly

    if (email) {
        return (
            <div id='dashboard-container'>
                <ChatList
                    history={history}
                    newChatBtnClicked={newChatBtnClicked}
                    selectChat={selectChat}
                    chats={chats}
                    userEmail={email}
                    selectedChat={selectedChat} />
                {
                    newChatFormVisible ?
                        null :
                        <ChatView
                            user={email}
                            chat={chats[selectedChat]} />
                }
                {
                    selectedChat !== null && !newChatFormVisible ?
                        <ChatTextbox submitMessage={submitMessage}
                            messageRead={messageRead} 
                            /> :
                        null
                }
                {
                    newChatFormVisible ?
                        <NewChat
                            sender={email}
                            goToChat={goToChat}
                            newChatSubmit={newChatSubmit} /> :
                        null
                }
                <Button onClick={() => signOut()} className={classes.signOutBtn}>Sign Out</Button>
            </div>
        )
    } else {
        return (
            <div>Loading...</div>
        )
    }
}