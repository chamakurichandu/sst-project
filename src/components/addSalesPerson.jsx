import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import config from "../config.json";
import { Auth } from 'aws-amplify';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const Joi = require('joi');

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const exampleWrapperStyle = {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};
const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        overflow: 'auto',
        justifyContent: 'center',
        height: '100%',
        '@media (max-height: 420px)': {
            alignItems: "flex-start",
        },
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        // padding: theme.spacing(1.5, 1),
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        outline: 'none',
        padding: '10px 20px',
        width: '500px',
        borderRadius: '10px',
        overflow: 'auto',
        depth: 3,
        margin: '5px',
        '@media (max-width: 420px)': {
            padding: "10px 5px",
        }
    },
    paper2: {
        backgroundColor: "#f2f2f2",
        boxShadow: theme.shadows[5],
        // padding: theme.spacing(1.5, 1),
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        outline: 'none',
        padding: '10px 20px',
        width: '500px',
        borderRadius: '10px',
        overflow: 'auto',
        margin: '5px',
        '@media (max-width: 420px)': {
            padding: "10px 5px",
        }
    },
    feedbackText: {
        height: '120px',
        width: '250px',
        borderRadius: '10px',
        margin: '5px 0px 10px',
    },
    submit: {
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '10px',
    },
    h3: {
        textAlign: 'center',
        // margin: 0,
    },
    inputFields: {
        marginTop: 10,
    },
    card: {
        // margin: '0px 30px',
        position: 'relative'
    },
    profileImage: {
        position: 'absolute',
        right: '20px',
        top: '20px',
    },
    margin: {
        marginLeft: '8px'
    },
    pos: {
        display: 'flex',
        alignItems: 'center',
        padding: '2px 5px',
        '@media (max-width: 420px)': {
            fontSize: "14px",
            fontWeight: '400'
        }
    },
    title: {
        textAlign: 'left',
        fontWeight: '800'
    }
}));

export default function AddSalesPerson(props) {
    const classes = useStyles();

    const [showError, setShowError] = React.useState(false);
    const [emailID, setEmailID] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [emailError, setEmailError] = React.useState(null);
    const [passwordError, setPasswordError] = React.useState(null);
    const [contactingServer, setContactingServer] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);

    const validateData = () => {
        const schema = Joi.object({
            emailID: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }).required(),
            password: Joi.string().min(6).max(100).required(),
        });
        const { error } = schema.validate({
            emailID: emailID.trim(),
            password: password.trim(),
        }, { abortEarly: false });
        const allerrors = {};
        if (error) {
            for (let item of error.details)
                allerrors[item.path[0]] = item.message;
        }

        return allerrors;
    }

    const handleSave = async () => {

        setEmailError(null);
        setPasswordError(null);

        const errors = validateData();

        let errorOccured = false;
        if (errors["emailID"]) {
            setEmailError(errors["emailID"]);
            errorOccured = true;
        }
        if (errors["password"]) {
            setPasswordError(errors["password"]);
            errorOccured = true;
        }

        if (errorOccured)
            return;

        setContactingServer(true);

        try {
            let sessionData = await Auth.currentSession();
            try {
                let url = config["baseurl"] + "/org/" + config["org"] + "/event/" + config["event"] + "/user";
                axios.defaults.headers.common['Authorization'] = sessionData["idToken"]["jwtToken"];

                let postObj = {};
                postObj["email"] = emailID;
                postObj["password"] = password;
                postObj["groups"] = ["sales", "attendee"];
                postObj["org_id"] = config["org"];
                postObj["event_id"] = config["event"];
                postObj["stall_id"] = props.stall_id;

                await axios.post(url, postObj);

                setContactingServer(false);
                props.close();
                return
            }
            catch (e) {
                console.log("Error in creating sales person");
                setErrorMessage("Error in getting Stalls list");
                setShowError(true);
            }
            setContactingServer(false);
        }
        catch (e) {
            console.log("error in getting session");
            setContactingServer(false);
            props.onAuthFailure();
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowError(false);
    };

    return (
        <div style={exampleWrapperStyle}>
            <Modal aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description" className={classes.modal} open={true}>
                <Fade in={true}>
                    <form className={classes.paper} autoComplete="off" noValidate>
                        <h3 className={classes.h3} id="staticBackdropLabel">Add Sales Person</h3>
                        <TextField className={classes.inputFields} id="formControlemail" defaultValue={emailID} label="Email" variant="outlined" onChange={(event) => { setEmailID(event.target.value); setEmailError(null); }} />
                        {emailError && <Alert className={classes.alert} severity="error"> {emailError} </Alert>}
                        <TextField className={classes.inputFields} id="formControlPassword" defaultValue={password} label="Password" variant="outlined" onChange={event => { setPassword(event.target.value); setPasswordError(null); }} />
                        {passwordError && <Alert className={classes.alert} severity="error"> {passwordError} </Alert>}
                        <div className={classes.submit}>
                            <Button variant="contained" color="primary" onClick={props.close} disabled={contactingServer}>Cancel</Button>
                            <Button style={{ marginLeft: 5 }} variant="contained" color="primary" onClick={handleSave} disabled={contactingServer}>Save</Button>
                        </div>
                    </form>
                </Fade>
            </Modal>
            <Snackbar open={showError} autoHideDuration={60000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>

        </div>
    );

}
