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
import 'date-fns';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import { v4 as uuidv4 } from 'uuid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import AddImage from '@material-ui/icons/Add';
import SelectItem2 from './selectItem2';
import SelectItem from './selectItem';
import SelectProject from './selectProject';
import cloneDeep from 'lodash/cloneDeep';
import DateFnsUtils from '@date-io/date-fns';
import ConfirmDelete from "./confirmDelete";
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { getPositionOfLineAndCharacter } from 'typescript';

const Joi = require('joi');

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function EnhancedTableHeadSmall(props) {
  const dir = document.getElementsByTagName('html')[0].getAttribute('dir');
  const setDir = (dir === 'rtl' ? true : false);

  const headCells = [
    { id: 'name', numeric: false, disablePadding: false, label: props.title },
    { id: 'description', numeric: false, disablePadding: false, label: "description" },
    { id: 'uom', numeric: false, disablePadding: false, label: "UOM" },
    { id: 'stockqty', numeric: true, disablePadding: false, label: "Qty (Stock)" },
    { id: 'qty', numeric: true, disablePadding: false, label: "Qty" },
    { id: 'remove', numeric: true, disablePadding: false, label: "Remove item" }

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

function EnhancedTableHeadSmall2(props) {
  const dir = document.getElementsByTagName('html')[0].getAttribute('dir');
  const setDir = (dir === 'rtl' ? true : false);

  const headCells = [
    { id: 'name', numeric: false, disablePadding: false, label: props.title },
    { id: 'description', numeric: false, disablePadding: false, label: "description" },
    { id: 'uom', numeric: false, disablePadding: false, label: "UOM" },
    { id: 'qty', numeric: true, disablePadding: false, label: "Qty" }
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

export default function WarehouseCreateStockTransfer(props) {

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
  const [supply_vendor_error, set_supply_vendor_error] = React.useState(null);
  const [items, set_items] = React.useState([]);
  const [items_error, set_items_error] = React.useState(null);

  const [allItems, set_allItems] = React.useState([]);
  const [prouctCategories, set_prouctCategories] = React.useState([]);
  const [uoms, set_uoms] = React.useState([]);

  const [supplyVendors, setSupplyVendors] = React.useState([]);
  const [currentSupplyVendor, setCurrentSupplyVendor] = React.useState(-1);
  const [currentSupplyVendor_error, setCurrentSupplyVendor_error] = React.useState(null);

  const [projects, setProjects] = React.useState([]);

  const [showSelectItem, setShowSelectItem] = React.useState(false);
  const [showSelectItemForLP, setShowSelectItemForLP] = React.useState(false);
  const [showSelectProject, setShowSelectProject] = React.useState(false);

  const [showBackDrop, setShowBackDrop] = React.useState(false);
  const [currentType, setCurrentType] = React.useState(-1);
  
  const [warehouses, setWarehouses] = React.useState([]);
  const [currentWarehouse, setCurrentWarehouse] = React.useState(-1);
  const [current_warehouse_error, set_current_warehouse_error] = React.useState(null);

  const [poItems, setPOItems] = React.useState([]);
  const [project, set_project] = React.useState(null);
  const [gate_entry_info, set_gate_entry_info] = React.useState('');
  const [bill_no, set_bill_no] = React.useState('');
  const [dc_no, set_dc_no] = React.useState('');
  const [lr_no, set_lr_no] = React.useState('');
  const [transporter, set_transporter] = React.useState('');
  const [vehicle_no, set_vehicle_no] = React.useState('');
  const [remark, set_remark] = React.useState('');
  const [remark_error, set_remark_error] = React.useState(null)
  const [files, set_files] = React.useState([]);
  const [newItemId, set_newItemId] = React.useState(null);
  const [receivedTransactions, set_receivedTransactions] = React.useState(null);
  const [indexTobeDeleted, set_indexTobeDeleted] = React.useState(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = React.useState(false);

  const dateFns = new DateFnsUtils();

  async function getAllItemList() {
    console.log("getAllItemList 1");
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/material/list?count=" + 10000 + "&offset=" + 0 + "&search=";
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

  async function getStoredItemDetail(itemId) {
    console.log("getStoredItemDetail 1");
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/storedmaterial/details?warehouse=" + props.warehouse._id + "&item=" + itemId;
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      console.log("getStoredItemDetail 2");
      const { data } = await axios.get(url);
      console.log("getStoredItemDetail 3");

      // let newItems = [...items];
      // console.log("newItems 1: ", newItems);
      // for (let i = 0; i < newItems.length; ++i) {
      //   if (newItems[i]._id === data.stored.material) {
      //     newItems[i].stockqty = data.stored.qty;
      //     break;
      //   }
      // }

      // console.log("newItems 2: ", newItems);

      // set_items(newItems);

      // console.log("getStoredItemDetail:", data);

      setShowBackDrop(false);
      return data.stored.qty;
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

      getWarehouseList();
    }
    catch (e) {
      console.log("Error in getting UOMs list");
      setErrorMessage("Error in getting UOMs list");
      setShowError(true);
      setShowBackDrop(false);
    }
  }

  async function getWarehouseList() {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/warehouse/list?count=" + 1000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log(data);

      setWarehouses(data.list.filter(warehouse => warehouse._id !== props.warehouse._id));
      setShowBackDrop(false);
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

useEffect(()=>{

  getAllItemList();

},[])
  useEffect(() => {
    console.log(props.warehouse)
    if (props.warehouse){
           set_items([]);
    }
  }, [props.warehouse]);

  useEffect(() => {
    if (newItemId)
      getStoredItemDetail(newItemId);
  }, [newItemId]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowError(false);
  };

  const handleBreadCrumClick = (target) => {
    props.history.push(target);
  };

  const handleCancel = () => {
    props.history.push("/warehousehome");
  };

  const validateData = () => {
    const schema = Joi.object({
      bill_no: Joi.string().min(1).max(1024).required(),
      dc_no: Joi.string().min(1).max(8192).required(),
      lr_no: Joi.string().min(1).max(8192).required(),
      transporter: Joi.string().min(1).max(8192).required(),
      vehicle_no: Joi.string().min(1).max(8192).required(),
      gate_entry_info: Joi.string().min(1).max(8192).required(),
    });
    const { error } = schema.validate({
      bill_no: bill_no.trim(),
      dc_no: dc_no.trim(),
      lr_no: lr_no.trim(),
      transporter: transporter.trim(),
      vehicle_no: vehicle_no.trim(),
      gate_entry_info: gate_entry_info.trim()
    }, { abortEarly: false });
    const allerrors = {};
    if (error) {
      for (let item of error.details)
        allerrors[item.path[0]] = item.message;
    }

    return allerrors;
  }

  const getTypeString = (type) => {
    switch (type) {
      case 0:
        return "po";
        break;
      case 1:
        return "warehouse";
        break;
      case 2:
        return "local_purchase";
        break;
      case 3:
        return "return_indent";
        break;
    }

    return "";
  };

  const handleSave = async () => {
    set_current_warehouse_error(null);
    set_remark_error(null);

    const errors = validateData();

    let errorOccured = false;
    if (currentWarehouse === -1) {
      set_current_warehouse_error("Warehouse Required");
      errorOccured = true;
    }
    if (errors["remark"]) {
      set_remark_error(errors["remark"]);
      errorOccured = true;
    }

    if (items.length === 0) {
      set_items_error("Items required");
      errorOccured = true;
    }

    for (let i = 0; i < items.length; ++i) {
      if (parseFloat(items[i].qty) === 0) {
        setErrorMessage("qty cannot be zero");
        setShowError(true);
        errorOccured = true;
        break;
      }
    }

    if (errorOccured)
      return;

    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/stocktransfer/add";

      console.log("currentWarehouse: ", currentWarehouse);
      console.log("warehouses[currentWarehouse]: ", warehouses[currentWarehouse]);

      let postObj = {};
      postObj["fromwarehouse"] = props.warehouse._id;
      postObj["towarehouse"] = warehouses[currentWarehouse]._id;
      postObj["remark"] = remark.trim();

      postObj["docs"] = [];
      for (let i = 0; i < files.length; ++i) {
        postObj["docs"].push({ name: files[i].name, path: files[i].path });
      }

      postObj["items"] = [];
      for (let i = 0; i < items.length; ++i) {
        if (parseFloat(items[i].qty) < 0) {
          throw "Cannot receive negative qty";
        }

        if (parseFloat(items[i].qty) > parseFloat(items[i].stockqty)) {
          throw "Cannot send more than stock qty";
        }
        else {
          postObj["items"].push({ item: items[i]._id, qty: parseFloat(items[i].qty), rate: parseFloat(items[i].rate), scheduled_date: items[i].scheduled_date });
        }
      }

      console.log("postObj: ", postObj);

      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      console.log("3");
      const response = await axios.post(url, postObj);
      console.log("4");
      console.log("successfully Saved");
      setShowBackDrop(false);
      props.history.push("/outwardstocktransfer");
    }
    catch (e) {
      console.log(e);
      if (e.response) {
        console.log("Error in creating");
        setErrorMessage(e.response.data["message"]);
      }
      else {
        console.log("Error in creating");
        setErrorMessage("Error in creating: " + e);
      }
      setShowError(true);
      setShowBackDrop(false);
    }
  };

  const addItem = () => {
    // setShowSelectItemForLP(true);
    setShowSelectItem(true);
  };

  const closeSelectItemDialogAction = () => {
    setShowSelectItem(false);
    setShowSelectItemForLP(false);
  };

  const onSelectItem = (newitem) => {
    console.log('selected Items 👉', newitem);
    setShowSelectItem(false);

  newitem.forEach(async (i) => {
    let stockqty = await getStoredItemDetail(i._id);
    set_items(pre => [...pre, {...i, qty: 0, stockqty}]);
})
    console.log(items)
    set_items_error(null);
  };

  const closeSelectProjectDialogAction = () => {
    setShowSelectProject(false);
  };

  const onSelectProject = (newProject) => {
    setShowSelectProject(false);

    console.log(newProject);
    set_project(newProject);
  };

  const onSelectItemForLP = (newitem) => {
    console.log("onSelectItemForLP: ", newitem);
    setShowSelectItemForLP(false);

    for (let i = 0; i < items.length; ++i) {
      if (items[i]._id === newitem._id)
        return;
    }

    console.log(newitem);

    let newCopy = cloneDeep(newitem);
    newCopy.stockqty = 0;
    newCopy.qty = 0;

    set_newItemId(newCopy._id);

    console.log("newCopy: ", newCopy);

    let newItems = [...items, newCopy];
    set_items(newItems);

    set_items_error(null);
  };

  const handleItemClick = (event, index) => {
    // setCurrentDivision(index);
  };

  const handleCloseBackDrop = () => {

  };

  const handleWarehouseChange = (event) => {
    setCurrentWarehouse(event.target.value);
    set_current_warehouse_error(null);
  };
  const handleSupplyVendorChange = (event) => {
    setCurrentSupplyVendor(event.target.value);
    setCurrentSupplyVendor_error(null);
    set_supply_vendor_error(null);
  };

  const getItemName = (id) => {
    for (let i = 0; i < props.allItems.length; ++i) {
      if (allItems[i]._id === id)
        return allItems[i].name;
    }
    return id;
  };

  const set_item_qty_for = (value, index) => {
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
    newItems[index].scheduledDate = value;
    set_items(newItems);
  };

  const handleDelete = (index) => {
    console.log("handleDelete: index: ", index);
    let newFiles = [...files];
    newFiles.splice(index, 1);
    set_files(newFiles);
  };

  const handleOpenDoc = (index) => {
    const file = files[index];
    console.log(file);
    window.open(file.path, '_blank');
  };

  const onFileSelected = (event) => {
    console.log(event.target.files[0]);

    let fileParts = event.target.files[0].name.split('.');
    console.log(fileParts);
    let file = { file: event.target.files[0], name: uuidv4() + "." + fileParts[1] };

    uploadFile(file)
  };

  const uploadFile = async (myfile) => {
    setShowBackDrop(true);

    console.log("Preparing the upload");
    let url = config["baseurl"] + "/api/cloud/sign_s3";
    axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
    const profileInfo = JSON.parse(window.localStorage.getItem("profile"));
    try {
      const response = await axios.post(url, {
        fileName: myfile.name,
        fileType: myfile.file.fileType,
        folder: "warehouse_received_docs"
      });

      if (response) {
        var returnData = response.data.data.returnData;
        var signedRequest = returnData.signedRequest;

        // Put the fileType in the headers for the upload
        var options = { headers: { 'x-amz-acl': 'public-read', 'Content-Type': myfile.file.type } };
        try {
          const result = await axios.put(signedRequest, myfile.file, options);

          let newFiles = [...files];
          myfile.path = returnData.url;
          myfile.name = myfile.file.name;
          console.log("myfile: ", myfile);
          newFiles.push(myfile);
          set_files(newFiles);

          setShowBackDrop(false);

          console.log("Response from s3 Success: ", returnData.url);
        }
        catch (error) {
          console.log("ERROR: ", JSON.stringify(error));
          setShowBackDrop(false);
          alert("ERROR " + JSON.stringify(error));
        }
      }
    }
    catch (error) {
      console.log("error: ", error);
      setShowBackDrop(false);
      alert(JSON.stringify(error));
    }
  };

  const getDateString = (val) => {
    return dateFns.date(val).toDateString();
  };

  const getSupplyVendor = (val) => {
    console.log("------------");
    console.log("val: ", val);
    console.log("supplyVendors: ", supplyVendors);
    for (let i = 0; i < supplyVendors.length; ++i) {
      if (supplyVendors[i]._id === val) {
        return supplyVendors[i];
      }
    }

    return null;
  };

  const getReceivedQty = (receivableItem) => {
    console.log("receivableItem: ", receivableItem);

    let total = 0;
    for (let i = 0; i < receivedTransactions.length; ++i) {
      for (let k = 0; k < receivedTransactions[i].transaction.items.length; ++k) {
        if (receivedTransactions[i].transaction.items[k].item === receivableItem._id) {
          total += receivedTransactions[i].transaction.items[k].qty;
        }
      }
    }

    return total;
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
      {props.warehouse &&
        <div className={classes.paper}>

          <EnhancedTableToolbar title={props.warehouse.name + ": Receive Material"} />

          {/* <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" onClick={() => handleBreadCrumClick("/warehouses")}>
              {"Warehouses"}
            </Link>
            <Link color="inherit" onClick={() => handleBreadCrumClick("/warehousehome")}>
              {props.warehouse.name}
            </Link>
            <Typography color="textPrimary">{"Receive Material"}</Typography>
          </Breadcrumbs> */}

          <form className={classes.papernew} autoComplete="off" noValidate>
            <FormControl size="small" variant="outlined" className={classes.formControl}>
              <InputLabel id="warehouse-select-label">Destination Warehouse *</InputLabel>
              <Select
                labelId="warehouse-select-label"
                id="warehouse-select-label"
                value={currentWarehouse === -1 ? "" : currentWarehouse}
                onChange={handleWarehouseChange}
                label="Warehouse *"
              >
                {warehouses && warehouses.map((row, index) => {
                  return (
                    <MenuItem key={"" + index} value={index}>{"" + row.name}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {current_warehouse_error && <Alert className={classes.alert} severity="error"> {current_warehouse_error} </Alert>}

            <TextField size="small" className={classes.inputFields} id="formControl_remark" defaultValue={remark}
              label="Remark" variant="outlined" multiline
              onChange={(event) => { set_remark(event.target.value); set_remark_error(null); }} />
            {remark_error && <Alert className={classes.alert} severity="error"> {remark_error} </Alert>}

            <div style={{ marginTop: 10 }}>
              <div>
                {files.map((file, index) => {
                  return (<Chip style={{ marginTop: 5, marginRight: 5 }} key={"chip" + index} label={file.name} clickable variant="outlined" onClick={() => handleOpenDoc(index)} onDelete={() => handleDelete(index)} />);
                })}
              </div>
              <div style={{ marginTop: 5 }}>
                <Button style={{ background: "#314293", color: "#FFFFFF" }} variant="contained" component="label" onChange={onFileSelected}>
                  Upload Document
                  <input type="file" hidden />
                </Button>
              </div>
            </div>

            <Paper className={classes.paper} style={{ marginTop: 10 }}>
              <TableContainer className={classes.container}>
                <Table className={classes.smalltable} stickyHeader aria-labelledby="tableTitle" size='small' aria-label="enhanced table" >
                  <EnhancedTableHeadSmall title="Transfer Items" onClick={addItem} />
                  <TableBody>
                    {items.map((row, index) => {
                      return (
                        <TableRow hover tabIndex={-1} key={"" + index} >
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + (index + 1) + ". " + row.name}</TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{row.description}</TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{getuomFor(row.uomId)}</TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{row.stockqty}</TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
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
              {/* <Button variant="contained" color="primary" onClick={handleCancel} >Cancel</Button> */}
              <Button style={{ marginLeft: 10 }} variant="contained" color="primary" onClick={handleSave} >Save</Button>
            </div>

          </form>
          {/* </Paper> */}
        </div>
      }

      { showSelectItem && <SelectItem closeAction={closeSelectItemDialogAction} onSelect={onSelectItem}  selectedItems={items} type={"Receivable Items"} items={allItems}/>}

      {/* { showSelectItemForLP && <SelectItem closeAction={closeSelectItemDialogAction} onSelect={onSelectItemForLP} items={allItems} type={"Receivable Items"} />} */}

      { showSelectProject && <SelectProject closeAction={closeSelectProjectDialogAction} onSelect={onSelectProject} projects={projects} />}
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
