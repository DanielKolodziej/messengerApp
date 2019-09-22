import React from 'react';

import { TextField } from '@material-ui/core';
import { Send } from '@material-ui/core';
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

export const ChatTextbox = () => {

    const classes = useStyles();

    return (
        <div className={classes.chatTextBoxContainer}>
            chattextbox
        </div>
    )
}