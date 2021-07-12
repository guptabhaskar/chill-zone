import React, { useState, useRef } from "react";
import { Button, Container, TextField, Grid } from "@material-ui/core";
import { APICalls } from "../../services/API/APICalls";
import { useHistory } from "react-router-dom";
import Slideshow from "../Slideshow/Slideshow";
import Icon from '@material-ui/core/Icon';
import Navbar from '../../components/Navbar/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
  const email = useRef('');
  let history = useHistory();
  const [emails, setEmails] = useState([]);
  const [name, setName] = useState('');

  // To handle generate meeting button
  const handleJoin = () => {
    if (name === '') {
      alert("Please enter your name to create a meeting!");
      return;
    }
    APICalls
      .createMeeting(emails, name, 'Normal', 'NA')
      .then((res) => {
        history?.push({
          pathname: `/join/${res.data.id}`,
          state: { name: name, passcode: res.data.passcode },
        });
      })
  };

  // To validate email
  const ValidateEmail = (mail) => {
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (mail.match(mailformat)) {
      return true;
    }
    else {
      alert("Enter a valid email address!");
      return false;
    }
  }

  // To add email from input
  const addEmail = () => {
    if (ValidateEmail(email.current.value)) {
      setEmails([...emails, email.current.value]);
      toast.info(`${email.current.value} added to invitee list`)
      email.current.value = '';
    }
  };

  return (
    <React.Fragment>
      <Navbar />
      <Container style={{ marginTop: 150 }}>
        <Grid container justify="space-center" alignItems="stretch" spacing={3}>
          <Grid item xs={12} sm={7} container spacing={3} direction="row" alignItems="center" justify="center" >
            <Grid item xs={12} sm={12} container spacing={6} direction="row" alignItems="center" justify="center" >
              <Grid item xs={12} sm={4} align='center'> <TextField name="title" variant="outlined" onChange={(e) => setName(e.target.value)} label="Your Name" fullWidth /> </Grid>
              <Grid item xs={12} sm={6} align='center'> <TextField name="email" inputRef={email} variant="outlined" label="Invite people with an email" fullWidth /> </Grid>
              <Grid item xs={12} sm={2} align='center'>  <Button variant="contained" onClick={addEmail} color="primary" endIcon={<Icon>add</Icon>}> Add </Button></Grid>
              <Grid item xs={12} sm={6} align='center'> <Button style={{ margin: 40, minHeight: 40, minWidth: 200 }} variant="contained" onClick={handleJoin} color="primary" endIcon={<Icon> camera </Icon>}> Start Meeting </Button></Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={5} alignItems="center" justify="center">
            <Slideshow />
          </Grid>
        </Grid>
        <ToastContainer
          autoClose={2000}
          closeOnClick
          pauseOnHover
        />
      </Container>
    </React.Fragment>
  );
}

export default Home;
