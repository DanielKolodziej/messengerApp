import React, { useState, useEffect } from 'react'

import { ChatList } from './ChatList';

const firebase = require('firebase');

export const Dashboard = ({ history }) => {

    const [selectedChat, setSelectedChat] = useState(null);
    const [newChatFormVisible, setNewChatFormVisible] = useState(false);
    const [email, setEmail] = useState(null);
    const [chats, setChats] = useState([]);

    const newChatBtnClicked = () => {
        console.log('new chat btn clicked');
        setNewChatFormVisible(true);
        setSelectedChat(null);
    }

    const selectChat = (chatIndex) => {
        console.log('selected a chat', chatIndex);
    }

    useEffect(()=>{
        firebase.auth().onAuthStateChanged(async (_user) =>{
            if(!_user){
                history.push('/login')
            } else {
                await firebase
                    .firestore()
                    .collection('chats')
                    .where('users', 'array-contains', _user.email)
                    .onSnapshot(async (res)=> {
                        const chatsMap = res.docs.map(_doc => _doc.data());
                        console.log('res:',res.docs);
                        await setEmail(_user.email);
                        await setChats(chatsMap);
                    })
            }
        })
    }, []);

    return (
        <div>
            Dashboard
            <ChatList 
                history={history}
                newChatBtnFn={newChatBtnClicked}
                selectChatFn={selectChat}
                chats={chats}
                userEmail={email}
                selectedChatIndex={selectedChat}/>
        </div>
    )
}