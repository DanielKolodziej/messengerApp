import React, { useState, useEffect } from 'react'

import { ChatList } from './ChatList';
import { ChatView } from './ChatView';
import { ChatTextbox } from './ChatTextbox';

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

    const newChatBtnClicked = () => {
        setNewChatFormVisible(true);
        setSelectedChat(null);
    }

    const selectChat = (chatIndex) => {
        setSelectedChat(chatIndex)
    }

    const signOut = () => {
        firebase.auth().signOut();
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
    }, []);

    return (
        <div>
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
            {/* <ChatTextbox /> some */}
            <Button onClick={signOut} className={classes.signOutBtn}>Sign Out</Button>
        </div>
    )
}