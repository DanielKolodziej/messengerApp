import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQuery } from 'react-responsive';
import Proptypes from 'prop-types';
import moment from 'moment';

const useStyles = makeStyles({
  content: {
    height: 'calc(100vh - 100px)',
    padding: '25px',
    marginLeft: '300px',
    boxSizing: 'border-box',
    overflowY: 'scroll',
    width: 'calc(100% - 300px)',
  },
  contentDark: {
    backgroundColor: '#3D3D3D',
    height: 'calc(100vh - 100px)',
    padding: '25px',
    marginLeft: '300px',
    boxSizing: 'border-box',
    overflowY: 'scroll',
    width: 'calc(100% - 300px)',
  },

  userSent: {
    float: 'left',
    clear: 'both',
    padding: '20px',
    boxSizing: 'border-box',
    wordWrap: 'break-word',
    marginTop: '10px',
    // backgroundColor: '#707BC4',
    backgroundColor: props => props.avatarColor,
    color: 'white',
    width: '300px',
    borderRadius: '10px',
  },

  friendSent: {
    float: 'right',
    clear: 'both',
    padding: '20px',
    boxSizing: 'border-box',
    wordWrap: 'break-word',
    marginTop: '10px',
    backgroundColor: '#9da1C4',
    color: 'white',
    width: '300px',
    borderRadius: '10px',
  },

  time: {
    float: 'right',
    color: 'black',
    fontSize: 'small',
  },

  contentMobile: {
    height: 'calc(100vh - 100px)',
    padding: '25px',
    marginLeft: '100px',
    boxSizing: 'border-box',
    overflowY: 'scroll',
    width: 'calc(100% - 100px)',
  },
  contentMobileDark: {
    backgroundColor: '#3D3D3D',
    height: 'calc(100vh - 100px)',
    padding: '25px',
    marginLeft: '100px',
    boxSizing: 'border-box',
    overflowY: 'scroll',
    width: 'calc(100% - 100px)',
  },
});

export const ChatView = ({ chat, user, userInfo }) => {
  const isNotMobile = useMediaQuery({ minWidth: 650 });
  const classes = useStyles(userInfo);
  const [contentStyle, setContentStyle] = useState(classes.content);

  useEffect(() => {
    // useEffect to scroll chatView window component to the bottom
    const container = document.getElementById('chatview-container');
    if (container) {
      // works in edge, chrome, firefox
      container.scrollTop = container.scrollHeight;
    }
    if (userInfo.darkModeStatus && isNotMobile) {
      setContentStyle(classes.contentDark);
    } else if (userInfo.darkModeStatus && !isNotMobile) {
      setContentStyle(classes.contentMobileDark);
    } else if (!userInfo.darkModeStatus && !isNotMobile) {
      setContentStyle(classes.contentMobile);
    } else {
      setContentStyle(classes.content);
    }
    // console.log(contentStyle);
  }, [
    chat,
    classes.content,
    classes.contentDark,
    classes.contentMobile,
    classes.contentMobileDark,
    isNotMobile,
    userInfo.darkModeStatus,
  ]);

  if (chat === undefined) {
    return <main id="chatview-container" className={contentStyle} />;
  }
  return (
    <div>
      {/* <div
        className={isNotMobile ? classes.chatHeader : classes.chatHeaderMobile}
      >
        Your conversation with {chat.users.filter(_usr => _usr !== user)[0]}
      </div> */}
      <main
        id="chatview-container"
        // className={isNotMobile ? classes.content : classes.contentMobile}
        // className={
        //   userInfo.darkModeStatus ? classes.contentDark : classes.content
        // }
        className={contentStyle}
      >
        {chat.messages.map((_msg, _index) => (
          <div
            key={_index}
            className={
              _msg.sender === user ? classes.userSent : classes.friendSent
            }
          >
            {_msg.message}
            <div className={classes.time}>
              {_msg.timestamp.substring(0, 13) !==
              moment().format('MMM Do YYYY')
                ? _msg.timestamp.substring(0, 13)
                : _msg.timestamp.substring(15, 26)}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

ChatView.propTypes = {
  chat: Proptypes.object,
  user: Proptypes.string,
  userInfo: Proptypes.object,
};
