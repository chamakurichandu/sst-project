import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import EnhancedTableToolbar from './enhancedToolbar';
import axios from 'axios';
import config from "../config.json";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import DateFnsUtils from '@date-io/date-fns';
import ProcurementImage from '../assets/svg/ss/commercial-2.svg';
import IconButton from '@material-ui/core/IconButton';
import EditImage from '@material-ui/icons/Edit';
import GetAppImage from '@material-ui/icons/GetApp';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
    { id: 'code', numeric: false, disablePadding: false, label: 'Code' },
    { id: 'project', numeric: false, disablePadding: false, label: 'Project Name' },
    { id: 'warehouse', numeric: false, disablePadding: false, label: 'Warehouse Name' },
    { id: 'supplyvendor', numeric: false, disablePadding: false, label: 'Supply Vendor' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'createddate', numeric: false, disablePadding: false, label: 'Created Date' },
    { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' }
  ];

  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
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

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function LOI(props) {

  // console.log("props: " + props);

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
      overflow: 'hidden',
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
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
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
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [supplyVendors, setSupplyVendors] = React.useState([]);
  const [allItems, set_allItems] = React.useState([]);
  const [uoms, set_uoms] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [warehouses, setWarehouses] = React.useState([]);

  const [showBackDrop, setShowBackDrop] = React.useState(false);

  const pageLimits = [10, 25, 50];
  let offset = 0;

  async function getList(numberOfRows, search = "") {
    try {
      console.log("page: ", page);
      let url = config["baseurl"] + "/api/loi/list?count=" + numberOfRows + "&offset=" + offset + "&search=" + search;
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log(data);
      let newRows = [];
      setTotalCount(data.list.totalDocs);
      const dateFns = new DateFnsUtils();
      for (let i = 0; i < data.list.docs.length; ++i) {
        data.list.docs[i].createddate_conv = dateFns.date(data.list.docs[i].createdDate);
        newRows.push(createData((offset + i + 1),
          data.list.docs[i]
        ));
      }

      setRows(newRows);

      getAllItemList();
    }
    catch (e) {

      if (e.response) {
        setErrorMessage(e.response.data.message);
      }
      else {
        setErrorMessage("Error in getting list");
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
      // console.log(data);

      setSupplyVendors(data.list.docs);
      setShowBackDrop(false);

      getList(rowsPerPage);
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

  async function getAllItemList() {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/material/list?count=" + 10000 + "&offset=" + 0 + "&search=";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      // console.log(data);

      set_allItems(data.list.docs);
      setShowBackDrop(false);

      getUOMList();
    }
    catch (e) {
      setShowBackDrop(false);
      console.log("Error in getting all items");
      setErrorMessage("Error in getting all items");
      setShowError(true);
    }
  }

  async function getUOMList() {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/uom/list?count=" + 10000 + "&offset=" + 0 + "&search=";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log("uoms: ", data);

      set_uoms(data.list);
      setShowBackDrop(false);

      getProjectList();
      // getWarehouseList();
    }
    catch (e) {
      setShowBackDrop(false);
      console.log("Error in getting all items");
      setErrorMessage("Error in getting all items");
      setShowError(true);
    }
  }

  async function getProjectList() {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/project/list?count=" + 1000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      // console.log(data);
      setProjects(data.list.docs);
      setShowBackDrop(false);

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

  useEffect(() => {
    getSupplyVendorList();

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
    getList(rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    offset = 0;
    getList(newRowsPerPage);
  };

  const handleAdd = () => {
    console.log("calling goto");
    props.history.push("/add-loi");
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

  const onSearchChange = (event) => {
    console.log(event.target.value);

    getList(rowsPerPage, event.target.value);
  };

  const handleCloseBackDrop = () => {

  };

  const getSupplyVendorName = (id) => {
    for (let i = 0; i < supplyVendors.length; ++i) {
      if (supplyVendors[i]._id === id)
        return supplyVendors[i].name;
    }
    return id;
  };

  const getSupplyVendor = (id) => {
    for (let i = 0; i < supplyVendors.length; ++i) {
      if (supplyVendors[i]._id === id)
        return supplyVendors[i];
    }
    return null;
  };

  const editAction = (data) => {
    console.log(data);
    props.setLoi(data);
    props.history.push("/edit-loi");
  };

  const getItem = (id) => {
    for (let i = 0; i < allItems.length; ++i) {
      if (allItems[i]._id === id)
        return allItems[i];
    }
    return null;
  };

  const getBase64ImageFromURL = (url) => {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  };

  const getUOMName = (id) => {
    for (let i = 0; i < uoms.length; ++i) {
      if (uoms[i]._id === id) {
        return uoms[i].name;
      }
    }

    return id;
  };

  const getProjectName = (id) => {
    for (let i = 0; i < projects.length; ++i) {
      if (projects[i]._id === id)
        return projects[i].name;
    }
  };

  const getWarehouseName = (id) => {
    for (let i = 0; i < warehouses.length; ++i) {
      if (warehouses[i]._id === id)
        return warehouses[i].name;
    }
  };

  const getWarehouseAddress = (id) => {
    for (let i = 0; i < warehouses.length; ++i) {
      if (warehouses[i]._id === id)
        return warehouses[i].address;
    }
  };

  const downloadAction = async (data) => {
    let supplyVendor = getSupplyVendor(data.supply_vendor);
    let enqItems = [];
    enqItems.push([{ text: 'S.No.', style: 'tableHeader', fontSize: 10 }, { text: 'HSN Code', style: 'tableHeader', fontSize: 10 }, { text: 'Material Description', style: 'tableHeader', fontSize: 10 }, { text: 'UOM', style: 'tableHeader', fontSize: 10 }, { text: 'Scheduled Date', style: 'tableHeader', fontSize: 10 }, { text: 'Qty', style: 'tableHeader', fontSize: 10 }, { text: 'Rate', style: 'tableHeader', fontSize: 10 }, { text: 'Amount(Rs)', style: 'tableHeader', fontSize: 10 }]);
    let numberFormatter = new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 });
    let totalAmount = 0;
    data.items.forEach(function (item, index) {
      let completeItem = getItem(item.item);
      const dateFns = new DateFnsUtils();
      if (!completeItem.hsncode)
        completeItem.hsncode = " ";
      completeItem.scheduled_date_conv = dateFns.date(item.scheduled_date);
      completeItem.total = item.qty * item.rate;
      totalAmount += completeItem.total;
      enqItems.push(["" + (index + 1), completeItem.hsncode, completeItem.description, getUOMName(completeItem.uomId), completeItem.scheduled_date_conv.toDateString(), { text: numberFormatter.format(item.qty), fontSize: 10, alignment: 'right' }, { text: "" + numberFormatter.format(item.rate), fontSize: 10, alignment: 'right' }, { text: numberFormatter.format(completeItem.total), fontSize: 10, alignment: 'right' }]);
    });
    enqItems.push([{}, {}, {}, {}, {}, {}, {}, {}]);
    enqItems.push([{}, {}, {}, {}, {}, {}, { text: "Total:", bold: true }, { text: "" + numberFormatter.format(totalAmount), bold: true, alignment: 'right' }]);

    var docDefinition = {
      pageMargins: [40, 140, 40, 60],
      header: { image: await getBase64ImageFromURL("https://demossga.s3.ap-south-1.amazonaws.com/temp/RajashreeElectricalsHeader.png"), width: 594, height: 130, alignment: "center" },
      content: [
        {
          style: 'tableExample',
          color: '#444',
          table: {
            widths: ["*", "*", "*", "*"],
            headerRows: 1,
            // keepWithHeaderRows: 1,
            body: [
              [{ text: 'LETTER OF INTENT', style: 'tableHeader', colSpan: 4, alignment: 'center' }, {}, {}, {}],
              [{ text: 'M/s. Rajashree Electrical\nNo.154, Nijalingappa Layout, Davanagere - 577004\nGSTIN/UIN : 29AKTPR1041D1Z1 | Karnataka Code: 29 | projects@rajashreeelectricals.com', bold: false, fontSize: 11, style: 'tableHeader', colSpan: 4, alignment: 'center' }, {}, {}, {}],
              [{ text: '', colSpan: 4, alignment: 'center' }, {}, {}, {}],
              [{ text: 'LOI Number:', bold: true, fontSize: 10, alignment: 'center' }, { text: data.code, bold: false, fontSize: 10, alignment: 'center' }, { text: 'Reference Number:', bold: true, fontSize: 10, alignment: 'center' }, { text: data.reference_number, bold: false, fontSize: 10, alignment: 'center' }],
              [{ text: 'Date:', bold: true, fontSize: 10, alignment: 'center' }, { text: data.createddate_conv.toDateString(), bold: false, fontSize: 10, alignment: 'center' }, { text: 'Delivery Location:', bold: true, fontSize: 10, alignment: 'center' }, { text: getWarehouseName(data.warehouse), bold: false, fontSize: 10, alignment: 'center' }],
              [{ text: 'Project:', bold: true, fontSize: 10, alignment: 'center' }, { text: getProjectName(data.project), bold: false, fontSize: 10, alignment: 'center' }, { text: "Delivery Date:", bold: true, fontSize: 10, alignment: 'center' }, { text: 'As Scheduled', bold: false, fontSize: 10, alignment: 'center' }],
              [{ text: '', colSpan: 4, alignment: 'center' }, {}, {}, {}],
              [{ text: "SUPPLIER:\nName: " + supplyVendor.name + "\nAddress: " + supplyVendor.address + "\nEmail: " + supplyVendor.contactEmail + "\n\nKind Attention: " + supplyVendor.contactName + "\nContact Number: " + supplyVendor.contactPhone + "\nGSTIN: " + supplyVendor.gst, colSpan: 2, fontSize: 10, alignment: 'left' },
              {}, { text: "BILL TO:\nName: M/s Rajashree Electricals,\nAddress: No.154, Nijalingappa Layout, Davanagere-577004\nEmail: projects@rajashreeelectricals.com\nGSTIN: 29AKTPR1041D1Z1\n\nSHIP TO:\nName: " + getWarehouseName(data.warehouse) + "\nAddress:" + getWarehouseAddress(data.warehouse), colSpan: 2, fontSize: 10, alignment: 'left' }, {}],
              [{ text: '', colSpan: 4, alignment: 'center' }, {}, {}, {}],
              [
                {
                  table: {
                    widths: [25, 30, "*", 30, 45, 30, 60, 70],
                    headerRows: 1,
                    body: enqItems
                  },
                  colSpan: 4
                },
                {}, {}, {}
              ],
              [{ text: "" + data.key_remark, colSpan: 4, alignment: 'left' }, {}, {}, {}],
            ]
          }
        },
        { text: '\n' },
        { text: 'TERMS & CONDITIONS', bold: true, fontSize: 11 },
        { text: '\n' },
        { text: '1. Scope of supply', bold: true },
        { text: data.scope_of_supply, bold: false },
        { text: '\n' },
        { text: '2. Price Escalation', bold: true },
        { text: data.price_escalation, bold: false },
        { text: '\n' },
        { text: '3. Warranty Period', bold: true },
        { text: data.warranty_period, bold: false },
        { text: '\n' },
        { text: '4. Commencement Date', bold: true },
        { text: data.commencement_date, bold: false },
        { text: '\n' },
        { text: '5. Delivery Timelines', bold: true },
        { text: data.delivery_timelines, bold: false },
        { text: '\n' },
        { text: '6. Liquidated Damages', bold: true },
        { text: data.liquidated_damages, bold: false },
        { text: '\n' },
        { text: '7. Performance Bank Guarantee', bold: true },
        { text: data.performance_bank_guarantee, bold: false },
        { text: '\n' },
        { text: '8. Arbitration', bold: true },
        { text: data.arbitration, bold: false },
        { text: '\n' },
        { text: '9. Inspection and Testing', bold: true },
        { text: data.inspection_and_testing, bold: false },
        { text: '\n' },
        { text: '10. Test Certificates/Instruction Manuals', bold: true },
        { text: data.test_certificates_instruction_manuals, bold: false },
        { text: '\n' },
        { text: '11. Taxes & Duties', bold: true },
        { text: data.taxes_and_duties, bold: false },
        { text: '\n' },
        { text: '12. Acceptance', bold: true },
        { text: data.acceptance, bold: false },
        { text: '\n' },
        { text: '13. Freight & lnsurance', bold: true },
        { text: data.frieght_and_insurance, bold: false },
        { text: '\n' },
        { text: '14. Payment Terms', bold: true },
        { text: data.payment_terms, bold: false },
        { text: '\n' },
        { text: data.extra1 ? data.extra1 : "", bold: false },
        { text: '\n' },
        { text: data.extra2 ? data.extra2 : "", bold: false },
        { text: '\n' },
        { text: data.extra3 ? data.extra3 : "", bold: false },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      },
      defaultStyle: {
        fontSize: 10
        // alignment: 'justify'
      }
    };
    pdfMake.createPdf(docDefinition).download(data.code + ".pdf");
  };

  return (
    <div className={clsx(classes.root)}>
      <div className={classes.paper}>
        <EnhancedTableToolbar title={"Letter Of Intents"} />
        <Paper className={classes.grid}>
          <Grid container spacing={2}>
            <Grid item className={classes.totalAttendes}>
              <img src={ProcurementImage} width='25' alt="" />
              <h1 className={classes.h1}>{totalCount}</h1>
              <span>{"LOIs"}</span>
            </Grid>
            <Grid item className={classes.addButton}>
              <Button onClick={() => handleAdd()} style={{ background: "#314293", color: "#FFFFFF" }} variant="contained" className={classes.button}>{"Add LOI"}</Button>
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
                {rows.map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow hover tabIndex={-1} key={row.slno}>
                      <TableCell align={dir === 'rtl' ? 'right' : 'left'} component="th" id={labelId} scope="row" padding="none">{row.slno}</TableCell>
                      <TableCell align={dir === 'rtl' ? 'right' : 'left'} >{row.data.code}</TableCell>
                      <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{getProjectName(row.data.project)}</span></TableCell>
                      <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{getWarehouseName(row.data.warehouse)}</span></TableCell>
                      <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{getSupplyVendorName(row.data.supply_vendor)}</span></TableCell>
                      <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{row.data.status}</span></TableCell>
                      <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{row.data.createddate_conv.toDateString()}</span></TableCell>
                      <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                        <IconButton color="primary" aria-label="upload picture" size="small" onClick={() => editAction(row.data)}>
                          <EditImage />
                        </IconButton>
                        <IconButton color="primary" aria-label="upload picture" size="small" onClick={() => downloadAction(row.data)}>
                          <GetAppImage />
                        </IconButton>
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
      <Snackbar open={showError} autoHideDuration={6000} onClose={handleClose}>
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
