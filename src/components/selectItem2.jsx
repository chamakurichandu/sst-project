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
import { format } from "date-fns";

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

function EnhancedTableHead(props) {
    const dir = document.getElementsByTagName('html')[0].getAttribute('dir');
    const setDir = (dir === 'rtl' ? true : false);

    const headCells = [
        { id: 'name', numeric: false, disablePadding: false, label: 'Item Name' },
        { id: 'scheduleddate', numeric: false, disablePadding: false, label: 'Scheduled Date' },
        { id: 'rate', numeric: false, disablePadding: false, label: 'Rate' },
        { id: 'qty', numeric: false, disablePadding: false, label: 'Qty' }
    ];

    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={!setDir ? 'left' : 'right'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

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

export default function SelectItem2(props) {
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
    }));

    const classes = useStyles();

    const [showError, setShowError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);

    const [current, setCurrent] = React.useState(-1);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');

    const [contactingServer, setContactingServer] = React.useState(false);

    const [showBackdrop, setShowBackdrop] = React.useState(false);

    const handleSave = async () => {
        props.onSelect(props.items[current]);
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

    const isSelectedAlready = (item) => {
        for (let i = 0; i < props.selectedItems.length; ++i) {
            if (item._id === props.selectedItems[i]._id && item.scheduled_date === props.selectedItems[i].scheduled_date)
                return true;
        }
        return false;
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
    };

    return (
        <div>
            <Dialog fullWidth={true} onClose={props.noConfirmationDialogAction} aria-labelledby="customized-dialog-title" open={true}>
                <DialogTitle id="alert-dialog-title">{"Select " + props.type}</DialogTitle>
                <DialogContent>
                    <Paper className={classes.paper}>
                        <TableContainer className={classes.container}>
                            <Table className={classes.smalltable} stickyHeader aria-labelledby="tableTitle" size='small' aria-label="enhanced table" >
                                <EnhancedTableHead
                                    classes={classes}
                                    numSelected={0}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={props.items.length}
                                />

                                <TableBody>
                                    {props.items.map((row, index) => {
                                        const color = isSelectedAlready(row) ? "gray" : "black";
                                        return (
                                            <TableRow hover tabIndex={-1} key={"" + index} selected={index === current} onClick={(event) => handleClick(event, index)} >
                                                <TableCell style={{ color: color }} align={dir === 'rtl' ? 'right' : 'left'}>{"" + (index + 1) + ". " + row.name}</TableCell>
                                                <TableCell style={{ color: color }} align={dir === 'rtl' ? 'right' : 'left'}>{"" + format(row.scheduled_date_conv, "dd-MM-yyyy")}</TableCell>
                                                <TableCell style={{ color: color }} align={dir === 'rtl' ? 'right' : 'left'}>{"" + row.rate}</TableCell>
                                                <TableCell style={{ color: color }} align={dir === 'rtl' ? 'right' : 'left'}>{"" + row.qty}</TableCell>
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
