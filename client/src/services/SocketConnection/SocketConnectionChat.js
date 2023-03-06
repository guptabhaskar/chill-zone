import { io } from 'socket.io-client';
import { APICalls } from "../API/APICalls";
// const websocket = 'ws://localhost:5000';
const websocket = process.env.REACT_APP_BACKEND_URL;

let socketInstance = null;

class SocketConnection {
    settings;
    socket;
    messages = [];

    constructor(settings) {
        this.settings = settings;
        this.socket = initializeSocketConnection();
        this.initializeSocketEvents();
        this.initializeMessages();
    }

    // To initialize message array from database
    initializeMessages = () => {
        const roomID = window.location.pathname.split('/')[2];
        APICalls
            .getMessages(roomID)
            .then((res) => {
                res.data.forEach(element => {
                    this.messages.push(element);
                });
                this.settings.updateInstance(this.messages);
            })
    }

    // To initialize socket events
    initializeSocketEvents = () => {
        this.socket.on('connect', () => {
            console.log('Socket Connected');
        });
        this.socket.on('disconnect', () => {
            console.log('Socket Disconnected');
        });
        this.socket.on('error', (err) => {
            console.log('Socket Error', err);
        });
        this.socket.on('new-broadcast-messsage', (message) => {
            this.messages.push(message)
            this.settings.updateInstance(this.messages);
        });
        const { userDetails } = this.settings;
        const roomID = window.location.pathname.split('/')[2];
        const userData = {
            userID: 'NA', roomID, userDetails
        }
        this.socket.emit('join-room', userData);
    }

    // To broadcast message on same roomID
    broadcastMessage = (message) => {
        this.messages.push(message)
        this.settings.updateInstance(this.messages);
        this.socket.emit('broadcast-message', message);
    }

    // To end socket instance
    destoryConnection = () => {
        socketInstance?.socket.disconnect();
    }
}

const initializeSocketConnection = () => {
    return io.connect(websocket, {
        secure: true,
        reconnection: true,
        rejectUnauthorized: false,
        reconnectionAttempts: 10
    });
}

export function createSocketConnectionInstance(settings = {}) {
    return socketInstance = new SocketConnection(settings);
}