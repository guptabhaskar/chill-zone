import React from 'react';
import { Container, Grid, Button } from '@material-ui/core';
import EmojiFoodBeverageIcon from '@material-ui/icons/EmojiFoodBeverage';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/Navbar.png'

import useStyles from './styles';

const Navbar = () => {
  const classes = useStyles();
  const homepage = window.location.pathname.split('/')[1];
  
  return (
    <Container className={classes.appBar} color="inherit">
      <Grid container>
        <Grid item xs={12} sm={8} container align="center">
          <div className={classes.brandContainer}>
            <img className={classes.image} src={logo} alt="icon" height="60" />
          </div>
        </Grid>
        {
          homepage === '' && <Button style={{ minHeight: 10, minWidth: 80 }} component={Link} to="/lunch" variant="contained" color="primary" > Lunch Time <EmojiFoodBeverageIcon style={{ margin: 10 }} /> </Button>
        }
      </Grid>
    </Container>
  );
};

export default Navbar;
