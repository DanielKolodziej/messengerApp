import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  Button,
  ListItemIcon,
} from '@material-ui/core';

import { NotificationImportant } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    height: 'calc(100% - 35px)',
    position: 'absolute',
    left: '0',
    width: '300px',
    boxShadow: '0px 0px 2px black',
  },
  listItem: {
    cursor: 'pointer',
  },
  newChatBtn: {
    borderRadius: '0px',
  },
  unreadMessage: {
    color: 'red',
    position: 'absolute',
    top: '0',
    right: '5px',
  },
  del: {
    color: 'gray',
    position: 'absolute',
    bottom: '0',
    right: '5px',
    '&:hover': {
      color: 'red',
    },
  },
}));

const firebase = require('firebase');

export const ChatList = ({
  chats,
  userEmail,
  newChatBtnClicked,
  selectChat,
  selectedChat,
}) => {
  const classes = useStyles();

  const randoColor = () => Math.floor(Math.random() * Math.floor(255));

  // useEffect(()=> {
  //   console.log('selectedChat from ChatList: ',props.selectedChat);
  //   if (props.selectedChat !== null){
  //     props.selectChat(props.selectedChat);
  //   }
  // }, [props, props.selectedChat])

  //-----------------------

  const deleteItem = () => {
    console.log('deleteItem fired!');
    const conf = window.confirm('Are you sure you want to delete this chat?');
    // const docKey = props.buildDocKey(props.chats[props.selectedChat].users.filter(_usr => _usr !== props.email)[0]);
    // console.log(docKey);
    // console.log(props.email);
    if (conf) {
      firebase
        .firestore()
        .collection('chats')
        .doc('fake@person.com;qwe@qwe.com') // hard coded for now....needs to get docKey
        .delete();
      console.log('item deleted...');
    }
  };

  const userIsSender = chat =>
    chat.messages[chat.messages.length - 1].sender === userEmail;

  if (chats.length > 0) {
    return (
      <main className={classes.root}>
        <Button
          onClick={() => newChatBtnClicked()}
          className={classes.newChatBtn}
          variant="contained"
          fullWidth
          color="primary"
        >
          New Message
        </Button>
        <List>
          {chats.map((_chat, _index) => (
            <div key={_index}>
              <ListItem
                onClick={() => selectChat(_index)}
                className={classes.listItem}
                selected={selectedChat === _index}
                alignItems="flex-start"
              >
                <ListItemAvatar>
                  <Avatar
                    style={{
                      background: `rgb(${randoColor},${randoColor},${randoColor})`,
                    }}
                    alt="Remy Sharp"
                  >
                    {
                      _chat.users
                        .filter(_user => _user !== userEmail)[0]
                        .split('')[0]
                    }
                  </Avatar>
                </ListItemAvatar>
                <ListItemIcon>
                  <DeleteIcon
                    onClick={() => deleteItem()}
                    className={classes.del}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={_chat.users.filter(_user => _user !== userEmail)[0]}
                  secondary={
                    <>
                      <Typography component="span" color="textPrimary">
                        {`${_chat.messages[
                          _chat.messages.length - 1
                        ].message.substring(0, 30)} ...`}
                      </Typography>
                    </>
                  }
                />
                {_chat.receiverHasRead === false && !userIsSender(_chat) ? (
                  <ListItemIcon>
                    <NotificationImportant className={classes.unreadMessage} />
                  </ListItemIcon>
                ) : null}
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </main>
    );
  }
  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        fullWidth
        color="primary"
        onClick={() => newChatBtnClicked()}
        className={classes.newChatBtn}
      >
        New Message
      </Button>
      <List />
    </div>
  );
};

ChatList.propTypes = {
  chats: PropTypes.array,
  userEmail: PropTypes.string,
  selectChat: PropTypes.func,
  selectedChat: PropTypes.number,
  newChatBtnClicked: PropTypes.func,
};
