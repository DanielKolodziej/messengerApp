import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    content: {
        height: 'calc(100vh - 100px)',
        overflow: 'auto',
        padding: '25px',
        marginLeft: '300px',
        boxSizing: 'border-box',
        overflowY: 'scroll',
        top: '50px',
        width: 'calc(100% - 300px)',
        position: 'absolute'
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
        borderRadius: '10px'
    },

    friendSent: {
        float: 'right',
        clear: 'both',
        padding: '20px',
        boxSizing: 'border-box',
        wordWrap: 'break-word',
        marginTop: '10px',
        backgroundColor: '#707BC4',
        color: 'white',
        width: '300px',
        borderRadius: '10px'
    },

    chatHeader: {
        width: 'calc(100% - 301px)',
        height: '50px',
        backgroundColor: '#344195',
        position: 'fixed',
        marginLeft: '301px',
        fontSize: '18px',
        textAlign: 'center',
        color: 'white',
        paddingTop: '10px',
        boxSizing: 'border-box'
    }

}));

export const ChatView = (props) => {

    const classes = useStyles();

    useEffect(() => {
        //useEffect to scroll chatView window component to the bottom
        const container = document.getElementById('chatview-container');
        if (container) { //issue in microsoft edge
            container.scrollTo(0, container.scrollHeight);
        }
    }, [props.chat]) //not 100% sure on the dependency but seems to be working

    if (props.chat === undefined) {
        return (
            <main id='chatview-container' className={classes.content}></main>
        );
    } else {
        return (
            <div>
                <div className={classes.chatHeader}>
                    Your conversation with {props.chat.users.filter(_usr => _usr !== props.user)[0]}
                </div>
                <main id='chatview-container' className={classes.content}>
                    {
                        props.chat.messages.map((_msg, _index) => {
                            return (
                                <div key={_index} className={_msg.sender === props.user ? classes.userSent : classes.friendSent}>
                                    {_msg.message}
                                </div>
                            );
                        })
                    }
                </main>
            </div>
        );
    }
}