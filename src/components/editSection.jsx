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

export default function EditSection(props) {
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
            // padding: '10px 20px',
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

    const [name, set_name] = React.useState(props.item.name);
    const [name_error, set_name_error] = React.useState(null);

    const [contactingServer, setContactingServer] = React.useState(false);

    const handleSave = async () => {
        try {
            setContactingServer(true);
            let url = config["baseurl"] + "/api/subdivision/update";

            let postObj = {};
            postObj["name"] = name;

            let updateObj = { _id: props.item._id, updateParams: postObj };

            axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

            const response = await axios.patch(url, updateObj);

            console.log("successfully Saved");
            setContactingServer(false);
            props.onNewSaved();
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
                            label="Name *" variant="outlined"
                            onChange={(event) => { set_name(event.target.value); set_name_error(null); }} />
                        {name_error && <Alert className={classes.alert} severity="error"> {name_error} </Alert>}
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

        </div>
    );
}
