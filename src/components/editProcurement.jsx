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
import Chip from '@material-ui/core/Chip';
import { v4 as uuidv4 } from 'uuid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import IconButton from '@material-ui/core/IconButton';
import AddImage from '@material-ui/icons/Add';
import SelectItem from './selectItem';

import DateFnsUtils from '@date-io/date-fns';
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

const Joi = require('joi');

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function EnhancedTableHeadSmall(props) {
  const dir = document.getElementsByTagName('html')[0].getAttribute('dir');
  const setDir = (dir === 'rtl' ? true : false);

  const headCells = [
    { id: 'name', numeric: false, disablePadding: false, label: props.title },
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

export default function EditProcurement(props) {

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

  const [supply_vendor, set_supply_vendor] = React.useState(null);
  const [supply_vendor_error, set_supply_vendor_error] = React.useState(null);

  const [kind_attention, set_kind_attention] = React.useState(props.procurement.kind_attention);
  const [kind_attention_error, set_kind_attention_error] = React.useState(null);

  const [description, set_description] = React.useState(props.procurement.description);
  const [description_error, set_description_error] = React.useState(null);

  const [key_remark, set_key_remark] = React.useState(props.procurement.key_remark);
  const [key_remark_error, set_key_remark_error] = React.useState(null);

  const [items, set_items] = React.useState([]);
  const [items_error, set_items_error] = React.useState(null);

  const [itemqty, set_itemqty] = React.useState([]);

  const [allItems, set_allItems] = React.useState([]);
  const [currentItem, setCurrentItem] = React.useState(-1);

  const [prouctCategories, set_prouctCategories] = React.useState([]);
  const [uoms, set_uoms] = React.useState([]);

  const [supplyVendors, setSupplyVendors] = React.useState([]);
  const [currentSupplyVendor, setCurrentSupplyVendor] = React.useState(-1);
  const [currentSupplyVendor_error, setCurrentSupplyVendor_error] = React.useState(null);

  const [showSelectItem, setShowSelectItem] = React.useState(false);

  const [showBackDrop, setShowBackDrop] = React.useState(false);

  async function getSupplyVendorList() {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/supplyvendor/list?count=" + 1000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log(data);

      setSupplyVendors(data.list.docs);
      setShowBackDrop(false);

      for (let i = 0; i < data.list.docs.length; ++i) {
        if (props.procurement.supply_vendor === data.list.docs[i]._id) {
          setCurrentSupplyVendor(i);
          break;
        }
      }

      getAllItemList(10000);
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

  async function getAllItemList(numberOfRows, search = "") {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/material/list?count=" + numberOfRows + "&offset=" + 0 + "&search=" + search;
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log(data);

      set_allItems(data.list.docs);
      setShowBackDrop(false);

      console.log(props.procurement);
      let newItems = [];
      let newItemQty = [];
      console.log("props.procurement.items.length: ", props.procurement.items.length);
      for (let k = 0; k < props.procurement.items.length; ++k) {
        for (let i = 0; i < data.list.docs.length; ++i) {
          if (props.procurement.items[k].item === data.list.docs[i]._id) {
            newItems.push(data.list.docs[i]);
            newItemQty.push(props.procurement.items[k].qty);
            break;
          }
        }
      }

      set_itemqty(newItemQty);
      set_items(newItems);

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
    }
    catch (e) {
      console.log("Error in getting UOMs list");
      setErrorMessage("Error in getting UOMs list");
      setShowError(true);
      setShowBackDrop(false);
    }
  }

  useEffect(() => {
    getSupplyVendorList();
  }, []);

  // useEffect(() => {
  //   let newitemsqty = [];
  //   for (let i = 0; i < items.length; ++i) {
  //     newitemsqty.push(items[i]);
  //   }
  //   set_itemqty(newitemsqty);
  // }, [items]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowError(false);
  };

  const handleBreadCrumClick = () => {
    props.history.push("/procurements");
  };

  const handleCancel = () => {
    props.history.push("/procurements");
  };

  const validateData = () => {
    const schema = Joi.object({
      kind_attention: Joi.string().min(1).max(1024).required(),
      description: Joi.string().min(1).max(8192).required(),
      key_remark: Joi.string().min(1).max(8192).required(),
    });
    const { error } = schema.validate({
      kind_attention: kind_attention.trim(),
      description: description.trim(),
      key_remark: key_remark.trim()
    }, { abortEarly: false });
    const allerrors = {};
    if (error) {
      for (let item of error.details)
        allerrors[item.path[0]] = item.message;
    }

    return allerrors;
  }

  const handleSave = async (e) => {
    e.preventDefault();

    set_supply_vendor_error(null);
    set_kind_attention_error(null);
    set_description_error(null);
    set_key_remark_error(null);
    set_items_error(null);

    const errors = validateData();

    let errorOccured = false;
    if (currentSupplyVendor === -1) {
      set_supply_vendor_error("Supply Vendor Required");
      errorOccured = true;
    }
    if (errors["kind_attention"]) {
      set_kind_attention_error(errors["kind_attention"]);
      errorOccured = true;
    }
    if (errors["description"]) {
      set_description_error(errors["description"]);
      errorOccured = true;
    }
    if (errors["key_remark"]) {
      set_key_remark_error(errors["key_remark"]);
      errorOccured = true;
    }

    if (currentSupplyVendor === -1) {
      setCurrentSupplyVendor_error("SupplyVendor is required");
      errorOccured = true;
    }

    if (items.length === 0) {
      set_items_error("Items required");
      errorOccured = true;
    }

    for (let i = 0; i < itemqty.length; ++i) {
      if (parseInt(itemqty[i]) === 0) {
        setErrorMessage("item cannot be zero");
        setShowError(true);
        errorOccured = true;
        break;
      }
    }

    if (errorOccured)
      return;

    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/procurement/update";

      let postObj = {};
      postObj["supply_vendor"] = supplyVendors[currentSupplyVendor]._id;
      postObj["kind_attention"] = kind_attention.trim();
      postObj["description"] = description.trim();
      postObj["key_remark"] = key_remark.trim();
      postObj["items"] = [];
      for (let i = 0; i < items.length; ++i) {
        postObj["items"].push({ item: items[i]._id, qty: parseInt(itemqty[i]) });
      }

      console.log("postObj: ", postObj);

      let updateObj = { _id: props.procurement._id, updateParams: postObj };

      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

      const response = await axios.patch(url, updateObj);

      console.log("successfully Saved");
      setShowBackDrop(false);
      props.history.push("/procurements");
    }
    catch (e) {
      console.log("5");
      if (e.response) {
        console.log("Error in creating");
        setErrorMessage(e.response.data["message"]);
      }
      else {
        console.log("Error in creating");
        setErrorMessage("Error in creating: ", e.message);
      }
      setShowError(true);
      setShowBackDrop(false);
    }
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
      if (items[i]._id === newitem._id)
        return;
    }

    let newItemqtys = [...itemqty, 0];
    set_itemqty(newItemqtys);

    let newItems = [...items, newitem];
    set_items(newItems);

    set_items_error(null);
  };

  const handleItemClick = (event, index) => {
    // setCurrentDivision(index);
  };

  const handleCloseBackDrop = () => {

  };

  const handleCustomerChange = (event) => {
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
    let newItemqtys = [...itemqty];
    newItemqtys[index] = value;
    set_itemqty(newItemqtys);
  };

  const getuomFor = (value) => {
    for (let i = 0; i < uoms.length; ++i) {
      if (value === uoms[i]._id)
        return uoms[i].name;
    }
    return value;
  }

  return (
    <div className={clsx(classes.root)}>
      {props.refreshUI &&

        <div className={classes.paper}>

          <EnhancedTableToolbar title={"Edit Procurement"} />

          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" onClick={handleBreadCrumClick}>
              {"Procurements"}
            </Link>
            <Typography color="textPrimary">{"Edit Procurement"}</Typography>
          </Breadcrumbs>

          {/* <Paper className={classes.grid}> */}
          <form className={classes.papernew} autoComplete="off" noValidate>
            {/* name */}
            {/* <TextField size="small" className={classes.inputFields} id="formControl_name" defaultValue={name}
              label="Project Name *" variant="outlined"
              onChange={(event) => { set_name(event.target.value); set_name_error(null); }} />
            {name_error && <Alert className={classes.alert} severity="error"> {name_error} </Alert>} */}

            <FormControl size="small" variant="outlined" className={classes.formControl}>
              <InputLabel id="supplyvendor-select-label">Customer *</InputLabel>
              <Select
                labelId="supplyvendor-select-label"
                id="supplyvendor-select-label"
                value={currentSupplyVendor === -1 ? "" : currentSupplyVendor}
                onChange={handleCustomerChange}
                label="Supply Vendor *"
              >
                {supplyVendors && supplyVendors.map((row, index) => {
                  return (
                    <MenuItem key={"" + index} value={index}>{row.name}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {supply_vendor_error && <Alert className={classes.alert} severity="error"> {supply_vendor_error} </Alert>}

            <TextField size="small" className={classes.inputFields} id="formControl_kind_attention" defaultValue={kind_attention}
              label="Kind Attention *" variant="outlined" multiline
              onChange={(event) => { set_kind_attention(event.target.value); set_kind_attention_error(null); }} />
            {kind_attention_error && <Alert className={classes.alert} severity="error"> {kind_attention_error} </Alert>}

            <TextField size="small" className={classes.inputFields} id="formControl_description" defaultValue={description}
              label="Description *" variant="outlined" multiline
              onChange={(event) => { set_description(event.target.value); set_description_error(null); }} />
            {description_error && <Alert className={classes.alert} severity="error"> {description_error} </Alert>}

            <TextField size="small" className={classes.inputFields} id="formControl_key_remark" defaultValue={key_remark}
              label="Key Remark *" variant="outlined" multiline
              onChange={(event) => { set_key_remark(event.target.value); set_key_remark_error(null); }} />
            {key_remark_error && <Alert className={classes.alert} severity="error"> {key_remark_error} </Alert>}

            <Paper className={classes.paper} style={{ marginTop: 10 }}>
              <TableContainer className={classes.container}>
                <Table className={classes.smalltable} stickyHeader aria-labelledby="tableTitle" size='small' aria-label="enhanced table" >
                  <EnhancedTableHeadSmall title="Purchase Items" onClick={addItem} />
                  <TableBody>
                    {items.map((row, index) => {
                      return (
                        <TableRow hover tabIndex={-1} key={"" + index} selected={index === currentItem} onClick={(event) => handleItemClick(event, index)} >
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + (index + 1) + ". " + row.name}</TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + (index + 1) + ". " + getuomFor(row.uomId)}</TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                            <TextField size="small" id={"formControl_qty_" + index} type="number" defaultValue={itemqty[index]}
                              variant="outlined" onChange={(event) => { set_item_qty_for(event.target.value, index) }} />
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
      }

      { showSelectItem && <SelectItem closeAction={closeSelectItemDialogAction} onSelect={onSelectItem} items={allItems} type={"Purchasable Items"} />}

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
