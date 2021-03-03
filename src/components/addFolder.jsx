import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';
import config from "../config.json";
import CategoriesIcon from '../assets/svg/ss/categories.svg';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { v4 as uuidv4 } from 'uuid';
import Snackbar from '@material-ui/core/Snackbar';
import titleImage from '../assets/svg/ss/folder.svg';

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
            <img src={titleImage} className={classes.image} width='25' alt="" />
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

export default function AddDocument(props) {
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
            padding: '10px 10px',
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
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },

    }));

    const classes = useStyles();

    const [open, setOpen] = React.useState(true);

    const [showError, setShowError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);

    const [name, set_name] = React.useState('');
    const [name_error, set_name_error] = React.useState(null);

    const [remark, set_remark] = React.useState('');
    const [remark_error, set_remark_error] = React.useState(null);

    const [showBackdrop, setShowBackdrop] = React.useState(false);

    const handleSave = async () => {
        let error_occured = false;
        if (!name || name.trim() === 0) {
            set_name_error("Name Requried");
            error_occured = true;
        }
        if (error_occured)
            return;

        try {
            setShowBackdrop(true);
            let url = config["baseurl"] + "/api/document/add";

            let postObj = {};
            postObj["name"] = name.trim();
            postObj["type"] = "folder";
            postObj["parent"] = props.parent;
            postObj["path"] = "folder-folder";
            postObj["remark"] = remark.trim();
            postObj["project"] = props.project._id;

            axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

            console.log("postObj: ", postObj);
            const response = await axios.post(url, postObj);

            console.log("successfully Saved");
            setShowBackdrop(false);
            props.onNewSaved();
            // props.history.push("/materials");
        }
        catch (e) {
            if (e.response) {
                console.log("Error in creating material");
                setErrorMessage(e.response.data["message"]);
            }
            else {
                console.log("Error in creating");
                setErrorMessage("Error in creating: ", e.message);
            }
            setShowError(true);
            setShowBackdrop(false);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowError(false);
    };

    return (
        <div>
            <Dialog fullWidth={true} onClose={props.noConfirmationDialogAction} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="alert-dialog-title">{"New Folder"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>

                    </DialogContentText>
                    {/* <DialogContentText id="alert-dialog-description">{props.message}</DialogContentText> */}
                    <form className={classes.papernew} autoComplete="off" noValidate>
                        <TextField className={classes.inputFields} id="formControl_name" defaultValue={name}
                            label="Name *" variant="outlined"
                            onChange={(event) => { set_name(event.target.value); set_name_error(null); }} />
                        {name_error && <Alert className={classes.alert} severity="error"> {name_error} </Alert>}
                        <TextField className={classes.inputFields} id="formControl_remark" defaultValue={remark}
                            label="Remark *" variant="outlined"
                            onChange={(event) => { set_remark(event.target.value); set_remark_error(null); }} />
                    </form>
                </DialogContent>

                <DialogActions>
                    {showBackdrop && <CircularProgress color="inherit" />}
                    {!showBackdrop && <Button variant="contained" color="primary" onClick={props.closeAction} >Cancel</Button>}
                    {!showBackdrop && <Button style={{ marginLeft: 10 }} variant="contained" color="primary" onClick={handleSave}>Save</Button>}
                </DialogActions>
            </Dialog>

            <Snackbar open={showError} autoHideDuration={60000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>

            {/* <Backdrop className={classes.backdrop} open={showBackdrop}>
                <CircularProgress color="inherit" />
            </Backdrop> */}

        </div>
    );
}
