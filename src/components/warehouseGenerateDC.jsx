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
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { getPositionOfLineAndCharacter } from 'typescript';
import ReleaseIndents from './releaseIndents';
import MaterialIndents from './materialIndents';

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
  const [items_error, set_items_error] = React.useState(null);

  const [allItems, set_allItems] = React.useState([]);
  const [currentItem, setCurrentItem] = React.useState(-1);

  const [prouctCategories, set_prouctCategories] = React.useState([]);
  const [uoms, set_uoms] = React.useState([]);

  const [currentSupplyVendor, setCurrentSupplyVendor] = React.useState(-1);
  const [currentSupplyVendor_error, setCurrentSupplyVendor_error] = React.useState(null);

  const [currentProject, setCurrentProject] = React.useState(-1);
  const [current_project_error, set_current_project_error] = React.useState(null);

  const [projects, setProjects] = React.useState([]);

  const [showSelectItem, setShowSelectItem] = React.useState(false);
  const [showSelectItemForLP, setShowSelectItemForLP] = React.useState(false);
  const [showSelectProject, setShowSelectProject] = React.useState(false);

  const [showBackDrop, setShowBackDrop] = React.useState(false);

  const [types, setTypes] = React.useState(["Projects", "Stock Transfer"]);
  const [currentType, setCurrentType] = React.useState(-1);
  const [current_type_error, set_current_type_error] = React.useState(null);

  const [pos, setPOs] = React.useState(null);
  const [currentPO, setCurrentPO] = React.useState(-1);
  const [current_po_error, set_current_po_error] = React.useState(null);

  const [warehouses, setWarehouses] = React.useState([]);
  const [currentWarehouse, setCurrentWarehouse] = React.useState(-1);
  const [current_warehouse_error, set_current_warehouse_error] = React.useState(null);

  const [releasedTransactions, setReleasedTransactions] = React.useState([]);
  const [currentReleasedTransaction, setCurrentReleasedTransaction] = React.useState(-1);
  const [current_released_indent_error, set_current_released_indent_error] = React.useState(null);

  const [poItems, setPOItems] = React.useState([]);

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

  // const [esugam, set_esugam] = React.useState('');
  // const [esugam_error, set_esugam_error] = React.useState(null);

  // const [esugam_date, set_esugam_date] = React.useState(new Date());
  // const [esugam_date_error, set_esugam_date_error] = React.useState(null);

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

  const dateFns = new DateFnsUtils();

  async function getPOs() {
    try {
      let url = config["baseurl"] + "/api/po/list?count=" + 10000 + "&offset=" + 0 + "&search=";
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

  async function getReleaseIndents(proj) {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/releasetransaction/list?count=" + 1000 + "&warehouse=" + props.warehouse._id + "&project=" + proj._id + "&itemdetails=1" + "&offset=" + 0 + "&search=" + "";
      console.log(url);
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log(data);
      let newRows = [];
      const dateFns = new DateFnsUtils();
      for (let i = 0; i < data.list.length; ++i) {
        data.list[i].indent.createddate_conv = dateFns.date(data.list[i].indent.createdDate);
        newRows.push(data.list[i]);
      }

      setReleasedTransactions(newRows);

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

  useEffect(() => {
    if (props.warehouse)
      getAllItemList(10000);
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
      // esugam: Joi.string().min(1).max(1024).required(),
      lr_no: Joi.string().min(1).max(8192).required(),
      transporter: Joi.string().min(1).max(8192).required(),
      vehicle_no: Joi.string().min(1).max(8192).required(),
    });
    const { error } = schema.validate({
      // esugam: esugam.trim(),
      lr_no: lr_no.trim(),
      transporter: transporter.trim(),
      vehicle_no: vehicle_no.trim(),
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
        generateDCForProjects();
        break;
      case 2:
        break;
      default:
        set_current_type_error("Type Required");
        break;
    }
  };

  const getTypeString = (type) => {
    switch (type) {
      case 0:
        return "projects";
        break;
      case 1:
        return "stocktransfer";
        break;
    }

    return "";
  };

  const generateDCForProjects = async () => {
    set_current_type_error(null)
    set_current_project_error(null);
    set_current_released_indent_error(null);
    // set_esugam_error(null);
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
    if (currentProject === -1) {
      set_current_project_error("Project Required");
      errorOccured = true;
    }
    if (currentReleasedTransaction === -1) {
      set_current_released_indent_error("Release Indent Required");
      errorOccured = true;
    }
    if (errors["remark"]) {
      set_remark_error(errors["remark"]);
      errorOccured = true;
    }
    // if (errors["esugam"]) {
    //   set_esugam_error(errors["esugam"]);
    //   errorOccured = true;
    // }
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
      let url = config["baseurl"] + "/api/deliverychallan/add";

      let postObj = {};
      postObj["warehouse"] = props.warehouse._id;
      postObj["type"] = getTypeString(currentType);
      postObj["project"] = projects[currentProject]._id;
      postObj["releasedtransaction"] = releasedTransactions[currentReleasedTransaction].transaction._id;
      postObj["esugam_no"] = null;//esugam.trim();
      postObj["esugam_date"] = null;//esugam_date.toUTCString();
      postObj["lr_no"] = lr_no.trim();
      postObj["lr_date"] = lr_date.toUTCString();
      postObj["transporter"] = transporter.trim();
      postObj["vehicle_no"] = vehicle_no.trim();
      postObj["remark"] = remark.trim();

      postObj["docs"] = [];
      for (let i = 0; i < files.length; ++i) {
        postObj["docs"].push({ name: files[i].name, path: files[i].path });
      }

      // postObj["items"] = [];
      // for (let i = 0; i < items.length; ++i) {
      //   postObj["items"].push({ item: items[i]._id, qty: parseInt(items[i].qty), rate: parseInt(items[i].rate), scheduled_date: items[i].scheduled_date });
      // }

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
    if (currentType === 0 && currentPO >= 0)
      setShowSelectItem(true);
    else if (currentType === 2)
      setShowSelectItemForLP(true);
  };

  const closeSelectItemDialogAction = () => {
    setShowSelectItem(false);
    setShowSelectItemForLP(false);
  };

  const onSelectItem = (newitem) => {
    setShowSelectItem(false);

    for (let i = 0; i < items.length; ++i) {
      if (items[i]._id == newitem._id && items[i].scheduled_date == newitem.scheduled_date)
        return;
    }

    console.log(newitem);

    let newCopy = cloneDeep(newitem);
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
    setShowSelectItemForLP(false);

    for (let i = 0; i < items.length; ++i) {
      if (items[i]._id == newitem._id && items[i].scheduled_date == newitem.scheduled_date)
        return;
    }

    console.log(newitem);

    let newCopy = cloneDeep(newitem);
    newCopy.qty = 0;
    newCopy.rate = 0;

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

  const handleTypeChange = (event) => {
    setCurrentType(event.target.value);
    set_current_type_error(null);

    set_items([]);

    switch (event.target.value) {
      case 0:
        if (!pos) {
          getPOs();
        }
        break;
      case 1:
        if (!pos) {
          getWarehouseList();
        }
        break;
      case 2:
        break;
      case 3:
        break;
    }
  };

  const handleReleasedIndentChange = (event) => {
    setCurrentReleasedTransaction(event.target.value);

    const releaseIndent = releasedTransactions[event.target.value];
    console.log(releaseIndent);
    set_items(releaseIndent.items ? releaseIndent.items : []);
  };

  const handleProjectChange = (event) => {
    setCurrentProject(event.target.value);
    setCurrentReleasedTransaction(-1);
    set_current_project_error(null);

    getReleaseIndents(projects[event.target.value]);
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

  return (
    <div className={clsx(classes.root)}>
      {props.warehouse &&
        <div className={classes.paper}>

          <EnhancedTableToolbar title={props.warehouse.name + ": Generate DC"} />

          <form className={classes.papernew} autoComplete="off" noValidate>
            <FormControl size="small" variant="outlined" className={classes.formControl}>
              <InputLabel id="type-select-label">Delivery Type *</InputLabel>
              <Select
                labelId="type-select-label"
                id="type-select-label"
                value={currentType === -1 ? "" : currentType}
                onChange={handleTypeChange}
                label="Delivery Type *"
              >
                {types && types.map((row, index) => {
                  return (
                    <MenuItem key={"" + index} value={index}>{"" + row}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {current_type_error && <Alert className={classes.alert} severity="error"> {current_type_error} </Alert>}

            {currentType === 0 && <FormControl size="small" variant="outlined" className={classes.formControl}>
              <InputLabel id="po-select-label">Project *</InputLabel>
              <Select
                labelId="po-select-label"
                id="po-select-label"
                value={currentProject === -1 ? "" : currentProject}
                onChange={handleProjectChange}
                label="Project *"
              >
                {projects && projects.map((row, index) => {
                  return (
                    <MenuItem key={"" + index} value={index}>{"" + row.code}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>}
            {currentType === 0 && current_po_error && <Alert className={classes.alert} severity="error"> {current_po_error} </Alert>}

            {currentType === 1 && <FormControl size="small" variant="outlined" className={classes.formControl}>
              <InputLabel id="warehouse-select-label">Warehouse *</InputLabel>
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
            </FormControl>}
            {currentType === 1 && current_warehouse_error && <Alert className={classes.alert} severity="error"> {current_warehouse_error} </Alert>}

            {currentType === 0 && <FormControl size="small" variant="outlined" className={classes.formControl}>
              <InputLabel id="materialindent-select-label">Released Indent *</InputLabel>
              <Select
                labelId="materialindent-select-label"
                id="materialindent-select-label"
                value={currentReleasedTransaction === -1 ? "" : currentReleasedTransaction}
                onChange={handleReleasedIndentChange}
                label="Released Indent *"
              >
                {releasedTransactions && releasedTransactions.map((row, index) => {
                  return (
                    <MenuItem key={"" + index} value={index}>{"" + row.indent.code}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>}
            {currentType === 0 && current_released_indent_error && <Alert className={classes.alert} severity="error"> {current_released_indent_error} </Alert>}

            {currentType === 0 && projects && (currentProject >= 0) && releasedTransactions && (currentReleasedTransaction >= 0)
              && <TextField size="small" className={classes.inputFields} id="formControl_servicevendor_name"
                value={releasedTransactions[currentReleasedTransaction].servicevendor ? (releasedTransactions[currentReleasedTransaction].servicevendor.code + " : " + releasedTransactions[currentReleasedTransaction].servicevendor.name) : "Older Data. Dont do anything. Cannot create DC!!!!"}
                label="ServiceVendor Name" variant="outlined" multiline disabled />}

            {/* <TextField size="small" className={classes.inputFields} id="formControl_esugam" defaultValue={esugam}
              label="E-Sugam Num" variant="outlined"
              onChange={(event) => { set_esugam(event.target.value); set_esugam_error(null); }} />
            {esugam_error && <Alert className={classes.alert} severity="error"> {esugam_error} </Alert>} */}

            {/* {<FormControl variant="outlined" size="small" className={classes.formControl}>
              <MuiPickersUtilsProvider utils={DateFnsUtils} >
                <DatePicker size="small" label="E-Sugam Date" inputVariant="outlined" format="dd/MM/yyyy" value={esugam_date} onChange={set_esugam_date} />
              </MuiPickersUtilsProvider>
            </FormControl>}
            {esugam_date_error && <Alert className={classes.alert} severity="error"> {esugam_date_error} </Alert>} */}

            <TextField size="small" className={classes.inputFields} id="formControl_lr_no" defaultValue={lr_no}
              label="LR Num" variant="outlined" multiline
              onChange={(event) => { set_lr_no(event.target.value); set_lr_no_error(null); }} />
            {lr_no_error && <Alert className={classes.alert} severity="error"> {lr_no_error} </Alert>}

            <FormControl variant="outlined" size="small" className={classes.formControl}>
              <MuiPickersUtilsProvider utils={DateFnsUtils} >
                <DatePicker size="small" label="LR Date" inputVariant="outlined" format="dd/MM/yyyy" value={lr_date} onChange={set_lr_date} />
              </MuiPickersUtilsProvider>
            </FormControl>
            {lr_date_error && <Alert className={classes.alert} severity="error"> {lr_date_error} </Alert>}

            <TextField size="small" className={classes.inputFields} id="formControl_transporter" defaultValue={transporter}
              label="Transporter" variant="outlined" multiline
              onChange={(event) => { set_transporter(event.target.value); set_transporter_error(null); }} />
            {transporter_error && <Alert className={classes.alert} severity="error"> {transporter_error} </Alert>}

            <TextField size="small" className={classes.inputFields} id="formControl_vehicle_no" defaultValue={vehicle_no}
              label="Vehicle Num" variant="outlined" multiline
              onChange={(event) => { set_vehicle_no(event.target.value); set_vehicle_no_error(null); }} />
            {vehicle_no_error && <Alert className={classes.alert} severity="error"> {vehicle_no_error} </Alert>}

            <TextField size="small" className={classes.inputFields} id="formControl_remark" defaultValue={remark}
              label="Remark" variant="outlined" multiline
              onChange={(event) => { set_remark(event.target.value); set_remark_error(null); }} />
            {remark_error && <Alert className={classes.alert} severity="error"> {remark_error} </Alert>}

            {/* <div style={{ marginTop: 10 }}>
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
            </div> */}

            <Paper className={classes.paper} style={{ marginTop: 10 }}>
              <TableContainer className={classes.container}>
                <Table className={classes.smalltable} stickyHeader aria-labelledby="tableTitle" size='small' aria-label="enhanced table" >
                  <EnhancedTableHeadSmall title="Purchase Items" onClick={addItem} />
                  <TableBody>
                    {items.map((row, index) => {
                      return (
                        <TableRow hover tabIndex={-1} key={"" + index} >
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + (index + 1) + ". " + row.details.description}</TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{getuomFor(row.details.uomId)}</TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{row.qty}</TableCell>
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

      { showSelectItem && <SelectItem2 closeAction={closeSelectItemDialogAction} onSelect={onSelectItem} items={(currentType === 0) ? poItems : allItems} selectedItems={items} type={"Receivable Items"} />}

      { showSelectItemForLP && <SelectItem closeAction={closeSelectItemDialogAction} onSelect={onSelectItemForLP} items={allItems} type={"Receivable Items"} />}

      { showSelectProject && <SelectProject closeAction={closeSelectProjectDialogAction} onSelect={onSelectProject} projects={projects} />}

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
