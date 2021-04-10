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
    { id: 'type', numeric: false, disablePadding: false, label: 'Type' },
    { id: 'po_code', numeric: false, disablePadding: false, label: 'PO Code' },
    { id: 'bill_num', numeric: false, disablePadding: false, label: 'Bill Number' },
    { id: 'bill_date', numeric: false, disablePadding: false, label: 'Bill Date' },
    { id: 'project_id', numeric: false, disablePadding: false, label: 'Project Id' },
    { id: 'project_name', numeric: false, disablePadding: false, label: 'Project Name' },
    // { id: 'project_date', numeric: false, disablePadding: false, label: 'Project Date' },
    { id: 'supplyvendor', numeric: false, disablePadding: false, label: 'Supply Vendor' },
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

export default function ReceivedMaterials(props) {

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

  async function getReceivedMaterials(numberOfRows, search = "") {
    try {
      setShowBackDrop(true);
      console.log("page: ", page);
      let url = config["baseurl"] + "/api/materialreceivetransaction/list?count=" + numberOfRows + "&warehouse=" + props.warehouse._id + "&offset=" + offset + "&search=" + search;
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log(data);
      let newRows = [];
      setTotalCount(data.totalDocs);
      const dateFns = new DateFnsUtils();
      for (let i = 0; i < data.list.length; ++i) {
        data.list[i].createddate_conv = dateFns.date(data.list[i].transaction.createdDate);
        // data.list[i].project.createddate_conv = dateFns.date(data.list[i].project.createdDate);
        data.list[i].transaction.bill_date_conv = dateFns.date(data.list[i].transaction.bill_date);

        newRows.push(createData((offset + i + 1),
          data.list[i]
        ));
      }

      setRows(newRows);
      setShowBackDrop(false);
    }
    catch (e) {

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

  useEffect(() => {
    if (props.warehouse)
      getReceivedMaterials(rowsPerPage);

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
    getReceivedMaterials(rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    offset = 0;
    getReceivedMaterials(newRowsPerPage);
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

    getReceivedMaterials(rowsPerPage, event.target.value);
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
    console.log(data);
    props.setWarehouseReceiveTransaction(data);
    props.history.push("/warehousereceivedetails");
  };

  const getTypeString = (type) => {
    switch (type) {
      case "po":
        return "Purchase Order";
        break;
      case "warehouse":
        return "Warehouse 2 Warehouse";
        break;
      case "local_purchase":
        return "Local Purchase";
        break;
      case "return_indent":
        return "Return Indent";
        break;
    }

    return "";
  };

  return (
    <div className={clsx(classes.root)}>
      {
        props.warehouse &&
        <div className={classes.paper}>
          {/* <EnhancedTableToolbar title={"Received Materials"} /> */}

          <Paper className={classes.grid}>
            <Grid container spacing={2}>
              <Grid item className={classes.totalAttendes}>
                <img src={ProcurementImage} width='25' alt="" />
                <h1 className={classes.h1}>{totalCount}</h1>
                <span>{"Received Materials Transactions"}</span>
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
                    const labelId = `enhanced-table-checkbox-${index}`;
                    const deleted = (row.data.transaction.deleted === 1);
                    return (
                      <TableRow hover tabIndex={-1} key={row.slno}>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'} style={{ color: deleted ? "#FE180D" : "#000000" }} component="th" id={labelId} scope="row" padding="none">{row.slno}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'} style={{ color: deleted ? "#FE180D" : "#000000" }} >{row.data.transaction.code}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'} style={{ color: deleted ? "#FE180D" : "#000000" }} >{getTypeString(row.data.transaction.type)}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'} style={{ color: deleted ? "#FE180D" : "#000000" }} >{row.data.po ? row.data.po.code : "N/A"}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'} style={{ color: deleted ? "#FE180D" : "#000000" }} >{row.data.transaction.bill_no}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'} style={{ color: deleted ? "#FE180D" : "#000000" }} >{row.data.transaction.bill_date_conv.toDateString()}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'} style={{ color: deleted ? "#FE180D" : "#000000" }} >{row.data.project.code}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'} style={{ color: deleted ? "#FE180D" : "#000000" }} >{row.data.project.name}</TableCell>
                        {/* <TableCell align={dir === 'rtl' ? 'right' : 'left'} style={{ color: deleted ? "#FE180D" : "#000000" }} >{row.data.project.createddate_conv.toDateString()}</TableCell> */}
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'} style={{ color: deleted ? "#FE180D" : "#000000" }} >{row.data.supply_vendor ? row.data.supply_vendor.name : "N/A"}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'} style={{ color: deleted ? "#FE180D" : "#000000" }} ><span>{row.data.createddate_conv.toDateString()}</span></TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                          <IconButton color="primary" aria-label="upload picture" size="small" onClick={() => detailAction(row.data)}><DetailImage /></IconButton>
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
