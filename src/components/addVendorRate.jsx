import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import EnhancedTableToolbar from './enhancedToolbar';
import axios from 'axios';
import config from "../config.json";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import lstrings from '../lstrings.js';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import 'date-fns';
import TextField from '@material-ui/core/TextField';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import AddImage from '@material-ui/icons/Add';
import SelectItem from './selectItem';
import cloneDeep from 'lodash/cloneDeep';
import ConfirmDelete from "./confirmDelete";

const Joi = require('joi');

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function EnhancedTableHeadSmall(props) {
  const dir = document.getElementsByTagName('html')[0].getAttribute('dir');
  const setDir = (dir === 'rtl' ? true : false);

  const headCells = [
    { id: 'addwork', numeric: false, disablePadding: false, label: "Add works" },
    { id: 'itemcode', numeric: false, disablePadding: false, label: "Item Code" },
    { id: 'hsncode', numeric: true, disablePadding: false, label: "HSN Code" },
    { id: 'workname', numeric: true, disablePadding: false, label: "Work Name" },
    { id: 'description', numeric: true, disablePadding: false, label: "Description" },
    { id: 'uom', numeric: false, disablePadding: false, label: "UOM" },
    { id: 'rate', numeric: false, disablePadding: false, label: "Rate" }
  ];

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <TableCell key={headCell.id} align={!setDir ? 'left' : 'right'} padding='none' sortDirection={false} >
            {headCell.label}
            {index === 0 && <IconButton color="primary" aria-label="upload picture" component="span" onClick={props.onClick}>
              <AddImage />
            </IconButton>}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function AddVendorRate(props) {

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
      padding: '10px 20px',
      width: '100%',
      borderRadius: '5px',
      overflow: 'auto',
      depth: 1,
      marginTop: '10px',
      marginBottom: '10px',
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
      marginTop: '15px',
      margin: '5px',
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
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  const classes = useStyles();
  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const [items, set_items] = React.useState([]);
  const [items_error, set_items_error] = React.useState(null);

  const [allItems, set_allItems] = React.useState([]);
  const [prouctCategories, set_prouctCategories] = React.useState([]);
  const [uoms, set_uoms] = React.useState([]);

  const [currentProject, setCurrentProject] = React.useState(-1);
  const [currentWarehouse, setCurrentWarehouse] = React.useState(-1);
  const [currentWarehouses, setCurrentWarehouses] = React.useState([]);

  const [projects, setProjects] = React.useState([]);
  const [warehouses, setWarehouses] = React.useState([]);

  const [showSelectItem, setShowSelectItem] = React.useState(false);

  const [showBackDrop, setShowBackDrop] = React.useState(false);

  const [showConfirmationDialog, setShowConfirmationDialog] = React.useState(false);
  const [indexTobeDeleted, set_indexTobeDeleted] = React.useState(null);

  async function getAllItemList(numberOfRows, search = "") {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/material/list?count=" + numberOfRows + "&offset=" + 0 + "&search=" + search;
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log(data);

      set_allItems(data.list.docs);
      setShowBackDrop(false);
      getPCList();
    }
    catch (e) {
      setShowBackDrop(false);
      console.log("Error in getting all items");
      setErrorMessage("Error in getting all items");
      setShowError(true);
    }
  }

  async function getPCList() {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/productcategory/list";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      set_prouctCategories(data.list);

      getUOMList();
      setShowBackDrop(false);
    }
    catch (e) {
      console.log("Error in getting product categories list");
      setErrorMessage("Error in getting product categories list");
      setShowError(true);
      setShowBackDrop(false);
    }
  }

  async function getUOMList() {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/uom/list";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      set_uoms(data.list);

      setShowBackDrop(false);

      getProjectList();
    }
    catch (e) {
      console.log("Error in getting UOMs list");
      setErrorMessage("Error in getting UOMs list");
      setShowError(true);
      setShowBackDrop(false);
    }
  }

  async function getProjectList() {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/project/list?count=" + 1000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log(data);
      setProjects(data.list.docs);
      setShowBackDrop(false);

      if (props.createFromLoi && props.loi) {
        for (let i = 0; i < data.list.docs.length; ++i) {
          if (props.loi.project === data.list.docs[i]._id) {
            setCurrentProject(i);
            break;
          }
        }
      }

      getWarehouseList();
    }
    catch (e) {
      setShowBackDrop(false);
      console.log("getProjectList e: ", e);
      if (e.response) {
        setErrorMessage(e.response.data.message);
      }
      else {
        setErrorMessage("Error in getting list");
      }
      setShowError(true);
    }
  }

  async function getWarehouseList() {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/warehouse/list?count=" + 1000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log(data);

      setWarehouses(data.list);
      setShowBackDrop(false);

      if (props.createFromLoi && props.loi) {
        for (let i = 0; i < data.list.length; ++i) {
          if (props.loi.warehouse === data.list[i]._id) {
            setCurrentWarehouse(i);
            break;
          }
        }
      }
    }
    catch (e) {
      setShowBackDrop(false);
      console.log("getWarehouseList: e: ", e);
      if (e.response) {
        setErrorMessage(e.response.data.message);
      }
      else {
        setErrorMessage("Error in getting list");
      }
      setShowError(true);
    }
  }

  useEffect(() => {
    let ocurrentWarehouses = projects?.[currentProject]?.warehouse?.map(id => {
      return warehouses?.find(wh => wh._id === id)
    });
    if(ocurrentWarehouses) {
      setCurrentWarehouses(ocurrentWarehouses);
    } else {
      setCurrentWarehouses([]);
    }
    
  }, [currentProject])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowError(false);
  };

  const handleBreadCrumClick = () => {
    props.history.push("/vendorrate");
  };

  const handleCancel = () => {
    props.history.push("/vendorrate");
  };

  const handleSave = async (e) => {
    e.preventDefault();
  };

  const addItem = () => {
    setShowSelectItem(true);
  };

  const closeSelectItemDialogAction = () => {
    setShowSelectItem(false);
  };

  const onSelectItem = (newitem) => {
    setShowSelectItem(false);
    for (let i = 0; i < items.length; ++i) {
      newitem = newitem.filter(ii => ii._id !== items[i]._id);
    };

    if(newitem.length > 0) {
      newitem = newitem.map(ii => {
        let newCopy = cloneDeep(ii);
        newCopy.scheduled_date = new Date();
        newCopy.qty=0;
        newCopy.rate = 0;
        return newCopy;
      });
      set_items([...items, ...newitem]);
      set_items_error(null);
    } else {
      setShowError(true);
      setErrorMessage('Already existing materials selected');
    }
    
  };

  const handleCloseBackDrop = () => {

  };


  const set_item_qty_for = (value, index) => {
    console.log(value + "--" + index);
    let newItems = [...items];
    newItems[index].qty = value;
    set_items(newItems);
  };

  const set_item_rate_for = (value, index) => {
    let newItems = [...items];
    newItems[index].rate = value;
    set_items(newItems);
  };

  const getuomFor = (value) => {
    for (let i = 0; i < uoms.length; ++i) {
      if (value === uoms[i]._id)
        return uoms[i].name;
    }
    return value;
  }

  const handleScheduleDateChange = (value, index) => {
    let newItems = [...items];
    newItems[index].scheduled_date = value;
    set_items(newItems);
  };

  const deleteAction = (index) => {
    set_indexTobeDeleted(index);
    setShowConfirmationDialog(true);
  };
  const noConfirmationDialogAction = () => {
    setShowConfirmationDialog(false);
  };

  const yesConfirmationDialogAction = () => {
    console.log(indexTobeDeleted);
    let newItems = cloneDeep(items); console.log(newItems[indexTobeDeleted]);
    newItems.splice(indexTobeDeleted, 1);
    set_items([...newItems]);
    setShowConfirmationDialog(false);
  };
  return (
    <div className={clsx(classes.root)}>
      <div className={classes.paper}>

        <EnhancedTableToolbar title={"Add Vendor Rate"} />

        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" onClick={handleBreadCrumClick}>
            {"Purchase Orders"}
          </Link>
          <Typography color="textPrimary">{"Add Vendor Rate"}</Typography>
        </Breadcrumbs>

        <form className={classes.papernew} autoComplete="off" noValidate>
          <Paper className={classes.paper} style={{ marginTop: 10 }}>
            <TableContainer className={classes.container}>
              <Table className={classes.smalltable} stickyHeader aria-labelledby="tableTitle" size='small' aria-label="enhanced table" >
                <EnhancedTableHeadSmall title="Purchase Items" onClick={addItem} />
                <TableBody>
                  {items.map((row, index) => {
                    return (
                      <TableRow hover tabIndex={-1} key={"" + index} >
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + (index + 1) + ". " + row.name}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{getuomFor(row.uomId)}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                        <TextField size="small" label="Schedule Date" variant="outlined" format="dd/MM/yyyy" value={items[index].scheduled_date} onChange={(e) => handleScheduleDateChange(e.target.value, index)}/>                          
                          {/* <MuiPickersUtilsProvider utils={DateFnsUtils} >
                            <DatePicker size="small" label="Schedule Date" inputVariant="outlined" format="dd/MM/yyyy" value={row.scheduled_date} onChange={(newDate) => handleScheduleDateChange(newDate, index)} />
                          </MuiPickersUtilsProvider> */}
                        </TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                          <TextField size="small" id={"formControl_rate_" + index} type="number" value={row.rate}
                            variant="outlined" onChange={(event) => { set_item_rate_for(event.target.value, index) }} />
                        </TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{console.log(row.qty)}
                          <TextField size="small" id={"formControl_qty_" + index} type="number" value={row.qty}
                            variant="outlined" onChange={(event) => { set_item_qty_for(event.target.value, index) }} />
                        </TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                          <Button variant="contained" onClick={() => { deleteAction(index) }}>Remove</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          {items_error && <Alert className={classes.alert} severity="error"> {items_error} </Alert>}
          <div className={classes.submit}>
            <Button variant="contained" color="primary" onClick={handleCancel} >Cancel</Button>
            <Button style={{ marginLeft: 10 }} variant="contained" color="primary" onClick={handleSave} >Save</Button>
          </div>

        </form>
        {/* </Paper> */}
      </div>
      { showSelectItem && <SelectItem closeAction={closeSelectItemDialogAction} onSelect={onSelectItem} items={allItems} type={"Purchasable Items"} />}
      {showConfirmationDialog && <ConfirmDelete noConfirmationDialogAction={noConfirmationDialogAction} yesConfirmationDialogAction={yesConfirmationDialogAction} message={lstrings.DeleteItemConfirmationMessage} title={lstrings.DeletingItem} />}
      <Snackbar open={showError} autoHideDuration={60000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>

      <Backdrop className={classes.backdrop} open={showBackDrop} onClick={handleCloseBackDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>

    </div >
  );
}
