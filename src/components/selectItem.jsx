import React, { useEffect } from 'react';
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
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
    textarea: {
        resize: "both"
    },
    title: {
        marginLeft: 10
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(1),
        paddingLeft: 20,
        paddingRight: 20,
    },

});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
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

export default function SelectItem(props) {
    const dir = document.getElementsByTagName('html')[0].getAttribute('dir');

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
        smalltable: {
            minWidth: 150,
        },
        container: {
            maxHeight: 300,
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
        search: {
            position: 'relative',
        },
        searchIcon: {
            height: '100%',
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
        },
        inputInput: {
            // width: '90%',
            paddingLeft: '30px',
            paddingRight: '30px',
            borderBottom: '1px solid #CACACA'

        },

    }));

    const classes = useStyles();

    const [showError, setShowError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);

    const [current, setCurrent] = React.useState(-1);

    const [contactingServer, setContactingServer] = React.useState(false);

    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [typingTimeout, setTypingTimeout] = React.useState(0);

    let searchStr = '';
    const [allItems, set_allItems] = React.useState([]);

    async function getAllItemList(numberOfRows, search = "") {
        try {
            setShowBackdrop(true);
            let url = config["baseurl"] + "/api/material/list?count=" + numberOfRows + "&offset=" + 0 + "&search=" + search;
            axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
            const { data } = await axios.get(url);
            console.log(data);

            set_allItems(data.list.docs);
            setShowBackdrop(false);
        }
        catch (e) {
            setShowBackdrop(false);
            console.log("Error in getting all items");
            setErrorMessage("Error in getting all items");
            setShowError(true);
        }
    }

    useEffect(() => {
        getAllItemList(10000, "");
    }, []);

    const handleSave = async () => {
        // props.onSelect(props.items[current]);
        props.onSelect(allItems[current]);
        // try {
        //     setContactingServer(true);
        //     let url = config["baseurl"] + "/api/projectplace/add";

        //     let postObj = {};
        //     postObj["place"] = props.items[current]._id;
        //     postObj["type"] = props.type;
        //     postObj["project"] = props.project._id;

        //     console.log(postObj);

        //     axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

        //     const response = await axios.post(url, postObj);

        //     console.log("successfully Saved");
        //     setContactingServer(false);
        //     props.onSelect();
        // }
        // catch (e) {
        //     if (e.response) {
        //         console.log("Error in creating");
        //         setErrorMessage(e.response.data["message"]);
        //     }
        //     else {
        //         console.log("Error in creating");
        //         setErrorMessage("Error in creating: ", e.message);
        //     }
        //     setShowError(true);
        //     setContactingServer(false);
        // }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowError(false);
    };

    const handleCloseBackDrop = () => {

    };

    const handleClick = (event, index) => {
        setCurrent(index);
    };

    const onSearchChange = (event) => {
        searchStr = event.target.value;
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        const tt = setTimeout(() => {
            getAllItemList(10000, searchStr);
        }, 1000);

        setTypingTimeout(tt);
    };

    return (
        <div>
            <Dialog fullWidth={true} onClose={props.noConfirmationDialogAction} aria-labelledby="customized-dialog-title" open={true}>
                <DialogTitle id="alert-dialog-title">{"Select " + props.type}</DialogTitle>
                <DialogContent>
                    <Paper className={classes.paper}>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Search"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={onSearchChange}
                            />
                        </div>

                        <TableContainer className={classes.container}>
                            <Table className={classes.smalltable} stickyHeader aria-labelledby="tableTitle" size='small' aria-label="enhanced table" >
                                <TableBody>
                                    {allItems.map((row, index) => {
                                        return (
                                            <TableRow hover tabIndex={-1} key={"" + index} selected={index === current} onClick={(event) => handleClick(event, index)} >
                                              <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + (index + 1) + ". " + row.name }</TableCell> 
                                                {/* {!props.editable && <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + (index + 1) + ". " + row.name }</TableCell>}
                                                {props.editable && <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + (index + 1) + ". " + row.code +"-->" + row.hsncode +"-->" + row.productCategoryId +" -->"+ row.name + "-->" + row.description + "-->"+ row.uomId }</TableCell>} */}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </DialogContent>

                <DialogActions>
                    <Button variant="contained" color="primary" onClick={props.closeAction} disabled={contactingServer}>Cancel</Button>
                    <Button style={{ marginLeft: 10 }} variant="contained" color="primary" onClick={handleSave} disabled={contactingServer}>Save</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={showError} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>

            <Backdrop className={classes.backdrop} open={showBackdrop} onClick={handleCloseBackDrop}>
                <CircularProgress color="inherit" />
            </Backdrop>

        </div>
    );
}
