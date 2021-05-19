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
    { id: 'rate', numeric: true, disablePadding: false, label: "Rate (Rs)" },
    { id: 'qtyordered', numeric: true, disablePadding: false, label: "Qty (PO)" },
    { id: 'qtyreceived', numeric: true, disablePadding: false, label: "Qty Received" },
    { id: 'qty', numeric: true, disablePadding: false, label: "Qty" },
    { id: 'remove_item', numeric: false, disablePadding: false, label: "Remove Item" }
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
            {/* {index === 0 && <IconButton color="primary" aria-label="upload picture" component="span" onClick={props.onClick}>
              <AddImage />
            </IconButton>} */}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function WarehouseReceive(props) {

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

  const [reference_number, set_reference_number] = React.useState('');
  const [reference_number_error, set_reference_number_error] = React.useState(null);

  const [items, set_items] = React.useState([]);
  const [materials,setMaterials]=React.useState([]);
  const [items_error, set_items_error] = React.useState(null);

  const [allItems, set_allItems] = React.useState([]);
  const [currentItem, setCurrentItem] = React.useState(-1);

  const [prouctCategories, set_prouctCategories] = React.useState([]);
  const [uoms, set_uoms] = React.useState([]);

  const [supplyVendors, setSupplyVendors] = React.useState([]);
  const [currentSupplyVendor, setCurrentSupplyVendor] = React.useState(-1);
  const [currentSupplyVendor_error, setCurrentSupplyVendor_error] = React.useState(null);

  const [currentProject, setCurrentProject] = React.useState(-1);

  const [projects, setProjects] = React.useState([]);

  const [showSelectItem, setShowSelectItem] = React.useState(false);
  const [showSelectItemForLP, setShowSelectItemForLP] = React.useState(false);
  const [showSelectProject, setShowSelectProject] = React.useState(false);

  const [showBackDrop, setShowBackDrop] = React.useState(false);

  const [types, setTypes] = React.useState(["From PO", "From Return Indents", "Local Purchase"]);
  const [currentType, setCurrentType] = React.useState(-1);
  const [current_type_error, set_current_type_error] = React.useState(null);

  const [pos, setPOs] = React.useState(null);
  const [currentPO, setCurrentPO] = React.useState(-1);
  const [current_po_error, set_current_po_error] = React.useState(null);

  const [localPurchases, setLocalPurchases] = React.useState(null);
  const [returnIndents,setReturnIndents]=React.useState(null);
  const [currentRI,setCurrentRI]=React.useState(-1);
  const [currentLP, setCurrentLP] = React.useState(-1);
  const [current_lp_error, set_current_lp_error] = React.useState(null);

  const [poItems, setPOItems] = React.useState([]);
  const [lpItems, setLPItems] = React.useState([]);

  const [supplyVendor, setSupplyVendor] = React.useState(null);

  const [po_date, set_po_date] = React.useState('');
  const [po_date_error, set_po_date_error] = React.useState(null);

  const [supplier_name, set_supplier_name] = React.useState('');
  const [supplier_name_error, set_supplier_name_error] = React.useState(null);

  const [supplier_address, set_supplier_address] = React.useState('');
  const [supplier_address_error, set_supplier_address_error] = React.useState(null);

  const [supplier_gst, set_supplier_gst] = React.useState('');
  const [supplier_gst_error, set_supplier_gst_error] = React.useState(null);

  const [project, set_project] = React.useState(null);
  const [project_error, set_project_error] = React.useState(null);

  const [gate_entry_info, set_gate_entry_info] = React.useState('');
  const [gate_entry_info_error, set_gate_entry_info_error] = React.useState(null);

  const [bill_no, set_bill_no] = React.useState('');
  const [bill_no_error, set_bill_no_error] = React.useState(null);

  const [bill_date, set_bill_date] = React.useState(new Date());
  const [bill_date_error, set_bill_date_error] = React.useState(null);

  const [dc_no, set_dc_no] = React.useState('');
  const [dc_no_error, set_dc_no_error] = React.useState(null);

  const [dc_date, set_dc_date] = React.useState(new Date());
  const [dc_date_error, set_dc_date_error] = React.useState(null);

  const [lr_no, set_lr_no] = React.useState('');
  const [lr_no_error, set_lr_no_error] = React.useState(null);

  const [lr_date, set_lr_date] = React.useState(new Date());
  const [lr_date_error, set_lr_date_error] = React.useState(null);

  const [transporter, set_transporter] = React.useState('');
  const [transporter_error, set_transporter_error] = React.useState(null);

  const [vehicle_no, set_vehicle_no] = React.useState('');
  const [vehicle_no_error, set_vehicle_no_error] = React.useState(null);

  const [remark, set_remark] = React.useState('');
  const [remark_error, set_remark_error] = React.useState(null);

  const [files, set_files] = React.useState([]);

  const [receivedTransactions, set_receivedTransactions] = React.useState(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = React.useState(false);
  const [indexTobeDeleted, set_indexTobeDeleted] = React.useState(null);
  const dateFns = new DateFnsUtils();

  async function getPOs() {
    try {
      let url = config["baseurl"] + "/api/po/list?count=" + 10000 + "&offset=" + 0 + "&search=" + "&warehouse=" + props.warehouse._id;
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log(data);
      setPOs(data.list.docs);
    }
    catch (e) {
      if (e.response) {
        setErrorMessage(e.response.data.message);
      }
      else {
        setErrorMessage("Error in getting POs");
      }
      setShowError(true);
    }
  }

  async function getSupplyVendorList() {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/supplyvendor/list?count=" + 1000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log(data);

      setSupplyVendors(data.list.docs);
      setShowBackDrop(false);

      getAllItemList();
    }
    catch (e) {
      setShowBackDrop(false);
      console.log('supply vendors')
      if (e.response) {
        setErrorMessage(e.response.data.message);
      }
      else {
        setErrorMessage("Error in getting list");
      }
      setShowError(true);
    }
  }

  async function getAllItemList() {
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

      console.log("Projects: ", data.list.docs);

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

  async function getReceivedMaterials(po_id) {
    console.log("getReceivedMaterials 1: ", po_id)
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/materialreceivetransaction/list?count=10000&warehouse=" + props.warehouse._id + "&offset=0&search=&po_id=" + po_id;
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log("getReceivedMaterials 2: ", data);
      console.log("getReceivedMaterials 3: ", data.list);
      set_receivedTransactions(data.list);
      setShowBackDrop(false);
    }
    catch (e) {
console.log('received material')
      if (e.response) {
        setErrorMessage(e.response.data.message);
      }
      else {
        setErrorMessage("Error in getting list");
      }
      setShowError(true);
      setShowBackDrop(false);
    }
  }
  

  async function getLocalPurchaseList() {
    try {
      let url = config["baseurl"] + "/api/localpurchase/list?count=" + 1000 + "&offset=" + 0 + "&search=" + "&warehouse=" + props.warehouse._id + "&completed=0";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log(data);
      const dateFns = new DateFnsUtils();
      for (let i = 0; i < data.list.length; ++i) {
        data.list[i].createddate_conv = dateFns.date(data.list[i].transaction.createdDate);
      }

      setLocalPurchases(data.list);
    }
    catch (e) {
console.log('local purchase')
      if (e.response) {
        setErrorMessage(e.response.data.message);
      }
      else {
        setErrorMessage("Error in getting list");
      }
      setShowError(true);
    }
  }
  let offset = 0;

  async function getReturnIndentList(numberOfRows = 10000, search="") {
    try {
      let url = config["baseurl"] + "/api/returnindent/list?warehouse=" + props.warehouse._id + "&showall=1&count=" + numberOfRows + "&offset=" + offset + "&search=" + search;
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log('Return indents list ===>>> ', data);
      
      const dateFns = new DateFnsUtils();
      for (let i = 0; i < data.list.length; ++i) {
        data.list[i].createddate_conv = dateFns.date(data.list[i].indent.createdDate);
      }
      setReturnIndents(data.list);
    }
    catch (e) {
console.log('return indent list')
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
    if (props.warehouse)
    getReturnIndentList()
      getSupplyVendorList();
      
  }, [props.warehouse]);

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

  const handleSave = async (e) => {
    e.preventDefault();

    switch (currentType) {
      case 0:
        handleSaveWarehouseReceiveFromPO();
        break;
      case 1:
        handleSaveWarehouseReceiveFromRI();
        break;
      case 2:
        handleSaveWarehouseReceiveFromLP();
        break;
      default:
        set_current_type_error("Type Required");
        break;
    }
  };

  const getTypeString = (type) => {
    switch (type) {
      case 0:
        return "po";
        break;
      case 1:
        return "local_purchase";
        break;
      case 2:
        return "return_indent";
        break;
    }

    return "";
  };

  const handleSaveWarehouseReceiveFromRI = async () => {
    try {
      let url = config["baseurl"] + "/api/returnindent/complete";
      let postObj = {};
      postObj["id"] = returnIndents[currentRI].indent._id;
      // console.log(returnIndents[currentRI]);
      // debugger;
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const response = await axios.post(url, postObj);
      console.log(response);
    }
    catch(err) {
      console.log(err);
    }
  }

  const handleSaveWarehouseReceiveFromLP = async () => {
    set_current_type_error(null)
    set_current_lp_error(null);
    set_gate_entry_info_error(null);
    set_lr_no_error(null);
    set_transporter_error(null);
    set_vehicle_no_error(null);
    set_remark_error(null);

    const errors = validateData();

    let errorOccured = false;
    if (currentType === -1 && setCurrentRI===-1) {

      set_current_type_error("Type Required");
      errorOccured = true;
    }
    if (currentType == 2 && setCurrentLP === -1) {
      set_current_lp_error("Local Purchase Required");
      errorOccured = true;
    }
    if (errors["remark"]) {
      set_remark_error(errors["remark"]);
      errorOccured = true;
    }
    if (errors["gate_entry_info"]) {
      set_gate_entry_info_error(errors["gate_entry_info"]);
      errorOccured = true;
    }
    if (errors["lr_no"]) {
      set_lr_no_error(errors["lr_no"]);
      errorOccured = true;
    }
    if (errors["transporter"]) {
      set_transporter_error(errors["transporter"]);
      errorOccured = true;
    }
    if (errors["vehicle_no"]) {
      set_vehicle_no_error(errors["vehicle_no"]);
      errorOccured = true;
    }

    if (items.length === 0) {
      set_items_error("Items required");
      errorOccured = true;
    }

    if (errorOccured)
      return;

    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/localpurchase/complete";

      let postObj = {};
      postObj["id"] = localPurchases[currentLP].transaction._id;
      postObj["gate_entry_info"] = gate_entry_info.trim();
      postObj["lr_no"] = lr_no.trim();
      postObj["lr_date"] = lr_date.toUTCString();
      postObj["transporter"] = transporter.trim();
      postObj["vehicle_no"] = vehicle_no.trim();
      postObj["remark"] = remark.trim();

      postObj["docs"] = [];
      for (let i = 0; i < files.length; ++i) {
        postObj["docs"].push({ name: files[i].name, path: files[i].path });
      }

      console.log("postObj: ", postObj);

      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      console.log("3");
      const response = await axios.post(url, postObj);
      console.log("4");
      console.log("successfully Saved");
      setShowBackDrop(false);
      props.history.push("/warehousehome");
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

  const handleSaveWarehouseReceiveFromPO = async () => {
    set_current_type_error(null)
    set_current_po_error(null);
    set_supplier_name_error(null);
    set_supplier_address_error(null);
    set_project_error(null);
    set_supplier_gst_error(null);
    set_gate_entry_info_error(null);
    set_bill_no_error(null);
    set_dc_no_error(null);
    set_lr_no_error(null);
    set_transporter_error(null);
    set_vehicle_no_error(null);
    set_remark_error(null);

    const errors = validateData();

    let errorOccured = false;
    if (currentType === -1) {

      set_current_type_error("Type Required");
      errorOccured = true;
    }
    if (currentType == 0 && currentPO === -1) {
      set_current_po_error("PO Required");
      errorOccured = true;
    }
    // if (currentType === 1 && project === null) {
    //   set_project_error("Project Required");
    //   errorOccured = true;
    // }

    if (errors["remark"]) {
      set_remark_error(errors["remark"]);
      errorOccured = true;
    }
    if (errors["gate_entry_info"]) {
      set_gate_entry_info_error(errors["gate_entry_info"]);
      errorOccured = true;
    }
    if (errors["bill_no"]) {
      set_bill_no_error(errors["bill_no"]);
      errorOccured = true;
    }
    if (errors["dc_no"]) {
      set_dc_no_error(errors["dc_no"]);
      errorOccured = true;
    }
    if (errors["lr_no"]) {
      set_lr_no_error(errors["lr_no"]);
      errorOccured = true;
    }
    if (errors["transporter"]) {
      set_transporter_error(errors["transporter"]);
      errorOccured = true;
    }
    if (errors["vehicle_no"]) {
      set_vehicle_no_error(errors["vehicle_no"]);
      errorOccured = true;
    }

    if (currentType === 0 && supplyVendor === null) {
      set_supplier_name_error("SupplyVendor name is required");
      set_supplier_address_error("SupplyVendor address is required");
      set_supplier_gst_error("SupplyVendor gst is required");
      errorOccured = true;
    }

    if (items.length === 0) {
      set_items_error("Items required");
      errorOccured = true;
    }

    for (let i = 0; i < items.length; ++i) {
      if (parseFloat(items[i].rate) === 0) {
        setErrorMessage("rate cannot be zero");
        setShowError(true);
        errorOccured = true;
        break;
      }
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
      let url = config["baseurl"] + "/api/materialreceivetransaction/add";

      let postObj = {};
      postObj["warehouse"] = props.warehouse._id;
      postObj["type"] = getTypeString(currentType);
      if (currentType === 0)
        postObj["po_id"] = pos[currentPO]._id;
      // if (currentType === 1)
      //   postObj["project"] = project._id;
      postObj["gate_entry_info"] = gate_entry_info.trim();
      postObj["bill_no"] = bill_no.trim();
      postObj["bill_date"] = bill_date.toUTCString();
      postObj["dc_no"] = dc_no.trim();
      postObj["dc_date"] = dc_date.toUTCString();
      postObj["lr_no"] = lr_no.trim();
      postObj["lr_date"] = lr_date.toUTCString();
      postObj["transporter"] = transporter.trim();
      postObj["vehicle_no"] = vehicle_no.trim();
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

        if (currentType === 0) {
          let receivedQty = getReceivedQty(items[i]);
          if (receivedQty + parseFloat(items[i].qty) > parseFloat(items[i].canreceiveqty)) {
            throw "Cannot receive more than PO ordered qty";
          }
          else {
            postObj["items"].push({ item: items[i]._id, qty: parseFloat(items[i].qty), rate: parseFloat(items[i].rate), scheduled_date: items[i].scheduled_date });
          }
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
      props.history.push("/warehousehome");
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
    if (currentType === 0 && currentPO >= 0)
      setShowSelectItem(true);
    else if (currentType === 2 && currentLP >= 0)
      setShowSelectItemForLP(true);
  };

  const closeSelectItemDialogAction = () => {
    setShowSelectItem(false);
    setShowSelectItemForLP(false);
  };

  const onSelectItem = (newitem) => {
    console.log("onSelectItem");
    setShowSelectItem(false);

    for (let i = 0; i < items.length; ++i) {
      if (items[i]._id == newitem._id && items[i].scheduled_date == newitem.scheduled_date)
        return;
    }

    console.log(newitem);

    let newCopy = cloneDeep(newitem);
    newCopy.canreceiveqty = newitem.qty;
    newCopy.qty = 0;

    let newItems = [...items, newCopy];
    set_items(newItems);

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
    console.log("onSelectItemForLP");
    setShowSelectItemForLP(false);

    for (let i = 0; i < items.length; ++i) {
      if (items[i]._id == newitem._id && items[i].scheduled_date == newitem.scheduled_date) {
        console.log("Returning because its already added to the list");
        return;
      }
    }

    console.log("newitem:", newitem);

    let newCopy = cloneDeep(newitem);
    newCopy.canreceiveqty = newitem.qty;
    newCopy.qty = 0;

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

  const handleTypeChange = (event) => {
    setCurrentType(event.target.value);
    set_current_type_error(null);

    set_items([]);

    switch (event.target.value) {
      case 0:
        if (!pos) {
          setCurrentLP(-1);
          getPOs();
        }
        break;
      case 1:
        getPOs();
        break;
      case 2:
        setCurrentLP(-1);
        getLocalPurchaseList();
        break;
      case 3:
        break;
    }
  };
  const handleRIChange = (event) => {
    setCurrentRI(event.target.value);
    let RIMaterials = returnIndents[event.target.value].indent.materials;
    let newItems = [];
    console.log(allItems);
    for (let k = 0; k < RIMaterials.length; ++k) {
      let itemInfo = allItems.find(item => item._id === RIMaterials[k].item);
      if(itemInfo) {
        newItems.push({name: itemInfo.name, description: itemInfo.description, uomId: itemInfo.uomId, qty: RIMaterials[k].qty})
      }
    }
    setMaterials(newItems);
  }
  const handleLPChange = (event) => {
    setCurrentLP(event.target.value);

    set_items([]);

    let newItems = [];
    for (let k = 0; k < localPurchases[event.target.value].transaction.items.length; ++k) {
      for (let i = 0; i < allItems.length; ++i) {
        if (localPurchases[event.target.value].transaction.items[k].item === allItems[i]._id) {
          let item = cloneDeep(allItems[i]);
          item.rate = localPurchases[event.target.value].transaction.items[k].rate;
          item.qty = localPurchases[event.target.value].transaction.items[k].qty;
          item.canreceiveqty = localPurchases[event.target.value].transaction.items[k].qty;
          item.scheduled_date = localPurchases[event.target.value].transaction.items[k].scheduled_date;
          item.scheduled_date_conv = dateFns.date(localPurchases[event.target.value].transaction.items[k].scheduled_date);

          newItems.push(item);
          break;
        }
      }
    }
    set_items(newItems);
  }

  const handlePOChange = (event) => {
    setCurrentPO(event.target.value);
    set_receivedTransactions(null);
    set_current_po_error(null);
    setSupplyVendor(null);
    const vendor = getSupplyVendor(pos[event.target.value].supply_vendor);
    console.log("vendor: ", vendor);
    setSupplyVendor(vendor);
    if (vendor) {
      set_supplier_name_error(null);
      set_supplier_address_error(null);
      set_supplier_gst_error(null);
    }

    console.log(pos[event.target.value]);

    getReceivedMaterials(pos[event.target.value]._id);

    set_items([]);

    let newItems = [];
    for (let k = 0; k < pos[event.target.value].items.length; ++k) {
      for (let i = 0; i < allItems.length; ++i) {
        if (pos[event.target.value].items[k].item === allItems[i]._id) {
          let item = cloneDeep(allItems[i]);
          item.rate = pos[event.target.value].items[k].rate;
          item.qty = pos[event.target.value].items[k].qty;
          item.scheduled_date = pos[event.target.value].items[k].scheduled_date;
          item.scheduled_date_conv = dateFns.date(pos[event.target.value].items[k].scheduled_date);

          newItems.push(item);
          break;
        }
      }
    }
    setPOItems(newItems);
  }

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

  const getProjectNameForPO = (po) => {
    for (let i = 0; i < projects.length; ++i) {
      if (projects[i]._id == po.project)
        return "" + projects[i].code + ", " + projects[i].name;
    }

    return "";
  };

  const deleteAction = (index) => {
    console.log('delete...')
    set_indexTobeDeleted(index);
    setShowConfirmationDialog(true);
  };
  const noConfirmationDialogAction = () => {
    setShowConfirmationDialog(false);
  };

  const yesConfirmationDialogAction = () => {
    let newItems = cloneDeep(items);
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
              <InputLabel id="type-select-label">Receive Type *</InputLabel>
              <Select
                labelId="type-select-label"
                id="type-select-label"
                value={currentType === -1 ? "" : currentType}
                onChange={handleTypeChange}
                label="Receive Type *"
              >
                {types && types.map((row, index) => {
                  return (
                    <MenuItem key={"" + index} value={index}>{"" + row}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {current_type_error && <Alert className={classes.alert} severity="error"> {current_type_error} </Alert>}

            {currentType == 0 && <FormControl size="small" variant="outlined" className={classes.formControl}>
              <InputLabel id="po-select-label">PO *</InputLabel>
              <Select
                labelId="po-select-label"
                id="po-select-label"
                value={currentPO === -1 ? "" : currentPO}
                onChange={handlePOChange}
                label="PO *"
              >
                {pos && pos.map((row, index) => {
                  let createdDate = dateFns.date(row.createdDate);
                  return (
                    <MenuItem key={"" + index} value={index}>{"PO: " + row.code + ", Date: " + createdDate.toDateString() + ", Project: " + getProjectNameForPO(row)}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>}
            {currentType == 0 && current_po_error && <Alert className={classes.alert} severity="error"> {current_po_error} </Alert>}

            {currentType == 0 && pos && (currentPO >= 0) && <TextField size="small" className={classes.inputFields} id="formControl_po_date" value={getDateString(pos[currentPO].createdDate)}
              label="PO Date" variant="outlined" disabled />}
            {currentType >= 0 && po_date_error && <Alert className={classes.alert} severity="error"> {po_date_error} </Alert>}

            {currentType == 0 && pos && (currentPO >= 0) && supplyVendor && <TextField size="small" className={classes.inputFields} id="formControl_supplier_name" value={supplyVendor.name}
              label="Supplier Name" variant="outlined" multiline disabled />}
            {currentType == 0 && supplier_name_error && <Alert className={classes.alert} severity="error"> {supplier_name_error} </Alert>}

            {currentType == 0 && pos && (currentPO >= 0) && supplyVendor && <TextField size="small" className={classes.inputFields} id="formControl_supplier_address" value={supplyVendor.address}
              label="Supplier Address" variant="outlined" multiline disabled />}
            {currentType == 0 && supplier_address_error && <Alert className={classes.alert} severity="error"> {supplier_address_error} </Alert>}

            {currentType == 0 && pos && (currentPO >= 0) && supplyVendor && <TextField size="small" className={classes.inputFields} id="formControl_supplier_gst" value={supplyVendor.gst}
              label="Supplier GST" variant="outlined" multiline disabled />}
            {currentType == 0 && supplier_gst_error && <Alert className={classes.alert} severity="error"> {supplier_gst_error} </Alert>}

            {/* {currentType === 1 && <TextField size="small" className={classes.inputFields} id="formControl_key_project" value={project ? (project.code + " - " + project.name) : ""}
              label="Project" variant="outlined" disabled />}
            {currentType === 1 && <Button variant="contained" color="primary" onClick={() => setShowSelectProject(true)} >Select Project</Button>}
            {currentType === 1 && project_error && <Alert className={classes.alert} severity="error"> {project_error} </Alert>} */}
            {currentType == 1 && <FormControl size="small" variant="outlined" className={classes.formControl}>
              <InputLabel id="po-select-label">Return Indents *</InputLabel>
              <Select
                labelId="RI-select-label"
                id="pRI-select-label"
                value={currentRI === -1 ? "" : currentRI}
                onChange={handleRIChange}
                label="Return Indent *"
              >
                {returnIndents && returnIndents.map((row, index) => {
                  return (
                    <MenuItem key={"" + index} value={index}>{"" + row.indent.code}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>}

            {currentType == 2 && <FormControl size="small" variant="outlined" className={classes.formControl}>
              <InputLabel id="po-select-label">Local Purchase Indent *</InputLabel>
              <Select
                labelId="po-select-label"
                id="po-select-label"
                value={currentLP === -1 ? "" : currentLP}
                onChange={handleLPChange}
                label="Local Purchase Indent *"
              >
                {localPurchases && localPurchases.map((row, index) => {
                  return (
                    <MenuItem key={"" + index} value={index}>{"" + row.transaction.code + ",   " + row.createddate_conv.toDateString()}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>}
            {currentType == 2 && current_lp_error && <Alert className={classes.alert} severity="error"> {current_lp_error} </Alert>}

            {<TextField size="small" className={classes.inputFields} id="formControl_key_gate_entry_info" defaultValue={gate_entry_info}
              label="Gate Entry Info" variant="outlined" multiline
              onChange={(event) => { set_gate_entry_info(event.target.value); set_gate_entry_info_error(null); }} />}
            {gate_entry_info_error && <Alert className={classes.alert} severity="error"> {gate_entry_info_error} </Alert>}

            {(currentType == 0) && <TextField size="small" className={classes.inputFields} id="formControl_bill_no" defaultValue={bill_no}
              label="Bill Num" variant="outlined" multiline
              onChange={(event) => { set_bill_no(event.target.value); set_bill_no_error(null); }} />}
            {(currentType == 0) && bill_no_error && <Alert className={classes.alert} severity="error"> {bill_no_error} </Alert>}

            {(currentType == 0) && <FormControl variant="outlined" size="small" className={classes.formControl}>
              <MuiPickersUtilsProvider utils={DateFnsUtils} >
                <DatePicker size="small" label="Bill Date" inputVariant="outlined" format="dd/MM/yyyy" value={bill_date} onChange={set_bill_date} />
              </MuiPickersUtilsProvider>
            </FormControl>}
            {(currentType == 0) && bill_date_error && <Alert className={classes.alert} severity="error"> {bill_date_error} </Alert>}

            {(currentType == 0) && <TextField size="small" className={classes.inputFields} id="formControl_dc_no" defaultValue={dc_no}
              label="DC Num" variant="outlined" multiline
              onChange={(event) => { set_dc_no(event.target.value); set_dc_no_error(null); }} />}
            {(currentType == 0) && dc_no_error && <Alert className={classes.alert} severity="error"> {dc_no_error} </Alert>}

            {(currentType == 0) && <FormControl variant="outlined" size="small" className={classes.formControl}>
              <MuiPickersUtilsProvider utils={DateFnsUtils} >
                <DatePicker size="small" label="DC Date" inputVariant="outlined" format="dd/MM/yyyy" value={dc_date} onChange={set_dc_date} />
              </MuiPickersUtilsProvider>
            </FormControl>}
            {(currentType == 0) && dc_date_error && <Alert className={classes.alert} severity="error"> {dc_date_error} </Alert>}

            {<TextField size="small" className={classes.inputFields} id="formControl_lr_no" defaultValue={lr_no}
              label="LR Num" variant="outlined" multiline
              onChange={(event) => { set_lr_no(event.target.value); set_lr_no_error(null); }} />}
            {lr_no_error && <Alert className={classes.alert} severity="error"> {lr_no_error} </Alert>}

            {lr_date && <FormControl variant="outlined" size="small" className={classes.formControl}>
              <MuiPickersUtilsProvider utils={DateFnsUtils} >
                <DatePicker size="small" label="LR Date" inputVariant="outlined" format="dd/MM/yyyy" value={lr_date} onChange={set_lr_date} />
              </MuiPickersUtilsProvider>
            </FormControl>}
            {lr_date_error && <Alert className={classes.alert} severity="error"> {lr_date_error} </Alert>}

            {<TextField size="small" className={classes.inputFields} id="formControl_transporter" defaultValue={transporter}
              label="Transporter" variant="outlined" multiline
              onChange={(event) => { set_transporter(event.target.value); set_transporter_error(null); }} />}
            {transporter_error && <Alert className={classes.alert} severity="error"> {transporter_error} </Alert>}

            {<TextField size="small" className={classes.inputFields} id="formControl_vehicle_no" defaultValue={vehicle_no}
              label="Vehicle Num" variant="outlined" multiline
              onChange={(event) => { set_vehicle_no(event.target.value); set_vehicle_no_error(null); }} />}
            {vehicle_no_error && <Alert className={classes.alert} severity="error"> {vehicle_no_error} </Alert>}

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
              {currentType == 0 && <TableContainer className={classes.container}>
                <Table className={classes.smalltable} stickyHeader aria-labelledby="tableTitle" size='small' aria-label="enhanced table" >
                  <EnhancedTableHeadSmall title="Purchase Items" onClick={addItem} />
                  <TableBody>
                    {items.map((row, index) => {
                      return (
                        <TableRow hover tabIndex={-1} key={"" + index} >
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + (index + 1) + ". " + row.name}</TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{row.description}</TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{getuomFor(row.uomId)}</TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{row.rate}</TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{row.canreceiveqty}</TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{getReceivedQty(row)}</TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                            <TextField size="small" id={"formControl_qty_" + index} style={{width: '100px'}} type="number" value={row.qty}
                              variant="outlined" onChange={(event) => { set_item_qty_for(event.target.value, index) }} />
                          </TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                            <Button variant="contained" onClick={() => {deleteAction(index)}}>Remove</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              }
              {currentType == 1 && <TableContainer className={classes.container}>
                <Table className={classes.smalltable} stickyHeader aria-labelledby="tableTitle" size='small' aria-label="enhanced table" >
                  <EnhancedTableHeadSmall2 title="Name" onClick={addItem} />
                  <TableBody>
                    {materials.map((row, index) => {
                      return (
                        <TableRow hover tabIndex={-1} key={"" + index} >
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + (index + 1) + ". " + row.name}</TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{row.description}</TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{getuomFor(row.uomId)}</TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{row.qty}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              }
              {currentType == 2 && <TableContainer className={classes.container}>
                <Table className={classes.smalltable} stickyHeader aria-labelledby="tableTitle" size='small' aria-label="enhanced table" >
                  <EnhancedTableHeadSmall2 title="Purchase Items" onClick={addItem} />
                  <TableBody>
                    {items.map((row, index) => {
                      return (
                        <TableRow hover tabIndex={-1} key={"" + index} >
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + (index + 1) + ". " + row.name}</TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{row.description}</TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{getuomFor(row.uomId)}</TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{row.qty}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              }
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

      { showSelectItem && <SelectItem2 closeAction={closeSelectItemDialogAction} onSelect={onSelectItem} items={(currentType === 0) ? poItems : allItems} selectedItems={items} type={"Receivable Items"} />}

      { showSelectItemForLP && <SelectItem2 closeAction={closeSelectItemDialogAction} onSelect={onSelectItemForLP} items={(currentType === 2) ? lpItems : allItems} selectedItems={items} type={"LP Receivable Items"} />}

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
