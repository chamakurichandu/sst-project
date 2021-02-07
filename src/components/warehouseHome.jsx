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
import exhibitorsLogo from '../assets/svg/ss/exhibition.svg';
import notFoundImage from '../assets/svg/ss/page-not-found.svg';
import profileLogo from '../assets/svg/ss/profile.svg';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import EnhancedTableToolbar from './enhancedToolbar';
import axios from 'axios';
import config from "../config.json";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import MentoringApplyForm from './mentoringApplyForm';
import Image, { Shimmer } from 'react-shimmer'
import { useHistory } from 'react-router-dom';
import lstrings from '../lstrings';
import WarehouseImage from '../assets/svg/ss/warehouse-2.svg';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import ReceivedMaterials from "./receivedMaterials";
import WarehouseInventory from "./warehouseInventory";
import ReleasedMaterials from './releasedMaterials';
import DeliveryChallans from './deliveryChallans';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

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
    { id: 'name', numeric: false, disablePadding: false, label: 'Warehouse Name' },
    { id: 'managers', numeric: false, disablePadding: false, label: 'Managers' },
    { id: 'city', numeric: false, disablePadding: false, label: 'city' },
    { id: 'address', numeric: false, disablePadding: false, label: 'Address' },
    { id: 'action', numeric: false, disablePadding: false, label: 'Actions' },
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

