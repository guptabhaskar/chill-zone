import { API } from "../../utils/APIs";

// To create new meeting
const createMeeting = (emails, name, type, topic) => {
  const params = {
    emails: emails,
    name: name,
    type: type,
    topic: topic
  };
  return API.post("/meeting", params);
};

// To get meeting details from id
const getMeeting = (id) => {
  const params = {
    id: id
  }
  return API.get("/meeting", { params });
}

// To get all lunch meetings
const getLunchMeetings = () => {
  return API.get("/lunchMeeting");
}

// To get messages of a particular meeting
const getMessages = (id) => {
  const params = {
    id: id
  }
  return API.get("/messages", { params });
}

// To add new message to meeting using id
const postMessage = (id, message) => {
  const params = {
    id: id,
    message: message
  }
  return API.post("/messages", params);
}

export const APICalls = {
  createMeeting,
  getMeeting,
  getLunchMeetings,
  getMessages,
  postMessage
};
