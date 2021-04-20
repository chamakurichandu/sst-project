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
        { id: 'qtyinstock', numeric: false, disablePadding: false, label: 'Qty In Stock' },
        { id: 'qty', numeric: false, disablePadding: false, label: 'Qty' },
        { id: 'qty_for_project', numeric: false, disablePadding: false, label: 'Qty For Project' },
        { id: 'qty_released_for_project', numeric: false, disablePadding: false, label: 'Qty Released For Project' },

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

export default function ReleaseMaterialIndent(props) {
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
    const [showBackDrop, setShowBackDrop] = React.useState(false);

    const [items, set_items] = React.useState([]);
    const [allItems, set_allItems] = React.useState([]);
    const [uoms, set_uoms] = React.useState([]);
    const [warehouseStocks, setWarehouseStocks] = React.useState([]);
    const [projectStocks, setProjectStocks] = React.useState([]);

    async function getWarehouseInventory() {
        try {
            setShowBackDrop(true);
            let url = config["baseurl"] + "/api/storedmaterial/specificlist?warehouse=" + props.warehouse._id;
            axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
            let postObj = {};
            postObj["materials"] = props.currentMaterialIndent.indent.materials;

            const { data } = await axios.post(url, postObj);
            console.log("getWarehouseInventory: ", data);
            setWarehouseStocks(data.list);

            setShowBackDrop(false);
        }
        catch (e) {
            setShowBackDrop(false);
            if (e.response) {
                setErrorMessage(e.response.data.message);
            }
            else {
                setErrorMessage("Error in getting list");
            }
            setShowError(true);
        }
    }


    async function getProjectInventory() {
        try {
            let ids = [];
            props.currentMaterialIndent.indent.materials.forEach(material => {
                ids.push(material.item);
            })
            setShowBackDrop(true);
            let url = config["baseurl"] + `/api/project/material-project-qty?_id=${props.currentMaterialIndent.project._id}&mats=${ids.join(',')}`;
            console.log('url: ', url);
            axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

            const { data } = await axios.get(url);
            console.log("getProjectInventory: ", data);
            console.log('-------------------------------')
            setProjectStocks(data.values);

            setShowBackDrop(false);
        }
        catch (e) {
            setShowBackDrop(false);
            if (e.response) {
                setErrorMessage(e.response.data.message);
            }
            else {
                setErrorMessage("Error in getting list");
            }
            setShowError(true);
        }
    }


    const handleRelease = async () => {
        setShowError(false);
        set_current_warehouse_error(null);

        try {
            setShowBackDrop(true);
            let url = config["baseurl"] + "/api/materialindent/release";

            let postObj = {};
            postObj["id"] = props.currentMaterialIndent.indent._id;

            console.log(postObj);

            axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

            const response = await axios.post(url, postObj);
            console.log(response);
            console.log("successfully Saved");
            setShowBackDrop(false);

            props.closeAction();
        }
        catch (e) {
            if (e.response) {
                console.log("Error in releasing");
                setErrorMessage(e.response.data["message"]);
            }
            else {
                console.log("Error in releasing");
                setErrorMessage("Error in creating: ", e.message);
            }
            setShowError(true);
            setShowBackDrop(false);
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
        getWarehouseInventory();
        getProjectInventory();
    }, []);

    const getProjectQty=(id)=>{
        
        for (let i = 0; i < projectStocks.length; ++i) {
            if (projectStocks[i].material === id) {
                return projectStocks[i].project_qty;
            }
        }
        return null;
        // console.log('project qty: ', projectStocks.filter(item=> item.material === id)[0].project_qty.id);
        //    return projectStocks[id];
        
        
    }

    const getReleasedQty=(id)=>{

        for (let i = 0; i < projectStocks.length; ++i) {
            if (projectStocks[i].material === id) {
                return projectStocks[i].released_qty;
            }
        }
        return null;
        // console.log('release qty: ', projectStocks.filter(item=> item.material === id)[0].released_qty.id);
        // return projectStocks[id];
    }
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

    const getItem = (id) => {
        for (let i = 0; i < warehouseStocks.length; ++i) {
            if (warehouseStocks[i].material._id === id) {
                return warehouseStocks[i];
            }
        }
        return null;
    };

    return (
        <div>
            <Dialog fullScreen TransitionComponent={Transition} onClose={props.noConfirmationDialogAction} aria-labelledby="customized-dialog-title" open={true}>
                <DialogTitle id="alert-dialog-title"> {(props.materialReleased?"Released Material Indent : ":"Release Material Indent : ") + props.currentMaterialIndent.indent.code}</DialogTitle>
                <DialogContent>
                    <Paper className={classes.paper}>
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
                                    {projectStocks.length > 0 && warehouseStocks.length > 0 && props.currentMaterialIndent.indent.materials.map((row, index) => {
                                        let disable = true;//(parseInt(row.qtyOrdered) >= parseInt(row.qty));
                                        const item = getItem(row.item);
                                        return (
                                            <TableRow hover tabIndex={-1} key={"" + index} selected={index === current} >
                                                <TableCell width={200} align={dir === 'rtl' ? 'right' : 'left'}>{"" + (index + 1) + ". " + (item != null ? item.material.name : "")}</TableCell>
                                                <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + (item != null ? item.material.description : "")}</TableCell>
                                                <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + (() => {
                                                    if(item) {
                                                        if(item.stored) {
                                                            return item.stored.qty;
                                                        } else {
                                                            return 0;
                                                        }
                                                    } else {
                                                        return 0;
                                                    }
                                                })()}</TableCell>
                                                <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + row.qty}</TableCell>
                                                <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{getProjectQty(row.item)}</TableCell>
                                                <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{getReleasedQty(row.item)}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </DialogContent>

                <DialogActions>
                    <Button variant="contained" color="primary" onClick={props.closeAction} disabled={contactingServer}>{(props.materialReleased?"back":"Cancel")}</Button>
                   {(props.materialReleased?"": <Button style={{ marginLeft: 10 }} variant="contained" color="primary" onClick={handleRelease} disabled={contactingServer}>Release</Button>)}
                </DialogActions>
            </Dialog>

            <Snackbar open={showError} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>

            {/* <Backdrop className={classes.backdrop} open={showBackDrop} onClick={handleCloseBackDrop}> */}
            {showBackDrop && <CircularProgress color="inherit" />}
            {/* </Backdrop> */}

        </div>
    );
}
