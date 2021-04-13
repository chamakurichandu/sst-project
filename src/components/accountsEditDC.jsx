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

  const [project, set_project] = React.useState(null);
  const [project_error, set_project_error] = React.useState(null);

  const [esugam, set_esugam] = React.useState(props.dc.transaction.esugam_no ? props.dc.transaction.esugam_no : "");
  const [esugam_error, set_esugam_error] = React.useState(null);

  const [esugam_date, set_esugam_date] = React.useState(new Date());
  const [esugam_date_error, set_esugam_date_error] = React.useState(null);

  const [files, set_files] = React.useState(props.dc.transaction.esugam_docs ? props.dc.transaction.esugam_docs : []);

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

    }
    catch (e) {
      console.log("Error in getting UOMs list");
      setErrorMessage("Error in getting UOMs list");
      setShowError(true);
      setShowBackDrop(false);
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
    getAllItemList(10000);

    console.log(props.dc);

  }, []);

  useEffect(() => {
    if (uoms && uoms.length > 0) {
      populateDCDetails();
    }

  }, [uoms]);

  const populateDCDetails = () => {
    if (props.dc.transaction.type === "projects") {
      setCurrentType(0);
    }
    else if (props.dc.transaction.type === "stocktransfer") {
      setCurrentType(1);
    }
  };

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
      esugam: Joi.string().min(1).max(1024).required(),
    });
    const { error } = schema.validate({
      esugam: esugam.trim()
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

    generateDCForProjects();
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
    set_esugam_error(null);

    const errors = validateData();

    let errorOccured = false;
    if (currentType === -1) {
      set_current_type_error("Type Required");
      errorOccured = true;
    }
    if (errors["esugam"]) {
      set_esugam_error(errors["esugam"]);
      errorOccured = true;
    }

    if (props.dc.items.length === 0) {
      set_items_error("Items required");
      errorOccured = true;
    }

    if (errorOccured)
      return;

    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/deliverychallan/update";

      let postObj = {};
      postObj["esugam_no"] = esugam.trim();
      postObj["esugam_date"] = esugam_date.toUTCString();
      console.log("1");
      console.log("files: ", files);
      postObj["esugam_docs"] = [];
      for (let i = 0; i < files.length; ++i) {
        postObj["esugam_docs"].push({ name: files[i].name, path: files[i].path });
      }

      console.log("postObj: ", postObj);

      let updateObj = { _id: props.dc.transaction._id, updateParams: postObj };

      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

      const updated = await axios.patch(url, updateObj);

      console.log("4");
      console.log("successfully Saved");
      setShowBackDrop(false);
      props.history.push("/accounts-dc");
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
        // if (!pos) {
        //   getWarehouseList();
        // }
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
        folder: "warehouse_esugam_docs"
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
      <div className={classes.paper}>

        <EnhancedTableToolbar title=  {(props.editable?"Edit DC":"DC Details")} />

        <form className={classes.papernew} autoComplete="off" noValidate>
          <FormControl size="small" variant="outlined" className={classes.formControl}>
            <InputLabel id="type-select-label">Delivery Type *</InputLabel>
            <Select
              labelId="type-select-label"
              id="type-select-label"
              value={currentType === -1 ? "" : currentType}
              onChange={handleTypeChange}
              label="Delivery Type *"
              disabled
            >
              {types && types.map((row, index) => {
                return (
                  <MenuItem key={"" + index} value={index}>{"" + row}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {current_type_error && <Alert className={classes.alert} severity="error"> {current_type_error} </Alert>}

          {currentType === 1 &&
            <TextField size="small" className={classes.inputFields} id="formControl_stocktransfer" value={props.dc.stocktransfer.code}
              label="Stock Transfer" variant="outlined" disabled />}

          {currentType === 0 &&
            <TextField size="small" className={classes.inputFields} id="formControl_indent" value={props.dc.indent.code}
              label="Material Indent" variant="outlined" disabled />}

          {currentType === 0 &&
            <TextField size="small" className={classes.inputFields} id="formControl_indent" value={props.dc.indent.code}
              label="Material Indent" variant="outlined" disabled />}

          {currentType === 0
            && <TextField size="small" className={classes.inputFields} id="formControl_servicevendor_name"
              value={props.dc.servicevendor?"" + props.dc.servicevendor.code + props.dc.servicevendor.name:""}
              label="ServiceVendor Name" variant="outlined" disabled />}

          {<TextField size="small" className={classes.inputFields} id="formControl_lr_no" value={props.dc.transaction.lr_no}
            label="LR Num" variant="outlined" disabled />}

          {<TextField size="small" className={classes.inputFields} id="formControl_lr_date" value={props.dc.transaction.lr_date}
            label="LR Date" variant="outlined" disabled />}

          {<TextField size="small" className={classes.inputFields} id="formControl_transporter" value={props.dc.transaction.transporter}
            label="Transporter" variant="outlined" disabled />}

          {<TextField size="small" className={classes.inputFields} id="formControl_vehicle_no" value={props.dc.transaction.vehicle_no}
            label="Vehicle no" variant="outlined" disabled />}

          {<TextField size="small" className={classes.inputFields} id="formControl_remark" value={props.dc.transaction.remark}
            label="Remark" variant="outlined" disabled />}

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

          {currentType === 0 &&
            <Paper className={classes.paper} style={{ marginTop: 10 }}>
              <TableContainer className={classes.container}>
                <Table className={classes.smalltable} stickyHeader aria-labelledby="tableTitle" size='small' aria-label="enhanced table" >
                  <EnhancedTableHeadSmall title="Releasing Items" onClick={addItem} />
                  <TableBody>
                    {props.dc.items.map((row, index) => {
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
          }

          <TextField size="small" className={classes.inputFields} id="formControl_esugam" value={esugam}
            label="E-Sugam Num" variant="outlined"
            onChange={(event) => { set_esugam(event.target.value); set_esugam_error(null); }} disabled />
          {esugam_error && <Alert className={classes.alert} severity="error"> {esugam_error} </Alert>}

          {<FormControl variant="outlined" size="small" className={classes.formControl}>
            <MuiPickersUtilsProvider utils={DateFnsUtils} >
              <DatePicker size="small" label="E-Sugam Date" inputVariant="outlined" format="dd/MM/yyyy" value={esugam_date} onChange={set_esugam_date} disabled/>
            </MuiPickersUtilsProvider>
          </FormControl>}
          {esugam_date_error && <Alert className={classes.alert} severity="error"> {esugam_date_error} </Alert>}

          <div style={{ marginTop: 10 }}>
            { props.editable && <div>
              {files.map((file, index) => {
                return (<Chip style={{ marginTop: 5, marginRight: 5 }} key={"chip" + index} label={file.name} clickable={props.editable} variant="outlined" onClick={() => handleOpenDoc(index)} onDelete={() => handleDelete(index)} />);
              })}
            </div>}
            {!props.editable && <div>
              {files.map((file, index) => {
                return (<Chip style={{ marginTop: 5, marginRight: 5 }} key={"chip" + index} label={file.name} clickable={props.editable} variant="outlined" onClick={() => handleOpenDoc(index)}/>);
              })}
            </div>}
            <div style={{ marginTop: 5 }}>
            {props.editable?  <Button style={{ background: "#314293", color: "#FFFFFF" }} variant="contained" component="label" onChange={onFileSelected}>
                Upload E-Sugam Document
                                    <input type="file" hidden />
              </Button>:""}
            </div>
          </div>

          <div className={classes.submit}>
            {!props.editable && <Button variant="contained" color="primary" onClick={handleCancel} >Cancel</Button>}
            {props.editable && <Button style={{ marginLeft: 10 }} variant="contained" color="primary" onClick={handleSave} >Save</Button>}
          </div>

        </form>
        {/* </Paper> */}
      </div>

      {/* { showSelectItem && <SelectItem2 closeAction={closeSelectItemDialogAction} onSelect={onSelectItem} items={(currentType === 0) ? poItems : allItems} selectedItems={items} type={"Receivable Items"} />}

      { showSelectItemForLP && <SelectItem closeAction={closeSelectItemDialogAction} onSelect={onSelectItemForLP} items={allItems} type={"Receivable Items"} />}

      { showSelectProject && <SelectProject closeAction={closeSelectProjectDialogAction} onSelect={onSelectProject} projects={projects} />} */}

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
