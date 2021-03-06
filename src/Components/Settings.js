import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  FormGroup,
  FormControlLabel,
  Switch,
  Button,
} from '@material-ui/core/';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { ChromePicker, SliderPicker } from 'react-color';
import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

const firebase = require('firebase');

const useStyles = makeStyles({
  root: {
    width: '220px',
    padding: '0 16px 16px 16px',
  },
});

export const Settings = ({ open, onClose, userInfo, setUserInfo }) => {
  const classes = useStyles();

  const handleChange = () => {
    setUserInfo({ ...userInfo, darkModeStatus: !userInfo.darkModeStatus });
  };
  const handleColorChange = color => {
    setUserInfo({ ...userInfo, avatarColor: color.hex });
  };
  const saveChange = () => {
    console.log('save clicked...');
    console.log(
      `Current status of state being saved: ${userInfo.darkModeStatus}, ${userInfo.avatarColor}`
    );
    firebase
      .firestore()
      .collection('users')
      .doc(userInfo.name)
      .update({ dark: userInfo.darkModeStatus, color: userInfo.avatarColor });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Account Settings</DialogTitle>
      <FormGroup className={classes.root}>
        <FormControlLabel
          control={
            <Switch
              checked={userInfo.darkModeStatus}
              onChange={handleChange}
              name="darkMode"
              color="primary"
            />
          }
          label="Dark Mode"
        />

        {/* <FormControlLabel
          control={
            <ChromePicker
              name="avatarColor"
              color={userInfo.avatarColor}
              onChangeComplete={handleColorChange}
            />
          }
          label={
            <AccountCircleIcon
              fontSize="large"
              style={{ color: userInfo.avatarColor }}
            />
          }
          labelPlacement="top"
        /> */}
        <AccountCircleIcon
          fontSize="large"
          style={{
            color: userInfo.avatarColor,
            margin: 'auto',
          }}
        />
        <SliderPicker
          name="avatarColor"
          color={userInfo.avatarColor}
          onChangeComplete={handleColorChange}
        />
      </FormGroup>
      <Button variant="contained" onClick={saveChange} color="primary">
        Save Changes
      </Button>
      <Button variant="contained" onClick={onClose}>
        Close
      </Button>
    </Dialog>
  );
};

Settings.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  userInfo: PropTypes.object,
  setUserInfo: PropTypes.func,
};
