import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    position: 'absolute',
    left: '50',
    boxShadow: '1px 1px 4px #000000',
    zIndex: '1',
    textIndent: '10px',
    paddingRight: '10px',
    color: 'black',
  },
}));

export const ChatListDetails = ({ receiver, userInfo }) => {
  const classes = useStyles();
  return (
    <div
      className={classes.root}
      style={{ border: `2px solid ${userInfo.avatarColor}` }}
    >
      {receiver}
    </div>
  );
};

ChatListDetails.propTypes = {
  receiver: PropTypes.string,
  userInfo: PropTypes.object,
};
