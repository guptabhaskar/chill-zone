import React, { useState } from 'react';
import { Button, Drawer, Grid, Input } from '@material-ui/core';
import useStyles from './styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChatIcon from '@material-ui/icons/Chat';
import { APICalls } from "../../services/API/APICalls";
import { helper } from "../../services/helper";


function ChatBox(props) {
    const classes = useStyles();
    const [chatText, setChatText] = useState('');

    // Handle chat text updation
    const handleChatText = (event) => {
        const { value } = event.target;
        setChatText(value);
    }

    // Handle message send event
    const handleSendText = (event) => {
        if (!(chatText.length > 0)) return;
        if (event.type === 'keyup' && event.key !== 'Enter') {
            return;
        }
        var dateTime = helper.getDate();
        const message = {
            messageSentOn: 'Meeting',
            name: props.myDetails,
            message: chatText,
            timestamp: dateTime
        }
        const roomID = window.location.pathname.split('/')[2];
        APICalls
            .postMessage(roomID, message)
            .then((res) => {
                console.log("Message Posted")
            })
        props.socketInstance.broadcastMessage(message);
        setChatText('');
    }

    return (
        <React.Fragment>
            <Drawer className={classes.drawer} anchor={'right'} open={props.chatToggle} onClose={props.closeDrawer}>
                <div>
                    <div style={{ margin: 15 }} onClick={props.closeDrawer}>
                        <ChevronRightIcon fontSize="large" />
                    </div>

                    <Grid item xs={12} sm={12} container spacing={3} direction="row" alignItems="center" justify="center" >
                        <ChatIcon></ChatIcon>
                        <h3 style={{ margin: 20 }} >Chat</h3>
                    </Grid>
                </div>
                <div>
                    {
                        props.messages?.map((messageTemp) => {
                            const { name, message, timestamp } = messageTemp;
                            return (
                                <div>
                                    <div style={{ borderTop: "2px solid #6C63FF ", marginLeft: 20, marginRight: 20 }}></div>
                                    <h5 style={{ marginLeft: 20 }}>{timestamp}</h5>
                                    <p style={{ marginLeft: 20, fontSize: 15, fontWeight: "bold" }}>{name}:</p>
                                    <p style={{ marginLeft: 20, maxWidth: 250, fontSize: 15, wordWrap: 'break-word' }}>{message}</p>
                                </div>
                            )
                        })
                    }
                </div>
                <div onKeyUp={handleSendText}>
                    <Input
                        onChange={handleChatText}
                        value={chatText}
                        placeholder="Type Here"
                        style={{ marginLeft: 20, width: '60%' }}
                    />
                    <Button style={{ color: "#666666", margin: 0 }} onClick={handleSendText}>Send</Button>
                </div>
            </Drawer>
        </React.Fragment>
    )
}

export default ChatBox;