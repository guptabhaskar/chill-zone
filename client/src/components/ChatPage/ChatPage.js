import React, { useEffect, useRef, useState } from 'react';
import { createSocketConnectionInstance } from '../../services/SocketConnection/SocketConnectionChat';
import UserPopup from '../../components/Popup/Popup';
import Navbar from '../../components/Navbar/Navbar';
import { Typography, Button, Avatar, Input, Grid } from '@material-ui/core';
import { APICalls } from "../../services/API/APICalls";
import { helper } from "../../services/helper";

import useStyles from './styles';

const ChatPageComponent = (props) => {
    const classes = useStyles();
    let socketInstance = useRef(null);
    const [userDetails, setUserDetails] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatText, setChatText] = useState('');

    useEffect(() => {
        if (userDetails !== null) {
            socketInstance.current = createSocketConnectionInstance({ // Create socket connection for chat page
                updateInstance,
                userDetails
            });
        }
        window.history.pushState(null, document.title, window.location.href); // For disabling back button of chrome
        window.addEventListener('popstate', function () {
            window.history.pushState(null, document.title, window.location.href);
        });
    }, [userDetails]);


    const handleChatText = (event) => { // For handling chat textbox input
        const { value } = event.target;
        setChatText(value);
    }

    const handleSendText = (event) => { // For sending text button through chat
        if (!(chatText.length > 0)) return;
        if (event.type === 'keyup' && event.key !== 'Enter') {
            return;
        }
        var dateTime = helper.getDate();
        const message = {
            messageSentOn: 'ChatPage',
            name: userDetails,
            message: chatText,
            timestamp: dateTime,
        };
        const roomID = window.location.pathname.split('/')[2];
        APICalls
            .postMessage(roomID, message)
            .then((res) => {
                console.log("Message Posted")
            })
        socketInstance.current.broadcastMessage(message);
        setChatText('');
    }

    const updateInstance = (messages) => { // For updating messages
        setMessages(messages);
    }

    const handleuserDetails = (userDetails, passcode) => { // For handling userdetails change
        setUserDetails(userDetails);
    }

    return (
        <React.Fragment>
            <Navbar />
            {userDetails !== null &&
                <div>
                    {
                        messages?.map((messageTemp) => {
                            const { name, message, timestamp } = messageTemp;
                            return (
                                <Grid className={classes.message} container justifyContent="center" >
                                    <Grid item xs={12} sm={3} direction="row" >
                                        <Grid item xs={12} sm={12} >
                                            <div style={{ borderTop: "2px solid #6C63FF ", marginLeft: 20, marginRight: 20 }}></div>
                                        </Grid>
                                        <Grid item xs={12} sm={12} >
                                            <h5 style={{ marginLeft: 20 }}>{timestamp}</h5>
                                        </Grid>
                                        <Grid item xs={12} sm={12} >
                                            <div style={{ marginLeft: 20 }} className={classes.profile}>
                                                <Avatar className={classes.purple} >{name.charAt(0).toUpperCase()}</Avatar>
                                                <Typography style={{ marginLeft: 10 }} className={classes.userName} variant="h7">{name}</Typography>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={12} >
                                            <p style={{ marginLeft: 20, maxWidth: 270, fontSize: 15, wordWrap: 'break-word' }}>{message}</p>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )
                        })
                    }
                    <div style={{ marginLeft: '40.5%' }} onKeyUp={handleSendText}>
                        <Input
                            onChange={handleChatText}
                            value={chatText}
                            placeholder="Type Here"
                            className={classes.chatInput}
                        />
                        <Button style={{ color: "#333333" }} onClick={handleSendText}>Send</Button>
                    </div>
                </div>
            }
            {userDetails === null && <UserPopup submitHandle={handleuserDetails}></UserPopup>}
        </React.Fragment>
    )
}

export default ChatPageComponent;