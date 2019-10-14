import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQuery } from 'react-responsive';
import Proptypes from 'prop-types';

const useStyles = makeStyles({
  content: {
    height: 'calc(100vh - 100px)',
    overflow: 'auto',
    padding: '25px',
    marginLeft: '300px',
    boxSizing: 'border-box',
    overflowY: 'scroll',
    top: '50px',
    width: 'calc(100% - 300px)',
    position: 'absolute',
  },

  userSent: {
    float: 'left',
    clear: 'both',
    padding: '20px',
    boxSizing: 'border-box',
    wordWrap: 'break-word',
    marginTop: '10px',
    backgroundColor: '#707BC4',
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

  chatHeader: {
    width: 'calc(100% - 301px)',
    height: '36px',
    backgroundColor: '#344195',
    position: 'fixed',
    marginLeft: '301px',
    fontSize: '18px',
    textAlign: 'center',
    color: 'white',
    paddingTop: '10px',
    boxSizing: 'border-box',
  },

  contentMobile: {
    height: 'calc(100vh - 100px)',
    overflow: 'auto',
    padding: '25px',
    marginLeft: '100px',
    boxSizing: 'border-box',
    overflowY: 'scroll',
    top: '50px',
    width: 'calc(100% - 100px)',
    position: 'absolute',
  },
  chatHeaderMobile: {
    width: 'calc(100% - 101px)',
    height: '36px',
    backgroundColor: '#344195',
    position: 'fixed',
    marginLeft: '101px',
    fontSize: '18px',
    textAlign: 'center',
    color: 'white',
    paddingTop: '10px',
    boxSizing: 'border-box',
  },
});

export const ChatView = ({ chat, user }) => {
  const isNotMobile = useMediaQuery({ minWidth: 650 })
  const classes = useStyles();

  useEffect(() => {
    // useEffect to scroll chatView window component to the bottom
    const container = document.getElementById('chatview-container');
    if (container) {
      // issue in microsoft edge
      container.scrollTo(0, container.scrollHeight);
    }
  }, [chat]); // not 100% sure on the dependency but seems to be working

  if (chat === undefined) {
    return <main id="chatview-container" className={classes.content} />;
  }
  return (
    <div>
      <div className={isNotMobile ? classes.chatHeader : classes.chatHeaderMobile}>
        Your conversation with {chat.users.filter(_usr => _usr !== user)[0]}
      </div>
      <main id="chatview-container" className={isNotMobile ? classes.content : classes.contentMobile}>
        {chat.messages.map((_msg, _index) => (
          <div
            key={_index}
            className={
              _msg.sender === user ? classes.userSent : classes.friendSent
            }
          >
            {_msg.message}
          </div>
        ))}
      </main>
    </div>
  );
};

ChatView.propTypes = {
  chat: Proptypes.object,
  user: Proptypes.string,
};
