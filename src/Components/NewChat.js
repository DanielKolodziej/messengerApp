import React, { useState } from 'react';
import { FormControl, InputLabel, Input, Button, Paper, CssBaseline, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const firebase = require("firebase");

const useStyles = makeStyles(theme => ({
    main: {
      width: 'auto',
      display: 'block', // Fix IE 11 issue.
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
        width: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    paper: {
      padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
      position: 'absolute',
      width: '350px',
      top: '50px',
      left: 'calc(50% + 150px - 175px)'
    },
    input: {
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(),
    },
    submit: {
      marginTop: theme.spacing(3),
    },
    errorText: {
      color: 'red',
      textAlign: 'center'
    }
  }));

export const NewChat = (props) => {

    const classes = useStyles();

    const [username, setUsername] = useState(null);
    const [message, setMessage] = useState(null);

    const userTyping = (type, e) => {
        switch (type) {
            case 'username':
                setUsername(e.target.value);
                break;
            case 'message':
                setMessage(e.target.value)
                break;
            default:
                break;
        }
    }

    const userExists = async () => {
        const usersSnapshot = await firebase
            .firestore()
            .collection('users')
            .get();
        const exists = usersSnapshot
            .docs
            .map(_doc => _doc.data().email)
            .includes(username);
        // setSer
        return exists;
    }
    const buildDocKey = () => {
        return [firebase.auth().currentUser.email, username].sort().join(';');
    }
    const chatExists = async () => {
        const docKey = buildDocKey();
        const chat = await firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .get()
        console.log(chat.exists);
        return chat.exists;
    }

    const createChat = () => {
        props.newChatSubmitFn({
            sendTo: username,
            message: message
        })
    }
    const goToChat = () => {
        props.goToChatFn(buildDocKey(), message);
    }

    const submitNewChat = async (e) => {
        e.preventDefault();
        const user = await userExists();
        if (user){
            const chatExist = await chatExists();
            chatExist ? goToChat() : createChat();
        }
    }

    return (
        <main className={classes.main}>
            <CssBaseline/>
            <Paper className={classes.paper}>
                <Typography component='h1' variant='h5'>Send a Message</Typography>
                <form onSubmit={(e) => submitNewChat(e)} className={classes.form}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor='new-chat-username'>
                            Enter your friend's email
                        </InputLabel>
                        <Input required 
                            className={classes.input}
                            autoFocus
                            onChange={(e) => userTyping('username', e)}
                            id='new-chat-username'/>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel htmlFor='new-chat-message'>
                            Enter your message
                        </InputLabel>
                        <Input required className={classes.input}
                            onChange={(e) => userTyping('message', e)}
                            id='new-chat-message'/>
                    </FormControl>
                    <Button fullWidth 
                        className={classes.submit} 
                        variant='contained'
                        color='primary'
                        type='submit'>Send</Button>
                </form>
            </Paper>
        </main>
    )
  }