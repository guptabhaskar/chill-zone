import { io } from 'socket.io-client';
import Peer from 'peerjs';
import { toast } from 'react-toastify';
// const websocket = 'ws://localhost:5000';
const websocket = 'https://chillzone-server.herokuapp.com/';

let socketInstance = null;
let peers = {};

class SocketConnection {
    videoContainer = {};
    settings;
    myPeer;
    socket;
    myID = '';
    messages = [];
    screenShared = false;

    constructor(settings) {
        this.settings = settings;
        this.myPeer = new Peer();
        this.socket = initializeSocketConnection();
        this.initializeSocketEvents();
        this.initializePeersEvents();
    }

    // To initialize socket events
    initializeSocketEvents = () => {
        this.socket.on('connect', () => {
            console.log('Socket Connected');
        });
        this.socket.on('user-disconnected', (userID) => {
            console.log('User Disconnected - Closing Peer', userID);
            peers[userID] && peers[userID].close();
            peers['SharedScreen' + userID] && peers['SharedScreen' + userID].close();
            this.removeVideo(userID);
            this.removeVideo('SharedScreen' + userID);
        });
        this.socket.on('disconnect', () => {
            console.log('Socket Disconnected');
        });
        this.socket.on('error', (err) => {
            console.log('Socket Error', err);
        });
        this.socket.on('new-broadcast-messsage', (message) => {
            this.messages.push(message);
            this.settings.updateInstance('message', this.messages);
            toast.info(`${message.message} by ${message.name}`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        });
        this.socket.on('new-hand-raise', (handRaisedData) => {
            toast.dark(`🤚 ${handRaisedData.userDetails} ${handRaisedData.handRaised ? 'lowered' : 'raised'} his hand!`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        })
    }

    // To initialize peer connection
    initializePeersEvents = () => {
        this.myPeer.on('open', (id) => {
            const { userDetails } = this.settings;
            this.myID = id;
            const roomID = window.location.pathname.split('/')[2];
            const userData = {
                userID: id, roomID, userDetails
            }
            console.log('Peers Established and Room Joined', userData);
            this.socket.emit('join-room', userData);
            this.setNavigatorToStream();
        });
        this.myPeer.on('error', (err) => {
            console.log('Peer Connection Error', err);
        })
    }

    // To get stream and initialize call everyone
    setNavigatorToStream = () => {
        this.getVideoAudioStream().then((stream) => {
            if (stream) {
                this.settings.updateInstance('streaming', true);
                this.createVideo({ id: this.myID, stream });
                this.setPeersListeners(stream);
                this.newUserConnection(stream);
            }
        })
    }

    // To set navigator to user camera
    getVideoAudioStream = (video = true, audio = true) => {
        const myNavigator = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia || navigator.mediaDevices.msGetUserMedia;
        return myNavigator({
            video: video ? {
                frameRate: 12,
                noiseSuppression: true,
                width: 1280,
                height: 720
            } : false,
            audio: audio,
        });
    }

    // Initialize peer listeners
    setPeersListeners = (stream) => {
        this.myPeer.on('call', (call) => {
            call.answer(stream);
            call.on('stream', (userVideoStream) => {
                this.createVideo({ id: call.metadata.id, stream: userVideoStream });
            });
            call.on('close', () => {
                console.log('Closing Peers Listeners', call.metadata.id);
                this.removeVideo(call.metadata.id);
            });
            call.on('error', () => {
                console.log('Peer Error');
                this.removeVideo(call.metadata.id);
            });
            peers[call.metadata.id] = call;
        });
    }

    // To connect to a new user
    newUserConnection = (stream) => {
        this.socket.on('new-user-connect', (userData) => {
            console.log('New User Connected', userData);
            this.connectToNewUser(userData, stream);
            if (this.screenShared) {
                this.sendScreen(userData);
            }
        });
    }

    // To send display stream to user connecting if screen is already shared
    sendScreen(userData) {
        const { userID } = userData;
        let screen = this.getMyVideo('SharedScreen' + this.myID);
        if (screen?.srcObject) {
            const stream = screen.srcObject;
            let call = this.myPeer.call(userID, stream, { metadata: { id: 'SharedScreen' + this.myID } });
            call.on('close', () => {
                console.log('User Disconnected', userID);
            })
            call.on('error', () => {
                console.log('Peer Error')
            })
            const videoTrack = stream.getVideoTracks();
            if (videoTrack && videoTrack[0]) {
                videoTrack[0].onended = () => {
                    this.stopScreenShare();
                }
            }
        }
    }

    // To call a new user whose peer id came from socket with our stream
    connectToNewUser(userData, stream) {
        const { userID } = userData;
        const call = this.myPeer.call(userID, stream, { metadata: { id: this.myID } });
        call.on('stream', (userVideoStream) => {
            this.createVideo({ id: userID, stream: userVideoStream, userData });
        });
        call.on('close', () => {
            console.log('Closing New User', userID);
            this.removeVideo(userID);
        });
        call.on('error', () => {
            console.log('Peer Error')
            this.removeVideo(userID);
        })
        peers[userID] = call;
    }

    // Broadcast message and update messages array
    broadcastMessage = (message) => {
        this.messages.push(message);
        this.settings.updateInstance('message', this.messages);
        this.socket.emit('broadcast-message', message);
    }

    // To create aur replace video
    createVideo = (createObj) => {
        if (!this.videoContainer[createObj.id]) {
            this.videoContainer[createObj.id] = {
                ...createObj,
            };
            const roomContainer = document.getElementById('room-container');
            const videoContainer = document.createElement('div');
            videoContainer.id = 'div' + createObj.id;
            const video = document.createElement('video');
            video.srcObject = this.videoContainer[createObj.id].stream;
            video.id = createObj.id;
            video.autoplay = true;
            if (this.myID === createObj.id || 'SharedScreen' + this.myID === createObj.id) {
                video.muted = true;
            }
            videoContainer.appendChild(video)
            roomContainer.append(videoContainer);
        } else {
            const createO = document.getElementById(createObj.id);
            if (createO) {
                createO.srcObject = createObj.stream;
            }
        }
    }

    // To stop screen sharing 
    stopScreenShare = () => {
        const screenStream = this.getMyVideo('SharedScreen' + this.myID);
        if (screenStream && screenStream.srcObject) {
            screenStream.srcObject.getTracks().forEach((track) => {
                track.stop();
            });
        }
        this.removeVideo('SharedScreen' + this.myID);
        this.socket.emit('display-off', 'SharedScreen' + this.myID); // Emit display-off event
        this.settings.updateInstance('displayStream', false);
        this.screenShared = false;
    }

    // To start screen sharing
    startScreenShare = () => {
        navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }).then((stream) => { // To get display streams
            this.settings.updateInstance('displayStream', true);
            let call;
            Object.values(peers).forEach((peer) => {
                call = this.myPeer.call(peer.peer, stream, { metadata: { id: 'SharedScreen' + this.myID } }); // Call all peers again with display stream
                call.on('close', () => {
                    console.log('User Disconnected', peer.peer);
                })
                call.on('error', () => {
                    console.log('Peer Error')
                })
            })
            const videoTrack = stream.getVideoTracks();
            if (videoTrack && videoTrack[0]) {
                videoTrack[0].onended = () => {
                    this.stopScreenShare();
                }
            }
            this.createVideo({ id: 'SharedScreen' + this.myID, stream });
            this.screenShared = true;
        });
    }

