import React, { useState } from 'react'
import { Link } from 'react-router-dom';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const firebase = require('firebase');

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
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(),
    },
    submit: {
        marginTop: theme.spacing(3),
    },
    noAccountHeader: {
        width: '100%'
    },
    signUpLink: {
        width: '100%',
        textDecoration: 'none',
        color: '#303f9f',
        fontWeight: 'bolder'
    },
    errorText: {
        color: 'red',
        textAlign: 'center'
    }
}));

export const Login = ({ history }) => {
    //makeStyles css
    const classes = useStyles();

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [serverError, setServerError] = useState('');

    const submitLogin = (e) => {
        e.preventDefault();

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                history.push('/dashboard');
            }, err => {
                setServerError(err.message);
                console.log(err);
            })
    }

    const handleInputChange = (e) => {
        const { name, value} = e.target;

        name==='email' ? setEmail(value) : setPassword(value);
    }
    return (
        <main className={classes.main}>
            <CssBaseline />
            <Paper className={classes.paper}>
                <Typography component='h1' variant='h5'>
                    Log in
                </Typography>
                <form className={classes.form} onSubmit={(e) => submitLogin(e)}>
                    <FormControl required fullWidth margin='normal'>
                        <InputLabel htmlFor='login-email-input'>Enter your Email</InputLabel>
                        <Input onChange={handleInputChange} name='email' autoComplete='email' autoFocus id='login-email-input' />
                    </FormControl>
                    <FormControl required fullWidth margin='normal'>
                        <InputLabel htmlFor='login-password-input'>Enter your Password</InputLabel>
                        <Input onChange={handleInputChange}name='password' type='password' id='login-password-input' />
                    </FormControl>
                    <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>Log in</Button>
                </form>
                {
                    serverError ?
                        <Typography className={classes.errorText} component='h5' variant='h6'>
                            {serverError}
                    </Typography> :
                        null
                }
                <Typography component='h5' variant='h6' className={classes.noAccountHeader}>Don't have an account?</Typography>
                <Link className={classes.signUpLink} to='/signup'>Sign up</Link>
            </Paper>
        </main>
    )
}