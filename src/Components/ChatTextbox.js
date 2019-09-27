import React, { useState } from 'react';

import { TextField } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    sendBtn: {
        color: 'blue',
        cursor: 'pointer',
        '&:hover': {
            color: 'gray'
        }
    },

    chatTextBoxContainer: {
        position: 'absolute',
        bottom: '15px',
        left: '315px',
        boxSizing: 'border-box',
        overflow: 'auto',
        width: 'calc(100% - 300px - 50px)'
    },

    chatTextBox: {
        width: 'calc(100% - 25px)'
    }

});

export const ChatTextbox = (props) => {

    const classes = useStyles();

    const [chatText, setChatText] = useState('')

    const userTyping = (e) => {
        console.log('user typing');
        e.keyCode === 13 ? submitMessage() :
        setChatText(e.target.value);
    }
    const userClickedInput = () => {
        console.log('clicked input');
        props.messageReadFn();
    }
    const messageValid = (txt) => {
        return txt && txt.replace(/\s/g, '').length;
    }
    const submitMessage = () => {
        if(messageValid(chatText)){
            console.log('submit');
            props.submitMessageFn(chatText)
            document.getElementById('chattextbox').value = '';
        }
    }
    return (
        <div className={classes.chatTextBoxContainer}>
            <TextField 
                onKeyUp={(e)=> userTyping(e)}
                id='chattextbox'
                className={classes.chatTextBox}
                onFocus={userClickedInput}
                placeholder="Type your message"/>
            <Send onClick={submitMessage} className={classes.sendBtn}/>
        </div>
    )
}