function EnhancedTableHeadMaterials(props) {
  const dir = document.getElementsByTagName('html')[0].getAttribute('dir');
  const setDir = (dir === 'rtl' ? true : false);

  const headCells = [
    { id: 'slno', numeric: true, disablePadding: true, label: 'SL' },
    { id: 'itemcode', numeric: false, disablePadding: false, label: 'Item Code' },
    { id: 'hsncode', numeric: false, disablePadding: false, label: 'HSN Code' },
    { id: 'itemname', numeric: false, disablePadding: false, label: 'Item Name' },
    { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
    { id: 'productcategory', numeric: false, disablePadding: false, label: 'Product Category' },
    { id: 'uom', numeric: false, disablePadding: false, label: 'UOM' },
    { id: 'action', numeric: false, disablePadding: false, label: 'Actions' },
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

export default function Warehouses(props) {

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
  const [managers, set_managers] = React.useState(null);
  const [value, setValue] = React.useState(-1);

  const pageLimits = [10, 25, 50];
  let offset = 0;

  async function getUsers() {
    try {
      let url = config["baseurl"] + "/api/warehouse/managers" + "?id=" + props.warehouse._id;
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      set_managers(data.list);
    }
    catch (e) {
      console.log("Error in getting users list");
      if (e.response) {
        setErrorMessage(e.response.message);
      }
      else {
        setErrorMessage("Error in getting users list");
      }
      setShowError(true);
    }
  }

  async function getList(numberOfRows) {
    try {
      let url = config["baseurl"] + "/api/warehouse/list";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      setTotalCount(data.count);
      let newRows = [];
      for (let i = 0; i < data.count; ++i) {
        console.log("getList: 1");
        newRows.push(createData((offset + i + 1),
          data.list[i]
        ));
        console.log("getList: 2");
      }

      setRows(newRows);

      getUsers();
    }
    catch (e) {
      console.log("Error in getting users list");
      setErrorMessage("Error in getting users list");
      setShowError(true);
    }
  }

  const getProductCategory = (id) => {
    for (let i = 0; i < props.productCategories.length; ++i) {
      if (props.productCategories[i]._id === id)
        return props.productCategories[i].name;
    }
    return id;
  };

  const getUOM = (id) => {
    for (let i = 0; i < props.UOMs.length; ++i) {
      if (props.UOMs[i]._id === id)
        return props.UOMs[i].name;
    }

    return id;
  };

  const onSearchChange = (event) => {
    console.log(event.target.value);

    getList(rowsPerPage, event.target.value);
  };

  useEffect(() => {
    if (props.warehouse) {
      getUsers();
      let tab = window.localStorage.getItem("warehousehometab");
      if (tab === null)
        tab = "0";

      console.log("tab: ", tab);
      setValue(parseInt(tab));
    }
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
    getList(rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    offset = 0;
    getList(newRowsPerPage);
  };

  const handleEdit = () => {
    props.history.push("/editwarehouse");
  };

  const handleAdd = () => {
    props.history.push("/addwarehouse");
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
    if (!managers)
      return "";

    let val = "";
    for (let i = 0; i < data.length; ++i) {
      if (i > 0)
        val += ", ";
      for (let k = 0; k < managers.length; ++k) {
        if (managers[k]._id === data[i]) {
          val += managers[k].name;
          break;
        }
      }
    }
    return val;
  }

  const onGoNextLevel = (data) => {

  };

  const ReceiveMaterial = () => {
    props.history.push("/warehousereceive");
  };

  const ReceivedHistory = () => {
    props.history.push("/warehousereceivedhistory");
  };

  const ReleaseMaterial = () => {
    props.history.push("/releaseindents");
  };

  const ReleaseHistory = () => {
    props.history.push("/warehousereleasedhistory");
  };

  const handleBreadCrumClick = () => {
    props.history.push("/warehouses");
  };

  const handleChange = (event, newValue) => {
    console.log(newValue);
    setValue(newValue);
    window.localStorage.setItem("warehousehometab", ("" + newValue));
  };

  const gotoFromReceivedMaterial = (target, data) => {
    switch (target) {
      case "receivematerial":
        props.history.push("/warehousereceive");
        break;
    }
  }

  const gotoFromWarehouseInventory = (target, data) => {
    switch (target) {
      // case "receivematerial":
      //   props.history.push("/warehousereceive");
      //   break;
    }
  }

  return (
    <div className={clsx(classes.root)}>
      {props.refreshUI && props.warehouse &&

        <div className={classes.paper}>
          <EnhancedTableToolbar title={props.warehouse.name} />
          {/* <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" onClick={handleBreadCrumClick}>
              {"Warehouses"}
            </Link>
            <Typography color="textPrimary">{props.warehouse.name}</Typography>
          </Breadcrumbs> */}

          <Paper className={classes.grid}>
            <TableContainer>
              <Table className={classes.table} aria-labelledby="tableTitle" size={'small'} aria-label="enhanced table">
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
                  <TableRow hover tabIndex={-1} key={"1"} >
                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                      <div className={classes.flex}>
                        <Image src={WarehouseImage} NativeImgProps={{ className: classes.exhibitor_image, width: 25, height: 25 }} style={{ objectFit: 'cover' }}
                          fallback={<Shimmer width={25} height={25} />} />
                        <span> {props.warehouse.name} </span>
                      </div>
                    </TableCell>
                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{managers ? getStringForArray(props.warehouse.managers) : ""}</span></TableCell>
                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{props.warehouse.city}</span><br></br><span>{props.warehouse.state}</span></TableCell>
                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{props.warehouse.address}</span></TableCell>
                    <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                      <div><Button onClick={() => handleEdit()} style={{ background: "#314293", color: "#FFFFFF" }} variant="contained" className={classes.button}>{lstrings.Edit}</Button></div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          {/* <Paper className={classes.grid}>
            <Button size="small" onClick={() => ReceiveMaterial()} style={{ background: "#314293", color: "#FFFFFF", marginLeft: 10 }} variant="contained" className={classes.button}>{"Receive Material"}</Button>
            <Button size="small" onClick={() => ReleaseMaterial()} style={{ background: "#314293", color: "#FFFFFF", marginLeft: 30 }} variant="contained" className={classes.button}>{"Release Material Indents"}</Button>
          </Paper> */}
          {value != -1 &&
            <Paper className={classes.grid}>
              <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                  <Tab label="Inventory" {...a11yProps(0)} />
                  <Tab label="Received Materials" {...a11yProps(1)} />
                  <Tab label="Released Materials" {...a11yProps(2)} />
                  <Tab label="Delivery Challans" {...a11yProps(3)} />
                </Tabs>
              </AppBar>
              <TabPanel value={value} index={0}>
                <WarehouseInventory goto={gotoFromWarehouseInventory} {...props} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <ReceivedMaterials goto={gotoFromReceivedMaterial} {...props} />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <ReleasedMaterials {...props} />
              </TabPanel>
              <TabPanel value={value} index={3}>
                <DeliveryChallans {...props} />
              </TabPanel>
            </Paper>
          }
        </div>
      }
      <Snackbar open={showError} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </div >
  );
}
