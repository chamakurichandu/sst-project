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
            <img src={CategoriesIcon} className={classes.image} width='25' alt="" />
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

    const [filename, set_filename] = React.useState('');
    const [filename_error, set_filename_error] = React.useState(null);

    const [filePath, set_filePath] = React.useState('');
    const [file_error, set_file_error] = React.useState(null);

    const [showBackdrop, setShowBackdrop] = React.useState(false);

    const handleSave = async () => {
        let error_occured = false;
        if (!name || name.trim() === 0) {
            set_name_error("Name Requried");
            error_occured = true;
        }
        if (filePath.trim() === 0) {
            set_file_error("File Requried");
            error_occured = true;
        }

        if (error_occured)
            return;

        try {
            setShowBackdrop(true);
            let url = config["baseurl"] + "/api/document/add";

            let postObj = {};
            postObj["name"] = name.trim();
            postObj["type"] = props.type;
            postObj["path"] = filePath;
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

    const onFileSelected = (event) => {
        console.log(event.target.files[0]);

        let fileParts = event.target.files[0].name.split('.');
        console.log(fileParts);
        let file = { file: event.target.files[0], name: uuidv4() + "." + fileParts[1] };

        uploadFile(file)
    };

    const uploadFile = async (myfile) => {
        setShowBackdrop(true);

        console.log("Preparing the upload");
        let url = config["baseurl"] + "/api/cloud/sign_s3";
        axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
        const profileInfo = JSON.parse(window.localStorage.getItem("profile"));
        try {
            const response = await axios.post(url, {
                fileName: myfile.name,
                fileType: myfile.file.fileType,
                folder: "project_docs"
            });

            if (response) {
                var returnData = response.data.data.returnData;
                var signedRequest = returnData.signedRequest;

                // Put the fileType in the headers for the upload
                var options = { headers: { 'x-amz-acl': 'public-read', 'Content-Type': myfile.file.type } };
                try {
                    const result = await axios.put(signedRequest, myfile.file, options);

                    set_filename(myfile.file.name);
                    set_filePath(returnData.url);

                    setShowBackdrop(false);

                    console.log("Response from s3 Success: ", returnData.url);
                }
                catch (error) {
                    console.log("ERROR: ", JSON.stringify(error));
                    setShowBackdrop(false);
                    alert("ERROR " + JSON.stringify(error));
                }
            }
        }
        catch (error) {
            console.log("error: ", error);
            setShowBackdrop(false);
            alert(JSON.stringify(error));
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
                <DialogTitle id="alert-dialog-title">{"New Document: " + props.type}</DialogTitle>
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

                        <TextField className={classes.inputFields} id="formControl_filename" value={filename}
                            label="File *" variant="outlined" disabled
                            onChange={(event) => { set_filename(event.target.value); set_filename_error(null); }} />

                        <div style={{ marginTop: 10 }}>
                            <div style={{ marginTop: 5 }}>
                                <Button style={{ background: "#314293", color: "#FFFFFF" }} variant="contained" component="label" onChange={onFileSelected}>
                                    Upload Document
                                    <input type="file" hidden />
                                </Button>
                            </div>
                        </div>
                        {file_error && <Alert className={classes.alert} severity="error"> {file_error} </Alert>}
                    </form>
                </DialogContent>

                <DialogActions>
                    <Button variant="contained" color="primary" onClick={props.closeAction} >Cancel</Button>
                    <Button style={{ marginLeft: 10 }} variant="contained" color="primary" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={showError} autoHideDuration={60000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>

            <Backdrop className={classes.backdrop} open={showBackdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>

        </div>
    );
}
