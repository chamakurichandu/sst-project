import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import AlertIcon from '../assets/svg/ss/bell.svg';
import lstrings from '../lstrings.js';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MuiAlert from '@material-ui/lab/Alert';
import MeasureIcon from '../assets/svg/ss/measure-tape.svg';
import axios from 'axios';
import config from "../config.json";
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    image: {
        position: 'absolute',
        left: theme.spacing(2),
        top: theme.spacing(2.5),
        color: theme.palette.grey[500],
    },
    textarea: {
        resize: "both"
    },
    title: {
        marginLeft: 30
    }
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            {/* <img src={MeasureIcon} className={classes.image} width='25' alt="" /> */}
            <Typography className={classes.title} variant="h6">{children}</Typography>
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

export default function UpdateActivity(props) {
    const useStyles = makeStyles((theme) => ({
        root: {
            width: 'calc(100%)',
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
            paddingLeft: 20,
            paddingRight: 20,
        },
        papernew: {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[2],
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            outline: 'none',
            padding: '10px 20px',
            width: '100%',
            borderRadius: '5px',
            overflow: 'auto',
            depth: 1,
            // marginTop: '10px',
            // marginBottom: '10px',
        },
        grid: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
            marginBottom: '10px',
        },
        inputFields: {
            marginTop: 10,
        },
        submit: {
            display: 'flex',
            justifyContent: 'flex-end',
            // marginTop: '15px',
            // margin: '5px',
        },
        formControl: {
            marginTop: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }));

    const classes = useStyles();

    const [open, setOpen] = React.useState(true);

    const [showError, setShowError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);

    const [name, set_name] = React.useState(props.activityName);
    const [name_error, set_name_error] = React.useState(null);

    const [surveyStatus, setSurveyStatus] = React.useState(props.activity.step_status[0]);
    const [installationStatus, setInstallationStatus] = React.useState(props.activity.step_status[1]);
    const [commissioningStatus, setCommissioningStatus] = React.useState(props.activity.step_status[2]);
    const [acceptanceStatus, setAcceptanceStatus] = React.useState(props.activity.step_status[3]);
    const [handOverStatus, setHandOverStatus] = React.useState(props.activity.step_status[4]);

    const [contactingServer, setContactingServer] = React.useState(false);

    const statusStrings = ["Not Started", "WIP", "Completed", "Hold"];

    const handleSave = async () => {
        try {
            setContactingServer(true);
            let url = config["baseurl"] + "/api/work/update";

            let postObj = {};
            postObj["step_status"] = [surveyStatus, installationStatus, commissioningStatus, acceptanceStatus, handOverStatus];

            let updateObj = { _id: props.activity._id, updateParams: postObj };

            axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

            const response = await axios.patch(url, updateObj);

            console.log("successfully Saved");
            setContactingServer(false);
            props.onSavedAction();
        }
        catch (e) {
            if (e.response) {
                console.log("Error in editing 1");
                console.log("e.response: ", e.response);
                setErrorMessage(e.response.data["message"]);
            }
            else {
                console.log("Error in editing 2");
                setErrorMessage("Error in editing: ", e.message);
            }
            setShowError(true);
            setContactingServer(false);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowError(false);
    };

    const handleChange = (event, index) => {

        switch (index) {
            case 0:
                setSurveyStatus(event.target.value);
                break;
            case 1:
                setInstallationStatus(event.target.value);
                break;
            case 2:
                setCommissioningStatus(event.target.value);
                break;
            case 3:
                setAcceptanceStatus(event.target.value);
                break;
            case 4:
                setHandOverStatus(event.target.value);
                break;
        }
    };

    return (
        <div>
            <Dialog fullWidth={true} onClose={props.noConfirmationDialogAction} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="alert-dialog-title">{"Edit Section"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>

                    </DialogContentText>
                    {/* <DialogContentText id="alert-dialog-description">{props.message}</DialogContentText> */}
                    <form className={classes.papernew} autoComplete="off" noValidate>
                        <TextField className={classes.inputFields} id="formControl_name" defaultValue={name}
                            label="Name *" variant="outlined" disabled
                            onChange={(event) => { set_name(event.target.value); set_name_error(null); }} />
                        {name_error && <Alert className={classes.alert} severity="error"> {name_error} </Alert>}
                        <span>{props.activity.step[0]}:   </span>
                        <Select
                            label={props.activity.step[0]}
                            labelId="survey"
                            id="survey"
                            value={surveyStatus}
                            onChange={(event) => handleChange(event, 0)}
                            variant="outlined"
                        >
                            {statusStrings.map((row, index) => {
                                return (
                                    <MenuItem key={"" + index} value={index}>{row}</MenuItem>
                                );
                            })}
                        </Select>
                        <span>{props.activity.step[1]}:   </span>
                        <Select
                            label={props.activity.step[1]}
                            labelId="installation"
                            id="installation"
                            value={installationStatus}
                            onChange={(event) => handleChange(event, 1)}
                            variant="outlined"
                        >
                            {statusStrings.map((row, index) => {
                                return (
                                    <MenuItem key={"" + index} value={index}>{row}</MenuItem>
                                );
                            })}
                        </Select>
                        <span>{props.activity.step[2]}:   </span>
                        <Select
                            label={props.activity.step[2]}
                            labelId="commissioning"
                            id="commissioning"
                            value={commissioningStatus}
                            onChange={(event) => handleChange(event, 2)}
                            variant="outlined"
                        >
                            {statusStrings.map((row, index) => {
                                return (
                                    <MenuItem key={"" + index} value={index}>{row}</MenuItem>
                                );
                            })}
                        </Select>
                        <span>{props.activity.step[3]}:   </span>
                        <Select
                            label={props.activity.step[3]}
                            labelId="acceptance"
                            id="acceptance"
                            value={acceptanceStatus}
                            onChange={(event) => handleChange(event, 3)}
                            variant="outlined"
                        >
                            {statusStrings.map((row, index) => {
                                return (
                                    <MenuItem key={"" + index} value={index}>{row}</MenuItem>
                                );
                            })}
                        </Select>
                        <span>{props.activity.step[4]}:   </span>
                        <Select
                            label={props.activity.step[4]}
                            labelId="handover"
                            id="handover"
                            value={handOverStatus}
                            onChange={(event) => handleChange(event, 4)}
                            variant="outlined"
                        >
                            {statusStrings.map((row, index) => {
                                return (
                                    <MenuItem key={"" + index} value={index}>{row}</MenuItem>
                                );
                            })}
                        </Select>
                    </form>
                </DialogContent>

                <DialogActions>
                    <Button variant="contained" color="secondary" onClick={props.deleteAction} disabled={contactingServer}>Delete</Button>
                    <Button variant="contained" color="primary" onClick={props.closeAction} disabled={contactingServer}>Cancel</Button>
                    <Button style={{ marginLeft: 10 }} variant="contained" color="primary" onClick={handleSave} disabled={contactingServer}>Save</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={showError} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>

        </div >
    );
}
