import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { makeStyles } from '@material-ui/core/styles';
import { pulse } from 'react-animations';
import styled, { keyframes } from 'styled-components';
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
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import MessageIcon from '@material-ui/icons/Message';
import CreateIcon from '@material-ui/icons/Create';
import { NotificationImportant } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';
import { randoColor, userIsSender } from '../lib/util';

import { ChatListDetails } from './ChatListDetails';

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
    zIndex: '1',
    '&:hover': {
      color: 'red',
    },
  },
  avatar: {
    textShadow: '2px 2px 4px #000000',
    boxShadow: '2px 2px 4px #000000',
  },
  selfIcon: {
    color: '#3F51B5',
  },
  friendIcon: {
    color: '#9DA1C4',
    transform: 'rotate(180deg)',
  },
  rootMobile: {
    backgroundColor: theme.palette.background.paper,
    height: 'calc(100% - 35px)',
    position: 'absolute',
    left: '0',
    width: '100px',
    boxShadow: '0px 0px 2px black',
  },
  noChat: {
    textAlign: 'center',
  },
}));

const firebase = require('firebase');

// pulse animation
const pulseAnimation = keyframes`${pulse}`;
const PulseDiv = styled.div`
  animation: 3s ${pulseAnimation} infinite;
`;
export const ChatList = ({
  chats,
  userEmail,
  newChatBtnClicked,
  selectChat,
  selectedChat,
  buildDocKey,
}) => {
  const isNotMobile = useMediaQuery({ minWidth: 650 });
  const classes = useStyles();

  const [miniVisible, setMiniVisible] = useState({
    show: false,
    id: null,
    col: null,
  });

  const deleteItem = e => {
    const conf = window.confirm('Are you sure you want to delete this chat?');
    const docKey = buildDocKey(
      userEmail,
      chats[e].users.filter(_usr => _usr !== userEmail)[0]
    );
    if (conf) {
      firebase
        .firestore()
        .collection('chats')
        .doc(docKey)
        .delete();
      console.log('item deleted...');
    }
  };

  if (chats.length > 0) {
    return isNotMobile ? (
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
                    onMouseEnter={() => {
                      setMiniVisible({
                        show: true,
                        id: _index,
                      });
                    }}
                    onMouseLeave={() => {
                      setMiniVisible({
                        show: false,
                        id: null,
                      });
                    }}
                    className={classes.avatar}
                    style={{
                      background: `rgb(${randoColor(70)},${randoColor(
                        70
                      )},${randoColor(255)})`,
                    }}
                    // style={{
                    //   background: `rgb(${miniVisible.col},${miniVisible.col},${miniVisible.col})`,
                    // }}
                    alt="Remy Sharp"
                  >
                    {
                      _chat.users
                        .filter(_user => _user !== userEmail)[0]
                        .split('')[0]
                    }
                  </Avatar>
                </ListItemAvatar>
                {miniVisible.show && miniVisible.id === _index ? (
                  <ChatListDetails
                    receiver={
                      _chat.users.filter(_user => _user !== userEmail)[0]
                    }
                    col={miniVisible.col}
                  />
                ) : null}
                {/* <ListItemText
                  className={classes.time}
                  primary={
                    <Typography fontSize={4}>
                      {_chat.messages[_chat.messages.length - 1].timestamp
                        ? _chat.messages[
                            _chat.messages.length - 1
                          ].timestamp.substring(0, 13)
                        : null}
                    </Typography>
                  }
                /> */}
                <ListItemIcon>
                  <DeleteIcon
                    onClick={e => {
                      e.stopPropagation();
                      deleteItem(_index);
                    }}
                    className={classes.del}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    _chat.users.filter(_user => _user !== userEmail)[0].length >
                    20
                      ? `${_chat.users
                          .filter(_user => _user !== userEmail)[0]
                          .substring(0, 20)}...`
                      : _chat.users.filter(_user => _user !== userEmail)[0]
                  }
                  secondary={
                    <>
                      <DoubleArrowIcon
                        fontSize="small"
                        className={
                          userIsSender(_chat, userEmail)
                            ? classes.selfIcon
                            : classes.friendIcon
                        }
                      />
                      <Typography component="span" color="textPrimary">
                        {_chat.messages[_chat.messages.length - 1].message
                          .length > 10
                          ? `${_chat.messages[
                              _chat.messages.length - 1
                            ].message.substring(0, 8)}...`
                          : _chat.messages[_chat.messages.length - 1].message}
                      </Typography>
                    </>
                  }
                />
                {_chat.receiverHasRead === false &&
                !userIsSender(_chat, userEmail) ? (
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
    ) : (
      // <MobileList>
      <div className={classes.rootMobile}>
        <Button
          onClick={() => newChatBtnClicked()}
          className={classes.newChatBtn}
          variant="contained"
          fullWidth
          color="primary"
        >
          <CreateIcon fontSize="small" />
          <MessageIcon />
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
                    onMouseEnter={() => {
                      setMiniVisible({
                        show: true,
                        id: _index,
                      });
                    }}
                    onMouseLeave={() => {
                      setMiniVisible({
                        show: false,
                        id: null,
                      });
                    }}
                    className={classes.avatar}
                    style={{
                      background: `rgb(${randoColor()},${randoColor()},${randoColor()})`,
                    }}
                    // style={{
                    //   background: `rgb(${miniVisible.col},${miniVisible.col},${miniVisible.col})`,
                    // }}
                    alt="Remy Sharp"
                  >
                    {
                      _chat.users
                        .filter(_user => _user !== userEmail)[0]
                        .split('')[0]
                    }
                  </Avatar>
                </ListItemAvatar>
                {miniVisible.show && miniVisible.id === _index ? (
                  <ChatListDetails
                    receiver={
                      _chat.users.filter(_user => _user !== userEmail)[0]
                    }
                    col={miniVisible.col}
                  />
                ) : null}
                {/* <DoubleArrowIcon
                  fontSize="small"
                  className={
                    userIsSender(_chat) ? classes.selfIcon : classes.friendIcon
                  }
                /> */}
                <ListItemIcon>
                  <DeleteIcon
                    onClick={e => {
                      e.stopPropagation();
                      deleteItem(_index);
                    }}
                    className={classes.del}
                  />
                </ListItemIcon>

                {_chat.receiverHasRead === false &&
                !userIsSender(_chat, userEmail) ? (
                  <ListItemIcon>
                    <NotificationImportant className={classes.unreadMessage} />
                  </ListItemIcon>
                ) : null}
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </div>
    );
    // </MobileList> ;
  }
  return (
    <div className={isNotMobile ? classes.root : classes.rootMobile}>
      <PulseDiv>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          onClick={() => newChatBtnClicked()}
          className={classes.newChatBtn}
        >
          {isNotMobile ? (
            'New Message'
          ) : (
            <>
              <CreateIcon fontSize="small" />
              <MessageIcon />
            </>
          )}
        </Button>
      </PulseDiv>
      <List>
        <ListItemText
          className={classes.noChat}
          secondary="Currently no messages... Click the above button to start a new chat!"
        />
      </List>
    </div>
  );
};

ChatList.propTypes = {
  chats: PropTypes.array,
  userEmail: PropTypes.string,
  selectChat: PropTypes.func,
  selectedChat: PropTypes.number,
  newChatBtnClicked: PropTypes.func,
  buildDocKey: PropTypes.func,
};
