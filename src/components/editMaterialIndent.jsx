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
import cloneDeep from 'lodash/cloneDeep';
import Slide from '@material-ui/core/Slide';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function EnhancedTableHead(props) {
    const dir = document.getElementsByTagName('html')[0].getAttribute('dir');
    const setDir = (dir === 'rtl' ? true : false);

    const headCells = [
        { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
        { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
        { id: 'atysurveyed', numeric: false, disablePadding: false, label: 'Qty Surveyed' },
        { id: 'qtyordered', numeric: false, disablePadding: false, label: 'QtyOrdered' },
        { id: 'qty', numeric: false, disablePadding: false, label: 'Qty' },
    ];
    const { classes, order, orderBy, numSelected, rowCount, onRequestSort } = props;
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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddMaterialIndent(props) {
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
            minWidth: 300,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        smalltable: {
            minWidth: 150,
        },
        container: {
            // maxHeight: 300,
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

    const [currentWarehouse, setCurrentWarehouse] = React.useState(-1);
    const [current_warehouse_error, set_current_warehouse_error] = React.useState(null);

    const [contactingServer, setContactingServer] = React.useState(false);
    const [showBackdrop, setShowBackdrop] = React.useState(false);

    const [items, set_items] = React.useState([]);

    const handleSave = async () => {
        setShowError(false);
        set_current_warehouse_error(null);

        let errorOccurred = false;
        if (currentWarehouse === -1) {
            set_current_warehouse_error("warehouse required");
            errorOccurred = true;
        }

        let qtyNotZero = 0;
        for (let i = 0; i < items.length; ++i) {
            if (parseInt(items[i].qtyToOrder) !== 0) {
                ++qtyNotZero
            }
            console.log("" + parseInt(items[i].qtyOrdered) + " , " + parseInt(items[i].qtyToOrder) + " , " + parseInt(items[i].qty));
            if (parseInt(items[i].qtyOrdered) + parseInt(items[i].qtyToOrder) > parseInt(items[i].qty)) {
                setErrorMessage("Cannot exceed qty allocated");
                setShowError(true);
                return;
            }
        }

        if (qtyNotZero === 0) {
            setErrorMessage("Atleast one item qty should be more than zero");
            setShowError(true);
            errorOccurred = true;
        }
        if (errorOccurred)
            return;

        try {
            setShowBackdrop(true);
            let url = config["baseurl"] + "/api/materialindent/add";

            let postObj = {};
            postObj["materials"] = [];
            for (let i = 0; i < items.length; ++i) {
                if (parseInt(items[i].qtyToOrder) > 0)
                    postObj["materials"].push({ item: items[i]._id, qty: parseInt(items[i].qtyToOrder) });
            }

            postObj["work"] = props.workData.work._id;
            postObj["warehouse"] = props.warehouses[currentWarehouse]._id;

            console.log(postObj);

            axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

            const response = await axios.post(url, postObj);

            console.log("successfully Saved");
            setShowBackdrop(false);

            props.closeAction();
        }
        catch (e) {
            if (e.response) {
                console.log("Error in creating");
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

    useEffect(() => {
        let newItems = [];
        const surveyMats = props.workData.work.survey_materials;
        for (let i = 0; i < surveyMats.length; ++i) {
            for (let k = 0; k < props.allItems.length; ++k) {
                if (surveyMats[i].item === props.allItems[k]._id) {
                    let newCopy = cloneDeep(props.allItems[k]);
                    newCopy.qty = surveyMats[i].qty;
                    newCopy.qtyOrdered = 0;
                    newCopy.qtyToOrder = 0;
                    newItems.push(newCopy);
                    break;
                }
            }
        }

        for (let i = 0; i < props.materialIndents.length; ++i) {
            const mats = props.materialIndents[i].materials;
            for (let k = 0; k < mats.length; ++k) {
                for (let m = 0; m < newItems.length; ++m) {
                    if (mats[k].item === newItems[m]._id) {
                        newItems[m].qtyOrdered += mats[k].qty;
                    }
                }
            }
        }

        set_items(newItems);

    }, []);

    const handleWarehouseChange = (event) => {
        setCurrentWarehouse(event.target.value);
        set_current_warehouse_error(null);
    };

    const set_item_qty_for = (value, index) => {
        let newItems = [...items];
        newItems[index].qtyToOrder = value;
        set_items(newItems);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <div>
            <Dialog fullScreen TransitionComponent={Transition} onClose={props.noConfirmationDialogAction} aria-labelledby="customized-dialog-title" open={true}>
                <DialogTitle id="alert-dialog-title">{"Create Material Indent"}</DialogTitle>
                <DialogContent>
                    <Paper className={classes.paper}>
                        <form className={classes.papernew} autoComplete="off" noValidate>
                            <FormControl size="small" variant="outlined" className={classes.formControl}>
                                <InputLabel id="type-select-label">Warehouse *</InputLabel>
                                <Select
                                    labelId="type-select-label"
                                    id="type-select-label"
                                    value={currentWarehouse === -1 ? "" : currentWarehouse}
                                    onChange={handleWarehouseChange}
                                    label="Warehouse *"
                                    disabled
                                >
                                    {props.warehouses && props.warehouses.map((row, index) => {
                                        return (
                                            <MenuItem key={"" + index} value={index}>{"" + row.name}</MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                            {current_warehouse_error && <Alert className={classes.alert} severity="error"> {current_warehouse_error} </Alert>}
                            <br></br>
                            <TableContainer className={classes.container}>
                                <Table className={classes.smalltable} stickyHeader aria-labelledby="tableTitle" size='small' aria-label="enhanced table" >
                                    <EnhancedTableHead
                                        classes={classes}
                                        numSelected={0}
                                        order={order}
                                        orderBy={orderBy}
                                        onRequestSort={handleRequestSort}
                                        rowCount={items.length}
                                    />

                                    <TableBody>
                                        {items.map((row, index) => {
                                            let disable = true;//(parseInt(row.qtyOrdered) >= parseInt(row.qty));
                                            return (
                                                <TableRow hover tabIndex={-1} key={"" + index} selected={index === current} >
                                                    <TableCell width={200} align={dir === 'rtl' ? 'right' : 'left'}>{"" + (index + 1) + ". " + row.name}</TableCell>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + row.description}</TableCell>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + row.qty}</TableCell>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + row.qtyOrdered}</TableCell>
                                                    <TableCell width={150} align={dir === 'rtl' ? 'right' : 'left'} >
                                                        <TextField size="small" id={"formControl_qty_" + index} type="number" value={row.qtyToOrder} disabled={disable}
                                                            variant="outlined" onChange={(event) => { set_item_qty_for(event.target.value, index) }} />
                                                    </TableCell>

                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </form>
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
