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
import DeleteImage from '@material-ui/icons/Delete';
import SelectItem from './selectItem';
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
    { id: 'uom', numeric: false, disablePadding: false, label: "UOM" },
    { id: 'schedule_date', numeric: true, disablePadding: false, label: "Schedule Date" },
    { id: 'rate', numeric: true, disablePadding: false, label: "Rate (Rs)" },
    { id: 'qty', numeric: true, disablePadding: false, label: "Qty" },
    { id: 'actions', numeric: true, disablePadding: false, label: "Actions" }
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

export default function EditLOI(props) {

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

  const [projects_error, set_projects_error] = React.useState(null);
  const [warehouses_error, set_warehouses_error] = React.useState(null);
  const [currentProject, setCurrentProject] = React.useState(-1);
  const [currentWarehouse, setCurrentWarehouse] = React.useState(-1);
  const [projects, setProjects] = React.useState([]);
  const [warehouses, setWarehouses] = React.useState([]);

  const [supply_vendor, set_supply_vendor] = React.useState(null);
  const [supply_vendor_error, set_supply_vendor_error] = React.useState(null);

  const [reference_number, set_reference_number] = React.useState(props.loi.reference_number ? props.loi.reference_number : '');
  const [reference_number_error, set_reference_number_error] = React.useState(null);

  const [scope_of_supply, set_scope_of_supply] = React.useState(props.loi.scope_of_supply);
  const [scope_of_supply_error, set_scope_of_supply_error] = React.useState(null);

  const [price_escalation, set_price_escalation] = React.useState(props.loi.price_escalation);
  const [price_escalation_error, set_price_escalation_error] = React.useState(null);

  const [warranty_period, set_warranty_period] = React.useState(props.loi.warranty_period);
  const [warranty_period_error, set_warranty_period_error] = React.useState(null);

  const [commencement_date, set_commencement_date] = React.useState(props.loi.commencement_date);
  const [commencement_date_error, set_commencement_date_error] = React.useState(null);

  const [delivery_timelines, set_delivery_timelines] = React.useState(props.loi.delivery_timelines);
  const [delivery_timelines_error, set_delivery_timelines_error] = React.useState(null);

  const [liquidated_damages, set_liquidated_damages] = React.useState(props.loi.liquidated_damages);
  const [liquidated_damages_error, set_liquidated_damages_error] = React.useState(null);

  const [performance_bank_guarantee, set_performance_bank_guarantee] = React.useState(props.loi.performance_bank_guarantee);
  const [performance_bank_guarantee_error, set_performance_bank_guarantee_error] = React.useState(null);

  const [arbitration, set_arbitration] = React.useState(props.loi.arbitration);
  const [arbitration_error, set_arbitration_error] = React.useState(null);

  const [inspection_and_testing, set_inspection_and_testing] = React.useState(props.loi.inspection_and_testing);
  const [inspection_and_testing_error, set_inspection_and_testing_error] = React.useState(null);

  const [test_certificates_instruction_manuals, set_test_certificates_instruction_manuals] = React.useState(props.loi.test_certificates_instruction_manuals);
  const [test_certificates_instruction_manuals_error, set_test_certificates_instruction_manuals_error] = React.useState(null);

  const [taxes_and_duties, set_taxes_and_duties] = React.useState(props.loi.taxes_and_duties);
  const [taxes_and_duties_error, set_taxes_and_duties_error] = React.useState(null);

  const [acceptance, set_acceptance] = React.useState(props.loi.acceptance);
  const [acceptance_error, set_acceptance_error] = React.useState(null);

  const [frieght_and_insurance, set_frieght_and_insurance] = React.useState(props.loi.frieght_and_insurance);
  const [frieght_and_insurance_error, set_frieght_and_insurance_error] = React.useState(null);

  const [payment_terms, set_payment_terms] = React.useState(props.loi.payment_terms);
  const [payment_terms_error, set_payment_terms_error] = React.useState(null);

  const [extra1, set_extra1] = React.useState(props.loi.extra1 ? props.loi.extra1 : "");
  const [extra2, set_extra2] = React.useState(props.loi.extra2 ? props.loi.extra2 : "");
  const [extra3, set_extra3] = React.useState(props.loi.extra3 ? props.loi.extra3 : "");
  const [dispatch_instruction, set_dispatch_instruction] = React.useState(props.loi.dispatch_instruction);
  const [compliance, set_compliance] = React.useState(props.loi.compliance);
  const [guarantee, set_guarantee] = React.useState(props.loi.guarantee);

  const [key_remark, set_key_remark] = React.useState(props.loi.key_remark);
  const [key_remark_error, set_key_remark_error] = React.useState(null);

  const [items, set_items] = React.useState([]);
  const [items_error, set_items_error] = React.useState(null);

  const [allItems, set_allItems] = React.useState([]);
  const [currentItem, setCurrentItem] = React.useState(-1);

  const [prouctCategories, set_prouctCategories] = React.useState([]);
  const [uoms, set_uoms] = React.useState([]);

  const [supplyVendors, setSupplyVendors] = React.useState([]);
  const [currentSupplyVendor, setCurrentSupplyVendor] = React.useState(-1);
  const [currentSupplyVendor_error, setCurrentSupplyVendor_error] = React.useState(null);
  
  const [indexTobeDeleted, set_indexTobeDeleted] = React.useState(null);

  const [showSelectItem, setShowSelectItem] = React.useState(false);

  const [showBackDrop, setShowBackDrop] = React.useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = React.useState(false);

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
        if (props.loi.supply_vendor === data.list.docs[i]._id) {
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

      console.log(props.loi);
      let newItems = cloneDeep(props.loi.items);
      for (let k = 0; k < newItems.length; ++k) {
        let item = newItems[k];
        for (let i = 0; i < data.list.docs.length; ++i) {
          if (newItems[k].item === data.list.docs[i]._id) {
            item._id = data.list.docs[i]._id;
            item.name = data.list.docs[i].name;
            item.uomId = data.list.docs[i].uomId;
            item.hsncode = data.list.docs[i].hsncode;
            break;
          }
        }
      }

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

      for (let i = 0; i < data.list.docs.length; ++i) {
        if (props.loi.project === data.list.docs[i]._id) {
          setCurrentProject(i);
          break;
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

      for (let i = 0; i < data.list.length; ++i) {
        if (props.loi.warehouse === data.list[i]._id) {
          setCurrentWarehouse(i);
          break;
        }
      }

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

  useEffect(() => {
    getSupplyVendorList();
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowError(false);
  };

  const handleBreadCrumClick = () => {
    props.history.push("/loi");
  };

  const handleCancel = () => {
    props.history.push("/loi");
  };

  const validateData = () => {
    const schema = Joi.object({
      key_remark: Joi.string().min(1).max(1024).required(),
      scope_of_supply: Joi.string().min(1).max(8192).required(),
      price_escalation: Joi.string().min(1).max(8192).required(),
      warranty_period: Joi.string().min(1).max(8192).required(),
      commencement_date: Joi.string().min(1).max(8192).required(),
      delivery_timelines: Joi.string().min(1).max(8192).required(),
      liquidated_damages: Joi.string().min(1).max(8192).required(),
      performance_bank_guarantee: Joi.string().min(1).max(8192).required(),
      arbitration: Joi.string().min(1).max(8192).required(),
      inspection_and_testing: Joi.string().min(1).max(8192).required(),
      test_certificates_instruction_manuals: Joi.string().min(1).max(8192).required(),
      taxes_and_duties: Joi.string().min(1).max(8192).required(),
      acceptance: Joi.string().min(1).max(8192).required(),
      frieght_and_insurance: Joi.string().min(1).max(8192).required(),
      payment_terms: Joi.string().min(1).max(8192).required(),
    });
    const { error } = schema.validate({
      key_remark: key_remark.trim(),
      scope_of_supply: scope_of_supply.trim(),
      price_escalation: price_escalation.trim(),
      warranty_period: warranty_period.trim(),
      commencement_date: commencement_date.trim(),
      delivery_timelines: delivery_timelines.trim(),
      liquidated_damages: liquidated_damages.trim(),
      performance_bank_guarantee: performance_bank_guarantee.trim(),
      arbitration: arbitration.trim(),
      inspection_and_testing: inspection_and_testing.trim(),
      test_certificates_instruction_manuals: test_certificates_instruction_manuals.trim(),
      taxes_and_duties: taxes_and_duties.trim(),
      acceptance: acceptance.trim(),
      frieght_and_insurance: frieght_and_insurance.trim(),
      payment_terms: payment_terms.trim()
    }, { abortEarly: false });
    const allerrors = {};
    if (error) {
      for (let item of error.details)
        allerrors[item.path[0]] = item.message;
    }

    return allerrors;
  }

  const handlePO = () => {
    props.setCreateFromLoi(true);
    props.history.push("/add-po");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    set_projects_error(null);
    set_warehouses_error(null);
    set_supply_vendor_error(null);
    set_key_remark_error(null);
    set_items_error(null);
    set_scope_of_supply_error(null);
    set_price_escalation_error(null);
    set_warranty_period_error(null);
    set_commencement_date_error(null);
    set_delivery_timelines_error(null);
    set_liquidated_damages_error(null);
    set_performance_bank_guarantee_error(null);
    set_arbitration_error(null);
    set_inspection_and_testing_error(null);
    set_test_certificates_instruction_manuals_error(null);
    set_taxes_and_duties_error(null);
    set_acceptance_error(null);
    set_frieght_and_insurance_error(null);
    set_payment_terms_error(null);

    const errors = validateData();

    let errorOccured = false;
    if (currentProject === -1) {
      set_projects_error("Project Required");
      errorOccured = true;
    }
    if (currentWarehouse === -1) {
      set_warehouses_error("Warehouse Required");
      errorOccured = true;
    }
    if (currentSupplyVendor === -1) {
      set_supply_vendor_error("Supply Vendor Required");
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

    if (errors["scope_of_supply"]) {
      set_scope_of_supply_error(errors["scope_of_supply"]);
      errorOccured = true;
    }
    if (errors["price_escalation"]) {
      set_price_escalation_error(errors["price_escalation"]);
      errorOccured = true;
    }
    if (errors["warranty_period"]) {
      set_warranty_period_error(errors["warranty_period"]);
      errorOccured = true;
    }
    if (errors["commencement_date"]) {
      set_commencement_date_error(errors["commencement_date"]);
      errorOccured = true;
    }
    if (errors["delivery_timelines"]) {
      set_delivery_timelines_error(errors["delivery_timelines"]);
      errorOccured = true;
    }
    if (errors["liquidated_damages"]) {
      set_liquidated_damages_error(errors["liquidated_damages"]);
      errorOccured = true;
    }
    if (errors["performance_bank_guarantee"]) {
      set_performance_bank_guarantee_error(errors["performance_bank_guarantee"]);
      errorOccured = true;
    }
    if (errors["arbitration"]) {
      set_arbitration_error(errors["arbitration"]);
      errorOccured = true;
    }
    if (errors["inspection_and_testing"]) {
      set_inspection_and_testing_error(errors["inspection_and_testing"]);
      errorOccured = true;
    }
    if (errors["test_certificates_instruction_manuals"]) {
      set_test_certificates_instruction_manuals_error(errors["test_certificates_instruction_manuals"]);
      errorOccured = true;
    }
    if (errors["taxes_and_duties"]) {
      set_taxes_and_duties_error(errors["taxes_and_duties"]);
      errorOccured = true;
    }
    if (errors["acceptance"]) {
      set_acceptance_error(errors["acceptance"]);
      errorOccured = true;
    }
    if (errors["frieght_and_insurance"]) {
      set_frieght_and_insurance_error(errors["frieght_and_insurance"]);
      errorOccured = true;
    }
    if (errors["payment_terms"]) {
      set_payment_terms_error(errors["payment_terms"]);
      errorOccured = true;
    }

    if (items.length === 0) {
      set_items_error("Items required");
      errorOccured = true;
    }

    for (let i = 0; i < items.length; ++i) {
      if (parseInt(items[i].rate) === 0) {
        setErrorMessage("rate cannot be zero");
        setShowError(true);
        errorOccured = true;
        break;
      }
      if (parseInt(items[i].qty) === 0) {
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
      let url = config["baseurl"] + "/api/loi/update";

      console.log(1);
      let postObj = {};
      postObj["supply_vendor"] = supplyVendors[currentSupplyVendor]._id;
      postObj["project"] = projects[currentProject]._id;
      postObj["warehouse"] = warehouses[currentWarehouse]._id;
      postObj["reference_number"] = reference_number.trim();
      postObj["key_remark"] = key_remark.trim();
      postObj["items"] = [];
      console.log(1.1);
      for (let i = 0; i < items.length; ++i) {
        postObj["items"].push({ item: items[i]._id, qty: parseInt(items[i].qty), rate: parseInt(items[i].rate), scheduled_date: items[i].scheduled_date });
      }
      console.log(2);
      console.log("postObj: ", postObj);

      postObj["scope_of_supply"] = scope_of_supply.trim();
      postObj["price_escalation"] = price_escalation.trim();
      postObj["warranty_period"] = warranty_period.trim();
      postObj["commencement_date"] = commencement_date.trim();
      postObj["delivery_timelines"] = delivery_timelines.trim();
      postObj["liquidated_damages"] = liquidated_damages.trim();
      postObj["performance_bank_guarantee"] = performance_bank_guarantee.trim();
      postObj["arbitration"] = arbitration.trim();
      postObj["inspection_and_testing"] = inspection_and_testing.trim();
      postObj["test_certificates_instruction_manuals"] = test_certificates_instruction_manuals.trim();
      postObj["taxes_and_duties"] = taxes_and_duties.trim();
      postObj["acceptance"] = acceptance.trim();
      postObj["frieght_and_insurance"] = frieght_and_insurance.trim();
      postObj["payment_terms"] = payment_terms.trim();
      postObj["extra1"] = extra1.trim();
      postObj["extra2"] = extra2.trim();
      postObj["extra3"] = extra3.trim();
      postObj["dispatch_instruction"] = dispatch_instruction.trim();
      postObj["compliance"] = compliance.trim();
      postObj["guarantee"] = guarantee.trim();

      let updateObj = { _id: props.loi._id, updateParams: postObj };

      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      console.log(3);
      const response = await axios.patch(url, updateObj);

      console.log("successfully Saved");
      setShowBackDrop(false);
      props.history.push("/loi");
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

    let newCopy = cloneDeep(newitem);

    newCopy.scheduledDate = new Date();
    newCopy.rate = 0;
    newCopy.qty = 0;

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
    set_warehouses_error(null);
  };

  const handleProjectChange = (event) => {
    setCurrentProject(event.target.value);
    set_projects_error(null);
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
    let newItems = [...items];
    newItems[index].qty = value;
    set_items(newItems);
  };

  const getuomFor = (value) => {
    for (let i = 0; i < uoms.length; ++i) {
      if (value === uoms[i]._id)
        return uoms[i].name;
    }
    return value;
  }

  const set_item_rate_for = (value, index) => {
    let newItems = [...items];
    newItems[index].rate = value;
    set_items(newItems);
  };

  const handleScheduleDateChange = (value, index) => {
    let newItems = [...items];
    newItems[index].scheduled_date = value;
    set_items(newItems);
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
  
  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [day,mnth,date.getFullYear()].join("-");
  }

  return (
    <div className={clsx(classes.root)}>
      <div className={classes.paper}>

        <EnhancedTableToolbar title={"Edit LOI"} />

        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" onClick={handleBreadCrumClick}>
            {"LOIs"}
          </Link>
          <Typography color="textPrimary">{"Edit LOI"}</Typography>
        </Breadcrumbs>

        <form className={classes.papernew} autoComplete="off" noValidate>

          <TextField size="small" className={classes.inputFields} id="formControl_loi_number" defaultValue={props.loi.code}
            label="LOI Number" variant="outlined" disabled />

          <FormControl size="small" variant="outlined" className={classes.formControl}>
            <InputLabel id="project-select-label">Project *</InputLabel>
            <Select
              labelId="project-select-label"
              id="project-select-label"
              value={currentProject === -1 ? "" : currentProject}
              onChange={handleProjectChange}
              label="Project *"
            >
              {projects && projects.map((row, index) => {
                return (
                  <MenuItem key={"" + index} value={index}>{row.name}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {projects_error && <Alert className={classes.alert} severity="error"> {projects_error} </Alert>}

          <FormControl size="small" variant="outlined" className={classes.formControl}>
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
                  <MenuItem key={"" + index} value={index}>{row.name}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {warehouses_error && <Alert className={classes.alert} severity="error"> {warehouses_error} </Alert>}

          <FormControl size="small" variant="outlined" className={classes.formControl}>
            <InputLabel id="supplyvendor-select-label">Supply Vendor *</InputLabel>
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

          <TextField size="small" className={classes.inputFields} id="formControl_reference_number" defaultValue={reference_number}
            label="Reference Number" variant="outlined" multiline
            onChange={(event) => { set_reference_number(event.target.value); set_reference_number_error(null); }} />
          {reference_number_error && <Alert className={classes.alert} severity="error"> {reference_number_error} </Alert>}

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
                      <TableRow hover tabIndex={-1} key={"" + index}>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + (index + 1) + ". " + items[index].name}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + getuomFor(items[index].uomId)}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                          {/* <MuiPickersUtilsProvider utils={DateFnsUtils} >
                            <DatePicker size="small" label="Schedule Date" inputVariant="outlined" format="dd/MM/yyyy" value={items[index].scheduled_date} onChange={(newDate) => handleScheduleDateChange(newDate, index)} />
                          </MuiPickersUtilsProvider> */}
                          <TextField size="small" label="Schedule Date" variant="outlined" format="dd/MM/yyyy" value={items[index].scheduled_date} onChange={(e) => handleScheduleDateChange(e.target.value, index)}/>
                        </TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                          <TextField size="small" id={"formControl_rate_" + index} type="number" value={items[index].rate}
                            variant="outlined" onChange={(event) => { set_item_rate_for(event.target.value, index) }} />
                        </TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                          <TextField size="small" id={"formControl_qty_" + index} type="number" value={items[index].qty}
                            variant="outlined" onChange={(event) => { set_item_qty_for(event.target.value, index) }} />
                        </TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                          <IconButton color="primary" aria-label="upload picture" size="small" onClick={() => {deleteAction(index)}}>
                            <DeleteImage />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          {items_error && <Alert className={classes.alert} severity="error"> {items_error} </Alert>}

          <TextField size="small" className={classes.inputFields} id="formControl_scope_of_supply" defaultValue={scope_of_supply}
            label="Scope of supply *" variant="outlined" multiline
            onChange={(event) => { set_scope_of_supply(event.target.value); set_scope_of_supply_error(null); }} />
          {scope_of_supply_error && <Alert className={classes.alert} severity="error"> {scope_of_supply_error} </Alert>}

          <TextField size="small" className={classes.inputFields} id="formControl_price_escalation" defaultValue={price_escalation}
            label="Price and Escalation *" variant="outlined" multiline
            onChange={(event) => { set_price_escalation(event.target.value); set_price_escalation_error(null); }} />
          {price_escalation_error && <Alert className={classes.alert} severity="error"> {price_escalation_error} </Alert>}

          <TextField size="small" className={classes.inputFields} id="formControl_taxes_and_duties" defaultValue={taxes_and_duties}
            label="Taxes & Duties *" variant="outlined" multiline
            onChange={(event) => { set_taxes_and_duties(event.target.value); set_taxes_and_duties_error(null); }} />
          {taxes_and_duties_error && <Alert className={classes.alert} severity="error"> {taxes_and_duties_error} </Alert>}

          <TextField size="small" className={classes.inputFields} id="formControl_frieght_and_insurance" defaultValue={frieght_and_insurance}
            label="Frieght & Insurance *" variant="outlined" multiline
            onChange={(event) => { set_frieght_and_insurance(event.target.value); set_frieght_and_insurance_error(null); }} />
          {frieght_and_insurance_error && <Alert className={classes.alert} severity="error"> {frieght_and_insurance_error} </Alert>}

          <TextField size="small" className={classes.inputFields} id="formControl_guarantee" defaultValue={guarantee}
            label=" Guarantee *" variant="outlined" multiline
            onChange={(event) => { set_guarantee(event.target.value); }} />

          <TextField size="small" className={classes.inputFields} id="formControl_commencement_date" defaultValue={commencement_date}
            label="Commencement Date *" variant="outlined" multiline
            onChange={(event) => { set_commencement_date(event.target.value); set_commencement_date_error(null); }} />
          {commencement_date_error && <Alert className={classes.alert} severity="error"> {commencement_date_error} </Alert>}

          <TextField size="small" className={classes.inputFields} id="formControl_delivery_timelines" defaultValue={delivery_timelines}
            label="Delivery Timelines *" variant="outlined" multiline
            onChange={(event) => { set_delivery_timelines(event.target.value); set_delivery_timelines_error(null); }} />
          {delivery_timelines_error && <Alert className={classes.alert} severity="error"> {delivery_timelines_error} </Alert>}

          <TextField size="small" className={classes.inputFields} id="formControl_liquidated_damages" defaultValue={liquidated_damages}
            label="Liquidated Damages *" variant="outlined" multiline
            onChange={(event) => { set_liquidated_damages(event.target.value); set_liquidated_damages_error(null); }} />
          {liquidated_damages_error && <Alert className={classes.alert} severity="error"> {liquidated_damages_error} </Alert>}

          <TextField size="small" className={classes.inputFields} id="formControl_dispatch_instruction" defaultValue={dispatch_instruction}
            label="Dispatch Instruction *" variant="outlined" multiline
            onChange={(event) => { set_dispatch_instruction(event.target.value); }} />

          <TextField size="small" className={classes.inputFields} id="formControl_test_certificates_instruction_manuals" defaultValue={test_certificates_instruction_manuals}
            label="Test Certificates/Instruction Manuals *" variant="outlined" multiline
            onChange={(event) => { set_test_certificates_instruction_manuals(event.target.value); set_test_certificates_instruction_manuals_error(null); }} />
          {test_certificates_instruction_manuals_error && <Alert className={classes.alert} severity="error"> {test_certificates_instruction_manuals_error} </Alert>}

          <TextField size="small" className={classes.inputFields} id="formControl_compliance" defaultValue={compliance}
            label="Compliance *" variant="outlined" multiline
            onChange={(event) => { set_compliance(event.target.value); }} />

          <TextField size="small" className={classes.inputFields} id="formControl_performance_bank_guarantee" defaultValue={performance_bank_guarantee}
            label="Performance Bank Guarantee *" variant="outlined" multiline
            onChange={(event) => { set_performance_bank_guarantee(event.target.value); set_performance_bank_guarantee_error(null); }} />
          {performance_bank_guarantee_error && <Alert className={classes.alert} severity="error"> {performance_bank_guarantee_error} </Alert>}

          <TextField size="small" className={classes.inputFields} id="formControl_arbitration" defaultValue={arbitration}
            label="Arbitration *" variant="outlined" multiline
            onChange={(event) => { set_arbitration(event.target.value); set_arbitration_error(null); }} />
          {arbitration_error && <Alert className={classes.alert} severity="error"> {arbitration_error} </Alert>}

          <TextField size="small" className={classes.inputFields} id="formControl_payment_terms" defaultValue={payment_terms}
            label="Payment Terms *" variant="outlined" multiline
            onChange={(event) => { set_payment_terms(event.target.value); set_payment_terms_error(null); }} />
          {payment_terms_error && <Alert className={classes.alert} severity="error"> {payment_terms_error} </Alert>}

          <TextField size="small" className={classes.inputFields} id="formControl_warranty_period" defaultValue={warranty_period}
            label="Warranty Period *" variant="outlined" multiline
            onChange={(event) => { set_warranty_period(event.target.value); set_warranty_period_error(null); }} />
          {warranty_period_error && <Alert className={classes.alert} severity="error"> {warranty_period_error} </Alert>}

          <TextField size="small" className={classes.inputFields} id="formControl_inspection_and_testing" defaultValue={inspection_and_testing}
            label="Inspection and Testing *" variant="outlined" multiline
            onChange={(event) => { set_inspection_and_testing(event.target.value); set_inspection_and_testing_error(null); }} />
          {inspection_and_testing_error && <Alert className={classes.alert} severity="error"> {inspection_and_testing_error} </Alert>}

          <TextField size="small" className={classes.inputFields} id="formControl_acceptance" defaultValue={acceptance}
            label="Acceptance *" variant="outlined" multiline
            onChange={(event) => { set_acceptance(event.target.value); set_acceptance_error(null); }} />
          {acceptance_error && <Alert className={classes.alert} severity="error"> {acceptance_error} </Alert>}

          <TextField size="small" className={classes.inputFields} id="formControl_extra1" defaultValue={extra1}
            label="" variant="outlined" multiline
            onChange={(event) => { set_extra1(event.target.value); }} />
          <TextField size="small" className={classes.inputFields} id="formControl_extra2" defaultValue={extra2}
            label="" variant="outlined" multiline
            onChange={(event) => { set_extra2(event.target.value); }} />
          <TextField size="small" className={classes.inputFields} id="formControl_extra3" defaultValue={extra3}
            label="" variant="outlined" multiline
            onChange={(event) => { set_extra3(event.target.value); }} />

          <div className={classes.submit}>
            <Button style={{ marginRight: 30 }} variant="contained" color="primary" onClick={handlePO} >Create PO</Button>
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
