import React, { useEffect, useRef, useState } from 'react';
import { createSocketConnectionInstance } from '../../services/SocketConnection/SocketConnection';
import UserPopup from '../../components/Popup/Popup';
import ChatBox from '../../components/ChatBox/ChatBox';
import FootBar from '../../components/FootBar/FootBar';
import { ToastContainer } from 'react-toastify';
import Navbar from '../../components/Navbar/Navbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CircularProgress } from '@material-ui/core';

import useStyles from './styles';

const RoomComponent = (props) => {
    const classes = useStyles();
    let socketInstance = useRef(null);
    const [micStatus, setMicStatus] = useState(true);
    const [camStatus, setCamStatus] = useState(true);
    const [streaming, setStreaming] = useState(false);
    const [chatToggle, setChatToggle] = useState(false);
    const [userDetails, setUserDetails] = useState(props.location.state ? props.location.state.name : null);
    const [passcode, setPasscode] = useState(props.location.state ? props.location.state.passcode : null);
    const [displayStream, setDisplayStream] = useState(false);
    const [messages, setMessages] = useState([]);
    const [handRaised, setHandRaised] = useState(false);

    useEffect(() => {
        if (userDetails !== null) {
            // To create socket connection if user details are available
            socketInstance.current = createSocketConnectionInstance({
                updateInstance: updateFromInstance,
                userDetails
            });
        }
        window.history.pushState(null, document.title, window.location.href);
        window.addEventListener('popstate', function () {
            window.history.pushState(null, document.title, window.location.href);
        });
    }, [userDetails]);

    // For updating states
    const updateFromInstance = (key, value) => {
        if (key === 'streaming') setStreaming(value);
        if (key === 'message') setMessages([...value]);
        if (key === 'displayStream') setDisplayStream(value);
    }

    // For disconnect button
    const handleDisconnect = () => {
        socketInstance.current?.destoryConnection();
        props.history.push('/');
    }

    // For handling mic button
    const handleMyMic = () => {
        const { getMyVideo, vidReInitializeStream } = socketInstance.current;
        const myVideo = getMyVideo();
        if (myVideo) {
            myVideo.srcObject?.getAudioTracks().forEach((track) => {
                micStatus ? track.stop() : vidReInitializeStream(camStatus, !micStatus);
            });
        }
        setMicStatus(!micStatus);
    }

    // For handling camera button
    const handleMyCam = () => {
        const { getMyVideo, vidReInitializeStream } = socketInstance.current;
        const myVideo = getMyVideo();
        if (myVideo) {
            myVideo.srcObject?.getVideoTracks().forEach((track) => {
                camStatus ? track.stop() : vidReInitializeStream(!camStatus, micStatus);
            });
        }
        setCamStatus(!camStatus);
    }

    // For handling user details from user popup
    const handleuserDetails = (userDetails, passcode) => {
        setUserDetails(userDetails);
        setPasscode(passcode);
    }

    // For handling copy link button
    const handleLink = () => {
        var textToCopy = window.location;
        navigator.clipboard.writeText(textToCopy);
        toast.info(`Meeting Link Copied! Passcode: ` + passcode, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    // For handling hand raised feature
    const handleHandRaised = () => {
        const handRaisedData = {
            handRaised: handRaised,
            userDetails: userDetails
        }
        socketInstance.current.handleHandRaised(handRaisedData);
        setHandRaised(!handRaised);
    }

    // For handling screen share button
    const toggleScreenShare = () => {
        displayStream ? socketInstance.current.stopScreenShare() : socketInstance.current.startScreenShare();
    }

    return (
        <React.Fragment>
            <Navbar />
            {userDetails === null && !streaming &&
                <div className={`${classes.loader}`}>
                    <CircularProgress size={100} color="primary" />
                </div>
            }
            <div id="room-container" className={`${classes.room}`}></div>
            <br></br>
            {userDetails !== null && streaming && <FootBar handRaised={handRaised} handleHandRaised={handleHandRaised} handleLink={handleLink} micStatus={micStatus} handleMyMic={handleMyMic} camStatus={camStatus} handleMyCam={handleMyCam} handleDisconnect={handleDisconnect} displayStream={displayStream} toggleScreenShare={toggleScreenShare} chatToggle={chatToggle} setChatToggle={setChatToggle} />}
            {userDetails === null && <UserPopup submitHandle={handleuserDetails}></UserPopup>}
            {userDetails !== null &&
                <ChatBox
                    chatToggle={chatToggle}
                    closeDrawer={() => setChatToggle(false)}
                    socketInstance={socketInstance.current}
                    myDetails={userDetails}
                    messages={messages}>
                </ChatBox>
            }
            <ToastContainer />
        </React.Fragment>
    )
}

export default RoomComponent;