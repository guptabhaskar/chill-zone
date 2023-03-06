import React, { useEffect, useState } from "react";
import { APICalls } from "../../services/API/APICalls";
import 'react-toastify/dist/ReactToastify.css';
import { Typography, Button, Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Navbar from '../../components/Navbar/Navbar';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import useStyles from './styles';
import { Link } from 'react-router-dom';

function Lunch() {
  const classes = useStyles();
  const [meetings, setMeetings] = useState([]);
  var colors = ["#393E41", "#E94F37", "#1C89BF", "#A1D363", "#85FFC7", "#297373", "#FF8552", "#A40E4C"];

  useEffect(() => {
    APICalls
      .getLunchMeetings()
      .then((res) => {
        setMeetings(res.data);
      })
  }, []);
  
  return (
    <React.Fragment>
      <Navbar />
      <div>
        <Typography className={classes.heading} variant="h4">
          Meet new people with common interests <br />
          Passcode: 000000
        </Typography>
        <Grid container spacing={3} >
          <Grid item xs={12}>
            <Grid container justifyContent="center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} spacing={6}>
              {
                meetings?.map((meeting, i) => {
                  const { meetingID, topic } = meeting;
                  return (
                    <Grid item className={classes.card}>
                      <Card className={classes.root} style={{ backgroundColor: colors[i] }} align="center" variant="outlined">
                        <CardContent>
                          <Typography className={classes.pos}>
                            {topic}
                          </Typography>
                        </CardContent>
                        <CardActions color="primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <Button variant="contained" component={Link} to={"join/" + meetingID} align="center" size="large">JOIN</Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  )
                })
              }
            </Grid>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
}
export default Lunch;