    // Reinitialize video after mic and video button click
    vidReInitializeStream = (video, audio) => {
        this.getVideoAudioStream(video, audio).then((stream) => {
            const createO = document.getElementById(this.myID);
            if (createO) {
                createO.srcObject = stream;
            }
            replaceStream(stream);
        });
    }

    // To remove video using the id provided from screen
    removeVideo = (id) => {
        const video = document.getElementById('div' + id);
        if (video) {
            video.outerHTML = "";
        }
        delete this.videoContainer[id];
    }

    // To destroy connection, end all streams, disconnect socket and destrop this peer
    destoryConnection = () => {
        this.videoContainer[this.myID]?.stream.getTracks()?.forEach((track) => {
            track.stop();
        })
        this.videoContainer['ScreenShare' + this.myID]?.stream.getTracks()?.forEach((track) => {
            track.stop();
        })
        socketInstance?.socket.disconnect();
        this.myPeer.destroy();
    }

    // To get video of this user
    getMyVideo = (id = this.myID) => {
        return document.getElementById(id);
    }

    // Emit hand raise to other sockets
    handleHandRaised = (handRaisedData) => {
        this.socket.emit('hand-raised', handRaisedData);
    }
}

// To start new socket connection
const initializeSocketConnection = () => {
    return io.connect(websocket, {
        secure: true,
        reconnection: true,
        rejectUnauthorized: false,
        reconnectionAttempts: 10
    });
}

// To replace all the streams that this socket is sharing
const replaceStream = (mediaStream) => {
    Object.values(peers).forEach((peer) => {
        peer.peerConnection?.getSenders().forEach((sender) => {
            if (sender.track.kind === "audio") {
                if (mediaStream.getAudioTracks().length > 0) {
                    sender.replaceTrack(mediaStream.getAudioTracks()[0]);
                }
            }
            if (sender.track.kind === "video") {
                if (mediaStream.getVideoTracks().length > 0) {
                    sender.replaceTrack(mediaStream.getVideoTracks()[0]);
                }
            }
        });
    })
}

export function createSocketConnectionInstance(settings = {}) {
    return socketInstance = new SocketConnection(settings);
}