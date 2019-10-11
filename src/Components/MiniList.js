import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    position: 'absolute',
    left: '50',
    // width: '260px',
    boxShadow: '1px 1px 4px #000000',
    // zIndex: '1',
    textIndent: '10px',
    paddingRight: '10px',
  },
}));

export const MiniList = ({ receiver, col }) => {
  const classes = useStyles();
  return (
    <div className={classes.root} style={{ border: `2px solid ${col}` }}>
      {receiver}
    </div>
  );
};

MiniList.propTypes = {
  receiver: PropTypes.string,
  col: PropTypes.number,
};
