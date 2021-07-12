import React, { memo, useState } from "react";
import PropTypes from 'prop-types';
import { Button, Dialog, DialogTitle, Paper, TextField } from "@material-ui/core";
import useStyles from './styles';
import { APICalls } from "../../services/API/APICalls";

function UserPopup(props) {
    const classes = useStyles();
    const [popupToggle, setPopupToggle] = useState(true);
    const [userDetails, setUserDetails] = useState('');
    const [passcode, setPasscode] = useState('');

    // Handle change name
    const handleChangeName = (event) => {
        const { value } = event.target;
        setUserDetails(value);
    }

    // Handle change passcode
    const handleChangePasscode = (event) => {
        const { value } = event.target;
        setPasscode(value);
    }

    // Handle user popup input
    const handleSubmit = (event) => {
        if (event.type === 'keyup' && event.key !== 'Enter') {
            return;
        }
        const roomID = window.location.pathname.split('/')[2];
        APICalls
            .getMeeting(roomID)
            .then((res) => {
                if (res.data !== null && res.data.passcode === passcode && userDetails.length > 0) {
                    props.submitHandle(userDetails, passcode);
                    setPopupToggle(false);
                } else {
                    alert('Wrong Passcode!');
                }
            })
    }

    return (
        <React.Fragment>
            <Dialog disableBackdropClick={true} onClose={() => setPopupToggle(false)} open={popupToggle}>
                <Paper onKeyUp={handleSubmit}>
                    <DialogTitle className={classes.userPopupTitle}>Enter Your Details</DialogTitle>
                    <div className={`${classes.popup}`}>
                        <TextField
                            required
                            title="Name"
                            className={classes.userPopupInput}
                            label="Name"
                            variant="outlined"
                            onChange={handleChangeName}
                            placeholder="Name"
                        />
                        <TextField
                            required
                            title="Passcode"
                            className={classes.userPopupInput}
                            label="Passcode"
                            variant="outlined"
                            onChange={handleChangePasscode}
                            placeholder="Passcode"
                        />
                        <Button size="large" variant="contained" color="primary" fullWidth onClick={handleSubmit}>START</Button>
                    </div>
                </Paper>
            </Dialog>
        </React.Fragment>
    )
}

UserPopup.propTypes = {
    submitHandle: PropTypes.func
}

export default memo(UserPopup);
