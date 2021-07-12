import React from 'react';

import CallIcon from '@material-ui/icons/CallEnd';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
import Avatar from '@material-ui/core/Avatar';
import ChatIcon from '@material-ui/icons/Chat';
import LinkIcon from '@material-ui/icons/Link';
import PanToolIcon from '@material-ui/icons/PanTool';
import { Container, Grid } from '@material-ui/core';

import useStyles from './styles';

function FootBar(props) {
    const classes = useStyles();
    return (
        <Container className={classes.footbar}>
            <Grid container>
                <Grid item xs={3} sm={2} container align='center'>
                    <Grid item xs={6} sm={6} align='center'>
                        <Avatar className={`${classes.grey} ${classes.icons}`} onClick={props.handleLink}>
                            <LinkIcon />
                        </Avatar>
                    </Grid>
                    <Grid item xs={6} sm={6} align='center'>
                        <Avatar className={`${classes.grey} ${classes.icons}`} onClick={props.handleHandRaised}>
                            {props.handRaised ? <PanToolIcon color="disabled" /> : <PanToolIcon />}
                        </Avatar>
                    </Grid>
                </Grid>
                <Grid item xs={6} sm={8} container spacing={2} align='end'>
                    <Grid item xs={4} sm={4} align='right' >
                        <Avatar className={`${classes.grey} ${classes.icons}`} onClick={props.handleMyMic}>
                            {props.micStatus ? <MicIcon /> : <MicOffIcon />}
                        </Avatar>
                    </Grid>
                    <Grid item xs={4} sm={4} align='center'>
                        <Avatar className={`${classes.red} ${classes.icons}`} onClick={props.handleDisconnect} >
                            <CallIcon />
                        </Avatar>
                    </Grid>
                    <Grid item xs={4} sm={4} align='end'>
                        <Avatar className={`${classes.grey} ${classes.icons}`} onClick={props.handleMyCam}>
                            {props.camStatus ? <VideocamIcon /> : <VideocamOffIcon />}
                        </Avatar>
                    </Grid>
                </Grid>
                <Grid item xs={3} sm={2} container align='center'>
                    <Grid item xs={6} sm={6} align='center'>
                        <Avatar className={`${classes.grey} ${classes.icons}`} onClick={props.toggleScreenShare}>
                            {props.displayStream ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                        </Avatar>
                    </Grid>
                    <Grid item xs={6} sm={6} align='center'>
                        <Avatar className={`${classes.green} ${classes.icons}`} onClick={() => props.setChatToggle(!props.chatToggle)}> <ChatIcon /></Avatar>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
}

export default FootBar;