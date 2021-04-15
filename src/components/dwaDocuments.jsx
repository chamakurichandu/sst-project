import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import exhibitorsLogo from '../assets/svg/ss/exhibition.svg';
import notFoundImage from '../assets/svg/ss/page-not-found.svg';
import profileLogo from '../assets/svg/ss/profile.svg';
import Button from '@material-ui/core/Button';
import EditImage from '@material-ui/icons/Edit';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import EnhancedTableToolbar from './enhancedToolbar';
import axios from 'axios';
import config from "../config.json";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Image, { Shimmer } from 'react-shimmer'
import { useHistory } from 'react-router-dom';
import lstrings from '../lstrings';
import Link from '@material-ui/core/Link';
import MaterialsImage from '../assets/svg/ss/cement.svg';
import DateFnsUtils from '@date-io/date-fns';
import SelectItem from './selectItem';
import cloneDeep from 'lodash/cloneDeep';
import TextField from '@material-ui/core/TextField';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function createData(slno, data) {
    return { slno, data };
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
    const dir = document.getElementsByTagName('html')[0].getAttribute('dir');
    const setDir = (dir === 'rtl' ? true : false);

    const headCells = [
        { id: 'slno', numeric: true, disablePadding: true, label: 'SL' },
        { id: 'itemcode', numeric: false, disablePadding: false, label: 'Item Code' },
        { id: 'hsncode', numeric: false, disablePadding: false, label: 'HSN Code' },
        { id: 'productcategory', numeric: false, disablePadding: false, label: 'Product Category' },
        { id: 'itemname', numeric: false, disablePadding: false, label: 'Item Name' },
        // { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
        { id: 'uom', numeric: false, disablePadding: false, label: 'UOM' },
        { id: 'unit_price', numeric: false, disablePadding: false, label: 'Unit Price' },
        { id: 'frieght_insurence', numeric: false, disablePadding: false, label: 'Freight & Insurance Charges' },
        { id: 'igst', numeric: false, disablePadding: false, label: 'IGST' },
        { id: 'cgst', numeric: false, disablePadding: false, label: 'CGST' },
        { id: 'sgst', numeric: false, disablePadding: false, label: 'SGST' },
        { id: 'others', numeric: false, disablePadding: false, label: 'Others If Any' },
        { id: 'gst_total', numeric: false, disablePadding: false, label: 'GST Total' },
        { id: 'total_unity_cost', numeric: false, disablePadding: false, label: 'Total Unity Cost (All Inclusive' },
        { id: 'quantity', numeric: false, disablePadding: false, label: 'Quantity' },
        { id: 'estimated_quantity', numeric: false, disablePadding: false, label: 'Estimated Quantity' },
        { id: 'work_order_quantity', numeric: false, disablePadding: false, label: 'Work Order Quantity' },
        { id: 'work_done_quantity', numeric: false, disablePadding: false, label: 'Work Done Quantity' },
        { id: 'invoive_quantity', numeric: false, disablePadding: false, label: 'Invoiced Quantity' },
        { id: 'progress', numeric: false, disablePadding: false, label: '% Progress' },
        { id: 'action', numeric: false, disablePadding: false, label: 'Actions' },
        { id: 'delete', numeric: false, disablePadding: false, label: 'Remove Items' },
    ];
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    return (
        <TableHead>
            <TableRow >
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

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

export default function DwaDocuments(props) {

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
        table: {
            minWidth: 750,
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: "hidden",
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
        grid: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
            marginBottom: '10px',
        },
        total: {
            textAlign: "left",
        },
        totalDetails: {
            marginRight: '20px',
        },
        totalAttendes: {
            display: 'flex',
            alignItems: 'baseline',
            width: '30%',
            // marginRight: '80px'
            // borderRight: "1px solid #CACACA",
            '@media (max-width: 600px)': {
                width: "300px",
            }
        },
        progress: {
            width: '70%',
            '@media (max-width: 600px)': {
                width: "600px",
            }
        },
        h1: {
            margin: '0px',
            paddingRight: '10px',
            paddingLeft: '10px'
        },
        vl: {
            border: '1px solid #CACACA',
            height: ' 40px',
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
        inputRoot: {
            width: '100%',
        },
        button: {
            background: 'white',
            textTransform: 'capitalize'
        },
        exhibitor_image: {
            marginRight: '10px'
        },
        flex: {
            display: 'flex',
            alignItems: 'center'
        },
        dot: {
            height: '10px',
            width: '10px',
            backgroundColor: '#bbb',
            borderRadius: '50%',
            display: 'inline-block',
            marginRight: '7px',
            marginLeft: '7px',
        },
        dotActive: {
            height: '10px',
            width: '10px',
            backgroundColor: '#4287F5',
            borderRadius: '50%',
            display: 'inline-block',
            marginRight: '7px',
            marginLeft: '7px',
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
            textAlign: 'center'
        },
        addButton: {
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'flex-end',
            width: '70%',

            // marginRight: '80px'
            // borderRight: "1px solid #CACACA",
            '@media (max-width: 600px)': {
                width: "300px",
            }
        },

    }));

    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense] = React.useState(true);
    const [showError, setShowError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [rows, setRows] = React.useState([]);
    const [totalCount, setTotalCount] = React.useState(0);
    const [showBackDrop, setShowBackDrop] = React.useState(false);
    const [uploadedDocs, set_uploaded_docs] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [showSelectItem, setShowSelectItem] = React.useState(false);
    const [showSaveBtn, set_showSaveBtn] = React.useState(false);
    const [items, set_items] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [editableIndex, set_editableIndex] = React.useState(null);
    const importMaterial = React.useRef();
    const pageLimits = [10, 25, 50];
    let offset = 0;

    // async function getList(numberOfRows, search = "") {
    //     try {
    //         console.log("page: ", page);
    //         let url = config["baseurl"] + "/api/material/list?count=" + numberOfRows + "&offset=" + offset + "&search=" + search;
    //         axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
    //         const { data } = await axios.get(url);
    //         console.log(data);
    //         setTotalCount(data.list.totalDocs);
    //         let newRows = [];
    //         for (let i = 0; i < data.list.docs.length; ++i) {
    //             newRows.push(createData((offset + i + 1),
    //                 data.list.docs[i]
    //             ));
    //         }

    //         setRows(newRows);
    //     }
    //     catch (e) {
    //         console.log("Error in getting users list");
    //         setErrorMessage("Error in getting users list");
    //         setShowError(true);
    //     }
    // }

    async function getPCList() {
        try {
            let url = config["baseurl"] + "/api/productcategory/list";
            axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
            const { data } = await axios.get(url);
            props.setProductCategories(data.list);
            getUOMList();
        }
        catch (e) {
            console.log("Error in getting product categories list");
            setErrorMessage("Error in getting product categories list");
            setShowError(true);
        }
    }

    async function getUOMList() {
        try {
            let url = config["baseurl"] + "/api/uom/list";
            axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
            const { data } = await axios.get(url);
            props.setUOMs(data.list);
            setRows(props.project.boq_items)
            // getList(rowsPerPage);
        }
        catch (e) {
            console.log("Error in getting UOMs list");
            setErrorMessage("Error in getting UOMs list");
            setShowError(true);
        }
    }

    useEffect(() => {
        getPCList();
    }, []);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowError(false);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        offset = newPage * rowsPerPage;
        setPage(newPage);
    //    getList(rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        offset = 0;
        // getList(newRowsPerPage);
    };

    const handleEdit = (index) => {
        console.log("handleEdit: ", index);
        set_editableIndex(index);
        // props.setSelectedMaterial(data);
        // props.history.push("/editmaterial");
    };

    const handleDelete =(index)=>{
        let allItems = [...rows];
   allItems.splice(index, 1);
    setRows(allItems);
        set_showSaveBtn(true);
    }
    const handleSave = async () => {

        try{
            let url = config["baseurl"] + "/api/project/update";
                        let postObj = {};
                        postObj['_id']=props.project._id
                        postObj["updateParams"]= {boq_items: rows};
                        // postObj["hsncode"] = data[i].hsncode.trim();
                        // postObj["name"] = data[i].name.trim();
                        // postObj["description"] = data[i].description.trim();
                        // postObj["productCategoryId"] = props.productCategories.filter(cat => cat._id === data[i].productCategoryId)[0]._id;
                        // postObj["uomId"] = props.UOMs.filter(uom => uom._id === data[i].uomId)[0]._id;
                        console.log("postObj: ", postObj);
                        axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
                        const response = await axios.patch(url, postObj);
                        setRows(response.data.boq_items);
                            console.log("successfully Saved");
                            setShowBackDrop(false);
                            set_showSaveBtn(false);
            }
                        catch (e) {
                            
        }
        
        
        // set_hsncode_error(null);
        // set_itemname_error(null);
        // set_description_error(null);
        // set_productcategory_error(null);
        // set_uom_error(null);

        // const errors = validateData();

        // let errorOccured = false;
        // if (errors["hsncode"]) {
        // set_hsncode_error(errors["hsncode"]);
        // errorOccured = true;
        // }
        // if (errors["itemname"]) {
        // set_itemname_error(errors["itemname"]);
        // errorOccured = true;
        // }
        // if (errors["description"]) {
        // set_description_error(errors["description"]);
        // errorOccured = true;
        // }
        // if (errors["productcategory"]) {
        // set_productcategory_error(errors["productcategory"]);
        // errorOccured = true;
        // }
        // if (errors["uom"]) {
        // set_uom_error(errors["uom"]);
        // errorOccured = true;
        // }

        // if (errorOccured)
        // return;

        // try {
        //     let url = config["baseurl"] + "/api/material/add";
        //     for (let i = 0; i < data.length; ++i) {
        //         let postObj = {};
        //         postObj["hsncode"] = data[i].hsncode.trim();
        //         postObj["name"] = data[i].name.trim();
        //         postObj["description"] = data[i].description.trim();
        //         postObj["productCategoryId"] = props.productCategories.filter(cat => cat._id === data[i].productCategoryId)[0]._id;
        //         postObj["uomId"] = props.UOMs.filter(uom => uom._id === data[i].uomId)[0]._id;
        //         console.log("postObj: ", postObj);

        //         axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

        //         const response = await axios.post(url, postObj);
        //         set_uploaded_docs(i + 1);
        //         debugger;
        //     }
        //     console.log("successfully Saved");
        //     setShowBackDrop(false);
        // }
        // catch (e) {
        //     if (e.response) {
        //         console.log(e);
        //         console.log("Error in creating material");
        //         setErrorMessage(e.response.data["message"]);
        //     }
        //     else {
        //         console.log(e);
        //         console.log("Error in creating");
        //         setErrorMessage("Error in creating: ", e.message);
        //     }
        //     setShowError(true);
        //     // setContactingServer(false);
        // }
    };

    useEffect(()=>{
        console.log(props.project)
    },[])
    const processData = dataString => {
        const dataStringLines = dataString.split(/\r\n|\n/);
        const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

        const list = [];
        for (let i = 1; i < dataStringLines.length; i++) {
            const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
            if (headers && row.length == headers.length) {
                const obj = {};
                for (let j = 0; j < headers.length; j++) {
                    let d = row[j];
                    if (d.length > 0) {
                        if (d[0] == '"')
                            d = d.substring(1, d.length - 1);
                        if (d[d.length - 1] == '"')
                            d = d.substring(d.length - 2, 1);
                    }
                    if (headers[j]) {
                        obj[headers[j]] = d;
                    }
                }
                // remove the blank rows
                if (Object.values(obj).filter(x => x).length > 0) {
                    list.push(obj);
                }
            }
        }

        // prepare columns list from headers
        // const columns = headers.map(c => ({
        // name: c,
        // selector: c,
        // }));
        console.log(list);

        handleSave(list);
    }

    const handleImport = (e) => {
        console.log('import file....')
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
            /* Binary Data */
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            // Get first worksheet //
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            // Convert array of arrays //
            const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
            processData(data);
        };

        reader.onerror = (e) => {
            setShowError(true);
            setErrorMessage('Unable to read file...')
        }
        reader.readAsBinaryString(file);
        setShowBackDrop(true);
    }

    const handleAdd = () => {
        setShowSelectItem(true);
        // props.history.push("/addmaterial");
    };
    const closeSelectItemDialogAction = () => {
        setShowSelectItem(false);
    };

    useEffect(()=>{
        console.log(rows)

    },[rows]);
    const onSelectItem = (newitem) => {
        setShowSelectItem(false);
        let newObj = {...newitem,igst:0,sgst:0,cgst:0,unitPrice:0,freight:0,insuranceCharges:0,qty:0,invoiceQty:0,others:0}
        newObj.gst = newObj.igst + newObj.cgst + newObj.sgst;
        newObj.totalUnityCost = newObj.unitPrice + newObj.freight + newObj.gst;
        setRows(prev=>[newObj, ...prev])
        set_showSaveBtn(true);
        // console.log(newitem);
        // for (let i = 0; i < rows.length; ++i) {
        //     if (rows[i].data._id == newitem._id)
        //         return;
        // }

        // console.log('From DWA Documents', newitem);

        // let newCopy = cloneDeep(newitem);
        // newCopy.qty = 0;

        // handleSave([newitem]);

        // let newItems = [...rows, createData(rows.length + 1, newitem)];
        // setRows(newItems);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const BorderLinearProgress = withStyles((theme) => ({
        root: {
            height: 10,
            borderRadius: 5,
        },
        colorPrimary: {
            backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
        },
        bar: {
            borderRadius: 5,
            backgroundColor: '#1a90ff',
        },

    }))(LinearProgress);

    const getStringForArray = (data) => {
        let val = "";
        for (let i = 0; i < data.length; ++i) {
            if (i > 0)
                val += ", ";
            val += data[i];
        }
        return val;
    }

    useEffect(() => {
        console.log(rows);
    }, [rows]);

    const changeItem = (i, k, v) => {
        let modifyingItem = [...rows];
        modifyingItem[i][k] = v;
        setRows(preVal => {
            preVal[i][k] = v;
        });
        set_showSaveBtn(true);
    }

    const getProductCategory = (id) => {
        for (let i = 0; i < props.productCategories.length; ++i) {
            if (props.productCategories[i]._id === id)
                return props.productCategories[i].name;
        }
        return id;
    };

    const getUOM = (id) => {
        for (let i = 0; i < props.UOMs.length; ++i) {
            if (props.UOMs[i]._id === id)
                return props.UOMs[i].name;
        }

        return id;
    };

    const onSearchChange = (event) => {
        console.log(event.target.value);

        // getList(rowsPerPage, event.target.value);
    };

 
    return (
        <div className={clsx(classes.root)}>
            {props.refreshUI && props.project &&

                <div className={classes.paper}>
                    <EnhancedTableToolbar title={"Documents: " + props.project.code + ": " + props.name} />
                    <Paper className={classes.grid}>
                        <Grid container spacing={3}>
                            <Grid item className={classes.totalAttendes}>
                                <img src={MaterialsImage} width='25' alt="" />
                                <h1 className={classes.h1}>{totalCount}</h1>
                                <span>{lstrings.Materials}</span>
                            </Grid>
                            <Grid item className={classes.addButton}>
                                {/* <input type="file" accept=".csv,.xlsx,.xls" ref={importMaterial} style={{ display: 'none' }} onChange={handleImport}></input> */}
                                {/* <Button onClick={() => importMaterial.current.click()} style={{ background: "#314293", color: "#FFFFFF", marginRight: '1em' }} variant="contained" className={classes.button} >{lstrings.ImportMaterial}</Button> */}
                                <Button onClick={() => handleAdd()} style={{ background: "#314293", color: "#FFFFFF",marginRight: '1em' }} variant="contained" className={classes.button}>{lstrings.AddMaterial}</Button>
                            {showSaveBtn && <Button onClick={() => handleSave()} style={{ background: "#314293", color: "#FFFFFF"}} variant="contained" className={classes.button}>{'Save'}</Button>}
                            </Grid>
                        </Grid>
                    </Paper>
                    <Paper className={classes.grid}>
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
                        <TableContainer>
                            <Table
                                className={classes.table}
                                aria-labelledby="tableTitle"
                                size={dense ? 'small' : 'medium'}
                                aria-label="enhanced table"
                            >
                                <EnhancedTableHead
                                    classes={classes}
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={rows.length}
                                />

                                <TableBody>
                                    {stableSort(rows, getComparator(order, orderBy))
                                        .map((row, index) => {
                                            const isItemSelected = isSelected(row.name);

                                            const labelId = `enhanced-table-checkbox-${index}`;
                                            return (
                                                <TableRow hover tabIndex={-1} key={index}>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'} component="th" id={labelId} scope="row" padding="none">{row.slno}</TableCell>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'} >{row.code}</TableCell>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'} >{row.hsncode}</TableCell>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{getProductCategory(row.productCategoryId)}</span></TableCell>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{row.name}</TableCell>
                                                    {/* <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{row.data.description}</span></TableCell> */}
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{getUOM(row.uomId)}</span></TableCell>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                                                        <TextField  style={{width:"60px"}} id={"unitPrice"+index} disabled={!(editableIndex === index)} defaultValue={row.unitPrice} onChange={(e) => changeItem(index, 'unitPrice', e.target.value)} variant="outlined" />
                                                    </TableCell>
                                                    <TableCell  align={dir === 'rtl' ? 'right' : 'left'}>
                                                        <TextField  style={{width:"60px"}} id={"freight"+index} disabled={!(editableIndex === index)} defaultValue={row.freight} variant="outlined" onChange={(e) => changeItem(index, 'freight', e.target.value)}/>
                                                    </TableCell>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                                                        <TextField id={"igst"+index} style={{width:"60px"}} disabled={!(editableIndex === index)} defaultValue={row.igst} onChange={(e) => changeItem(index, 'igst', e.target.value)} variant="outlined" />
                                                    </TableCell>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                                                        <TextField id={"cgst"+index} style={{width:"60px"}} disabled={!(editableIndex === index)} defaultValue={row.cgst} variant="outlined" onChange={(e) => changeItem(index, 'cgst', e.target.value)}/>
                                                    </TableCell>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                                                        <TextField id={"sgst"+index} style={{width:"60px"}} disabled={!(editableIndex === index)} defaultValue={row.sgst} variant="outlined" onChange={(e) => changeItem(index, 'sgst', e.target.value)}/>
                                                    </TableCell>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                                                        <TextField id={"others"+index} style={{width:"60px"}} disabled={!(editableIndex === index)} defaultValue={row.others} variant="outlined" onChange={(e) => changeItem(index, 'others', e.target.value)}/>
                                                    </TableCell>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                                                        <TextField id={"gst"+index} style={{width:"60px"}} disabled={!(editableIndex === index)} defaultValue={row.gst} variant="outlined" onChange={(e) => changeItem(index, 'gst', e.target.value)}/>
                                                    </TableCell>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                                                        <TextField id={"totalUnityCost" + index} style={{width:"60px"}} disabled={!(editableIndex === index)} defaultValue={row.totalUnityCost} variant="outlined" onChange={(e) => changeItem(index, 'totalUnityCost', e.target.value)}/>
                                                    </TableCell>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                                                        <TextField style={{width:"60px"}} id={"qty" + index} disabled={!(editableIndex === index)} defaultValue={row.qty} variant="outlined" onChange={(e) => changeItem(index, 'qty', e.target.value)}/>
                                                    </TableCell>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                                                        <TextField style={{width:"60px"}} id={"estimated_qty" + index} disabled={!(editableIndex === index)} defaultValue={12} variant="outlined" onChange={(e) => changeItem(index, 'estimated_qty', e.target.value)}/>
                                                    </TableCell>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                                                        <TextField style={{width:"60px"}} id={"wo_qty" + index} disabled={!(editableIndex === index)} defaultValue={12} variant="outlined" onChange={(e) => changeItem(index, 'wo_qty', e.target.value)}/>
                                                    </TableCell>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                                                        <TextField style={{width:"60px"}} id={"invoiced_qty" + index} disabled={!(editableIndex === index)} defaultValue={row.invoiceQty} variant="outlined" onChange={(e) => changeItem(index, 'invoiced_qty', e.target.value)}/>
                                                    </TableCell>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                                                        <TextField style={{width:"60px"}} id={"progress" + index} disabled={!(editableIndex === index)} defaultValue={12} variant="outlined" onChange={(e) => changeItem(index, 'progress', e.target.value)}/>
                                                    </TableCell>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                                                        <TextField style={{width:"60px"}} id="outlined-basic" disabled={!(editableIndex === index)} defaultValue={12} variant="outlined" />
                                                    </TableCell>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                                                        {!(editableIndex === index) && <Button onClick={() => handleEdit(index)} color="primary" className={classes.button}><EditImage /></Button>}
                                                        {(editableIndex === index) && <Button onClick={() => handleEdit(null)} color="primary" 
                                                        className={classes.button}><CheckIcon /></Button>}
                                                    </TableCell>
                                                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                                                    <Button onClick={() => handleDelete(index)} color="primary" 
                                                        className={classes.button}><DeleteIcon /></Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={pageLimits}
                            component="div"
                            count={totalCount}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Paper>
                </div>

            }

            <Backdrop className={classes.backdrop} open={showBackDrop}>
                <div>
                    <CircularProgress color="inherit" />
                    <h1>{uploadedDocs} Uploading material....</h1>
                </div>
            </Backdrop>

            { showSelectItem && <SelectItem closeAction={closeSelectItemDialogAction} onSelect={onSelectItem} items={props.allItems} dwaEditable={true} type={"Materials"} />}

            <Snackbar open={showError} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>
        </div >
    );
}