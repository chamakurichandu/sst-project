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
import DetailImage from '@material-ui/icons/ArrowForward';
import Chip from '@material-ui/core/Chip';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { date } from 'joi';
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
    { id: 'transactioncode', numeric: false, disablePadding: false, label: 'Delivery Challan' },
    { id: 'indentcode', numeric: false, disablePadding: false, label: 'Indent/StockTransfer Code' },
    { id: 'esugam', numeric: false, disablePadding: false, label: 'e-sugam' },
    { id: 'esugam-date', numeric: false, disablePadding: false, label: 'e-sugam date' },
    { id: 'esugam-docs', numeric: false, disablePadding: false, label: 'e-sugam docs' },
    { id: 'projectname', numeric: false, disablePadding: false, label: 'Project Name' },
    { id: 'date', numeric: false, disablePadding: false, label: 'Date' },
    { id: 'action', numeric: false, disablePadding: false, label: 'Actions' }
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

export default function ReleasedMaterials(props) {

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
  const [allItems, set_allItems] = React.useState([]);
  const [uoms, set_uoms] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [warehouses, setWarehouses] = React.useState([]);

  const [showBackDrop, setShowBackDrop] = React.useState(false);

  const pageLimits = [10, 25, 50];
  let offset = 0;

  async function getDeliveryChallans(numberOfRows, search = "") {
    try {
      setShowBackDrop(true);
      console.log("page: ", page);
      let url = config["baseurl"] + "/api/deliverychallan/list?count=" + numberOfRows + "&warehouse=" + props.warehouse._id + "&offset=" + offset + "&search=" + search;
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log(data);
      let newRows = [];
      setTotalCount(data.totalDocs);
      const dateFns = new DateFnsUtils();
      for (let i = 0; i < data.list.length; ++i) {
        data.list[i].transaction.createddate_conv = dateFns.date(data.list[i].transaction.createdDate);
        if (data.list[i].transaction.esugam_date)
          data.list[i].transaction.esugam_date_conv = dateFns.date(data.list[i].transaction.esugam_date);
        newRows.push(createData((offset + i + 1),
          data.list[i]
        ));
      }

      console.log("newRows:", newRows);

      setRows(newRows);

      setShowBackDrop(false);

      getAllItemList();
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

    }
    catch (e) {
      setShowBackDrop(false);
      console.log("Error in getting all items");
      setErrorMessage("Error in getting all items");
      setShowError(true);
    }
  }

  useEffect(() => {
    if (props.warehouse)
      getDeliveryChallans(rowsPerPage);

  }, [props.warehouse]);

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
    getDeliveryChallans(rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    offset = 0;
    getDeliveryChallans(newRowsPerPage);
  };

  const handleAdd = () => {
    console.log("calling goto");
    props.goto("receivematerial");
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

    getDeliveryChallans(rowsPerPage, event.target.value);
  };

  const handleCloseBackDrop = () => {

  };

  const editAction = (data) => {
    console.log(data);
    props.setPO(data);
    props.goto("editPO", data);
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

  const detailAction = (data) => {

    // props.history.push("/delivary_challan_accounts");
  };

  const downloadAction = async (data) => {

    setShowBackDrop(true);

    await createPDFAndDownload(data, "Original");
    await createPDFAndDownload(data, "Transporter Copy");
    await createPDFAndDownload(data, "WH Copy");
    await createPDFAndDownload(data, "Office Copy");

    setShowBackDrop(false);
  }

  const createPDFAndDownload = async (data, title) => {

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
    const profileInfo = JSON.parse(window.localStorage.getItem("profile"));

    if (data.transaction.type === "projects") {
      console.log("data: ", data);
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
                [{ text: 'DELIVERY CHALLAN (' + title + ')', style: 'tableHeader', colSpan: 4, alignment: 'center' }, {}, {}, {}],
                // [{ text: 'M/s. Rajashree Electrical\nNo.154, Nijalingappa Layout, Davanagere - 577004\nGSTIN/UIN : 29AKTPR1041D1Z1 | Karnataka Code: 29 | projects@rajashreeelectricals.com', bold: false, fontSize: 11, style: 'tableHeader', colSpan: 4, alignment: 'center' }, {}, {}, {}],
                // [{ text: '', colSpan: 4, alignment: 'center' }, {}, {}, {}],
                [{ text: 'From:', bold: true, fontSize: 10, alignment: 'center' }, { text: data.warehouse.name + "\n" + data.warehouse.address, bold: false, fontSize: 10, alignment: 'center' }, { text: 'To:', bold: true, fontSize: 10, alignment: 'center' }, { text: data.transaction.toaddress, bold: false, fontSize: 10, alignment: 'center' }],
                [{ text: 'E-Sugam No', bold: true, fontSize: 10, alignment: 'center' }, { text: "" + data.transaction.esugam_no, bold: false, fontSize: 10, alignment: 'center' }, { text: 'E-Sugam Date', bold: true, fontSize: 10, alignment: 'center' }, { text: data.transaction.esugam_date_conv.toDateString(), bold: false, fontSize: 10, alignment: 'center' }],
                [{ text: 'Delivering stock to our working spots and these goods are not for sale', bold: false, fontSize: 10, style: 'tableHeader', colSpan: 4, alignment: 'center' }, {}, {}, {}],
                [{ text: '', colSpan: 4, alignment: 'center' }, {}, {}, {}],
                [{ text: 'DC Number:', bold: true, fontSize: 10, alignment: 'center' }, { text: data.transaction.code, bold: false, fontSize: 10, alignment: 'center' }, { text: 'DC Date:', bold: true, fontSize: 10, alignment: 'center' }, { text: data.transaction.createddate_conv.toDateString(), bold: false, fontSize: 10, alignment: 'center' }],
                [{ text: 'Vendor Name & Address:', bold: true, fontSize: 10, alignment: 'center' }, { text: data.servicevendor.name + "\n" + data.servicevendor.address, bold: false, fontSize: 10, alignment: 'center' }, { text: 'Delivery Type:', bold: true, fontSize: 10, alignment: 'center' }, { text: data.transaction.type, bold: false, fontSize: 10, alignment: 'center' }],
                [{ text: 'Vendor Contact Details:', bold: true, fontSize: 10, alignment: 'center' }, { text: data.servicevendor.contactPhone + "\n" + data.servicevendor.contactEmail, bold: false, fontSize: 10, alignment: 'center' }, { text: 'Reference No', bold: true, fontSize: 10, alignment: 'center' }, { text: data.indent.code, bold: false, fontSize: 10, alignment: 'center' }],
                [{ text: 'Vendor GST No:', bold: true, fontSize: 10, alignment: 'center' }, { text: data.servicevendor.gst, bold: false, fontSize: 10, alignment: 'center' }, { text: 'Verified By', bold: true, fontSize: 10, alignment: 'center' }, { text: profileInfo.name, bold: false, fontSize: 10, alignment: 'center' }],
                [{ text: 'Transporter:', bold: true, fontSize: 10, alignment: 'center' }, { text: data.transaction.transporter, bold: false, fontSize: 10, alignment: 'center' }, { text: 'Vehicle No:', bold: true, fontSize: 10, alignment: 'center' }, { text: data.transaction.vehicle_no, bold: false, fontSize: 10, alignment: 'center' }],
                [{ text: 'Project Code:', bold: true, fontSize: 10, alignment: 'center' }, { text: data.project.code, bold: false, fontSize: 10, alignment: 'center' }, { text: 'Project Name:', bold: true, fontSize: 10, alignment: 'center' }, { text: data.project.name, bold: false, fontSize: 10, alignment: 'center' }],

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
                [{ text: "Inpected By: \n\n", colSpan: 4, alignment: 'left' }, {}, {}, {}],
              ]
            }
          }
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
      pdfMake.createPdf(docDefinition).download(data.transaction.code + "_" + title + ".pdf");
    }
    else if (data.transaction.type === "stocktransfer") {
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
                [{ text: 'DELIVERY CHALLAN (' + title + ')', style: 'tableHeader', colSpan: 4, alignment: 'center' }, {}, {}, {}],
                // [{ text: 'M/s. Rajashree Electrical\nNo.154, Nijalingappa Layout, Davanagere - 577004\nGSTIN/UIN : 29AKTPR1041D1Z1 | Karnataka Code: 29 | projects@rajashreeelectricals.com', bold: false, fontSize: 11, style: 'tableHeader', colSpan: 4, alignment: 'center' }, {}, {}, {}],
                // [{ text: '', colSpan: 4, alignment: 'center' }, {}, {}, {}],
                [{ text: 'From:', bold: true, fontSize: 10, alignment: 'center' }, { text: data.fromwarehouse.name + "\n" + data.fromwarehouse.address, bold: false, fontSize: 10, alignment: 'center' }, { text: 'To:', bold: true, fontSize: 10, alignment: 'center' }, { text: data.towarehouse.name + "\n" + data.towarehouse.address, bold: false, fontSize: 10, alignment: 'center' }],
                [{ text: 'E-Sugam No', bold: true, fontSize: 10, alignment: 'center' }, { text: "" + data.transaction.esugam_no, bold: false, fontSize: 10, alignment: 'center' }, { text: 'E-Sugam Date', bold: true, fontSize: 10, alignment: 'center' }, { text: data.transaction.esugam_date_conv.toDateString(), bold: false, fontSize: 10, alignment: 'center' }],
                [{ text: '', colSpan: 4, alignment: 'center' }, {}, {}, {}],
                [{ text: 'DC Number:', bold: true, fontSize: 10, alignment: 'center' }, { text: data.transaction.code, bold: false, fontSize: 10, alignment: 'center' }, { text: 'DC Date:', bold: true, fontSize: 10, alignment: 'center' }, { text: data.transaction.createddate_conv.toDateString(), bold: false, fontSize: 10, alignment: 'center' }],
                [{ text: '', bold: true, fontSize: 10, alignment: 'center' }, { text: "", bold: false, fontSize: 10, alignment: 'center' }, { text: 'Delivery Type:', bold: true, fontSize: 10, alignment: 'center' }, { text: data.transaction.type, bold: false, fontSize: 10, alignment: 'center' }],
                [{ text: '', bold: true, fontSize: 10, alignment: 'center' }, { text: "", bold: false, fontSize: 10, alignment: 'center' }, { text: 'Reference No', bold: true, fontSize: 10, alignment: 'center' }, { text: data.stocktransfer.code, bold: false, fontSize: 10, alignment: 'center' }],
                [{ text: ':', bold: true, fontSize: 10, alignment: 'center' }, { text: "", bold: false, fontSize: 10, alignment: 'center' }, { text: 'Verified By', bold: true, fontSize: 10, alignment: 'center' }, { text: profileInfo.name, bold: false, fontSize: 10, alignment: 'center' }],
                [{ text: 'Transporter:', bold: true, fontSize: 10, alignment: 'center' }, { text: data.transaction.transporter, bold: false, fontSize: 10, alignment: 'center' }, { text: 'Vehicle No:', bold: true, fontSize: 10, alignment: 'center' }, { text: data.transaction.vehicle_no, bold: false, fontSize: 10, alignment: 'center' }],
                [{ text: '', bold: true, fontSize: 10, alignment: 'center' }, { text: "", bold: false, fontSize: 10, alignment: 'center' }, { text: '', bold: true, fontSize: 10, alignment: 'center' }, { text: "", bold: false, fontSize: 10, alignment: 'center' }],

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
                [{ text: "Inpected By: \n\n", colSpan: 4, alignment: 'left' }, {}, {}, {}],
              ]
            }
          }
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
      pdfMake.createPdf(docDefinition).download(data.transaction.code + "_" + title + ".pdf");
    }

  };

  const handleOpenDoc = (index, docIndex) => {
    console.log("index: ", index);
    console.log("rows[index]: ", rows[index].data.transaction.esugam_docs);

    const file = rows[index].data.transaction.esugam_docs[docIndex];
    console.log(file);
    window.open(file.path, '_blank');
  };

  return (
    <div className={clsx(classes.root)}>
      {props.warehouse &&
        <div className={classes.paper}>
          {/* <EnhancedTableToolbar title={"Released Materials"} /> */}

          <Paper className={classes.grid}>
            <Grid container spacing={2}>
              <Grid item className={classes.totalAttendes}>
                <img src={ProcurementImage} width='25' alt="" />
                <h1 className={classes.h1}>{totalCount}</h1>
                <span>{"Materials"}</span>
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
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'} >{row.data.transaction.code}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'} >{row.data.transaction.type === "projects" ? row.data.indent.code : row.data.stocktransfer.code}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'} >{row.data.transaction.esugam_no ? row.data.transaction.esugam_no : "Waiting in Accounts"}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'} >{row.data.transaction.esugam_date_conv ? row.data.transaction.esugam_date_conv.toDateString() : "Waiting in Accounts"}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'} >
                          {row.data.transaction.esugam_docs && <div>
                            {row.data.transaction.esugam_docs.map((file, index2) => {
                              return (<Chip style={{ marginTop: 5, marginRight: 5 }} key={"chip" + index2} label={file.name} clickable variant="outlined" onClick={() => handleOpenDoc(index, index2)} />);
                            })}
                          </div>
                          }
                        </TableCell>

                        <TableCell align={dir === 'rtl' ? 'right' : 'left'} >{row.data.transaction.type === "projects" ? row.data.project.code : "NA"}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'} >{row.data.transaction.createddate_conv.toDateString()}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                          <IconButton color="primary" aria-label="upload picture" size="small" onClick={() => detailAction(row.data)}>
                            <DetailImage />
                          </IconButton>
                          {row.data.transaction.esugam_no && row.data.transaction.esugam_no.length > 0 &&
                            <IconButton color="primary" aria-label="upload picture" size="small" onClick={() => downloadAction(row.data)}>
                              <GetAppImage />
                            </IconButton>
                          }
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
