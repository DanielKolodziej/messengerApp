import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List } from '@material-ui/core';
import { ListItem } from '@material-ui/core';
import { ListItemText } from '@material-ui/core';
import { ListItemAvatar } from '@material-ui/core';
import { Avatar } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { Divider } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { ListItemIcon } from '@material-ui/core';
import { NotificationImportant } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    height: 'calc(100% - 35px)',
    position: 'absolute',
    left: '0',
    width: '300px',
    boxShadow: '0px 0px 2px black'
  },
  listItem: {
    cursor: 'pointer'
  },
  newChatBtn: {
    borderRadius: '0px'
  },
  unreadMessage: {
    color: 'red',
    position: 'absolute',
    top: '0',
    right: '5px'
  }
}));

export const ChatList = (props) => {

  const classes = useStyles();

  // useEffect(()=> {
  //   console.log('selectedChat from ChatList: ',props.selectedChat);
  //   if (props.selectedChat !== null){
  //     props.selectChat(props.selectedChat);
  //   }
  // }, [props, props.selectedChat])

  const userIsSender = (chat) => {
    return chat.messages[chat.messages.length - 1].sender === props.userEmail;
  }

  // console.log(props)
  if (props.chats.length > 0) {
    return (
      <main className={classes.root}>
        <Button onClick={() => props.newChatBtnClicked()} className={classes.newChatBtn} variant='contained' fullWidth color='primary'>New Message</Button>
        <List>
          {
            props.chats.map((_chat, _index) => {
              return (
                <div key={_index}>
                  <ListItem
                    onClick={() => props.selectChat(_index)}
                    className={classes.listItem}
                    selected={props.selectedChat === _index}
                    alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp">{_chat.users.filter(_user => _user !== props.userEmail)[0].split('')[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={_chat.users.filter(_user => _user !== props.userEmail)[0]}
                      secondary={
                        <React.Fragment>
                          <Typography component='span'
                            color='textPrimary'>
                            {_chat.messages[_chat.messages.length - 1].message.substring(0, 30) + ' ...'}
                          </Typography>
                        </React.Fragment>
                      } />
                    {
                      _chat.receiverHasRead === false && !userIsSender(_chat) ?
                        <ListItemIcon><NotificationImportant className={classes.unreadMessage}></NotificationImportant></ListItemIcon> :
                        null
                    }
                  </ListItem>
                  <Divider />
                </div>
              )
            })
          }
        </List>
      </main>
    )
  } else {
    return (
      <div className={classes.root}>
        <Button variant='contained'
          fullWidth
          color='primary'
          onClick={() => props.newChatBtnClicked()}
          className={classes.newChatBtn}>
          New Message</Button>
        <List />
      </div>
    );
  }

}