import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import config from "../config.json";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import ProcurementImage from '../assets/svg/ss/commercial-2.svg';
import IconButton from '@material-ui/core/IconButton';
import DeleteImage from '@material-ui/icons/Delete';
import SelectItem from './selectItem';
import cloneDeep from 'lodash/cloneDeep';
import TextField from '@material-ui/core/TextField';
import AddMaterialIndent from './addMaterialIndent';
import MaterialIndentImage from '@material-ui/icons/Assignment';
import DetailImage from '@material-ui/icons/ArrowForward';
import TablePagination from '@material-ui/core/TablePagination';
import EnhancedTableToolbar from './enhancedToolbar';
import DateFnsUtils from '@date-io/date-fns';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function EnhancedTableHead(props) {
  const dir = document.getElementsByTagName('html')[0].getAttribute('dir');
  const setDir = (dir === 'rtl' ? true : false);

  const headCells = [
    { id: 'slno', numeric: true, disablePadding: true, label: 'SL' },
    { id: 'code', numeric: false, disablePadding: false, label: 'Code' },
    { id: 'warehouse', numeric: false, disablePadding: false, label: 'Warehouse' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'date', numeric: false, disablePadding: false, label: 'Date' },
    { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' }
  ];

  const { classes, order, orderBy, numSelected, rowCount, onRequestSort } = props;
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
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function MaterialIndents(props) {

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
  const [indents, setIndents] = React.useState([]);
  const [showSaved, setShowSaved] = React.useState(false);
  const [showAddMaterialIndent, setShowAddMaterialIndent] = React.useState(false);
  const [materialIndents, setMaterialIndents] = React.useState([]);
  const [warehouses, setWarehouses] = React.useState([]);
  const [showBackDrop, setShowBackDrop] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const pageLimits = [10, 25, 50];
  let offset = 0;

  async function getMaterialIndentList(numberOfRows, search = "") {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/materialindent/list?project=" + props.project._id + "&showall=1&count=" + numberOfRows + "&offset=" + offset + "&search=" + search;
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log(data);
      // console.log(data.list);
      let newRows = [];
      const dateFns = new DateFnsUtils();
      for (let i = 0; i < data.list.length; ++i) {
        data.list[i].createdDate_conv = dateFns.date(data.list[i].indent.createdDate);
        newRows.push(data.list[i]);
      }

      setTotalCount(data.totalDocs);
      setMaterialIndents(newRows);

      setShowBackDrop(false);
    }
    catch (e) {
      console.log("Error in getting users list");
      setErrorMessage("Error in getting users list");
      setShowError(true);
      setShowBackDrop(false);
    }
  }

  async function getWarehouseList() {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/warehouse/list";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log(data);
      console.log(data.count);
      console.log(data.list);

      setWarehouses(data.list);

      setShowBackDrop(false);

      getMaterialIndentList(rowsPerPage);
    }
    catch (e) {
      console.log("Error in getting users list");
      setErrorMessage("Error in getting users list");
      setShowError(true);
      setShowBackDrop(false);
    }
  }

  useEffect(() => {
if(props.project)
    getWarehouseList();

  }, [props.project]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowError(false);
  };

  const handleSavedClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSaved(false);
  };

  const handleCloseBackDrop = () => {

  };

  const handleAddMaterialIndent = () => {
    setShowAddMaterialIndent(true);
  };

  const closeAddMaterialIndentDialog = () => {
    setShowAddMaterialIndent(false);
    getMaterialIndentList(rowsPerPage);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    offset = newPage * rowsPerPage;
    setPage(newPage);
    getMaterialIndentList(rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    offset = 0;
    getMaterialIndentList(newRowsPerPage);
  };

  const gotoIndentDetails = (row) => {
    console.log(row);
    props.setMaterialIndentsDetails(row);
    props.history.push("/materialIndentsDetails");
  };

  const getWarehouseName = (id) => {
    for (let i = 0; i < warehouses.length; ++i) {
      if (warehouses[i]._id === id) {
        return warehouses[i].name;
      }
    }
    return "Unknown";
  };

  return (
    <div className={clsx(classes.root)}>
      <div className={classes.paper}>
        <EnhancedTableToolbar title={"Material Indents"} />

        <Paper className={classes.grid}>
          <Grid container spacing={2}>
            <Grid item className={classes.totalAttendes}>
              <MaterialIndentImage />
              {/* <img src={MaterialIndentImage} width='25' alt="" /> */}
              <h1 className={classes.h1}>{totalCount}</h1>
              <span>{"Material Indents"}</span>
            </Grid>
            {/* <Grid item className={classes.addButton}>
              <Button onClick={() => handleAddMaterialIndent()} style={{ background: "#314293", color: "#FFFFFF" }} variant="contained" className={classes.button}>{"Add Material Indent"}</Button>
            </Grid> */}
          </Grid>
        </Paper>

        <Paper className={classes.grid}>
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
                onRequestSort={handleRequestSort}
                rowCount={materialIndents.length}
              />

              <TableBody size="small">
                {materialIndents.map((row, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={"" + index} size="small" >
                      <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + ((page * rowsPerPage) + index + 1)}</TableCell>
                      <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + row.indent.code}</TableCell>
                      <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + getWarehouseName(row.indent.warehouse)}</TableCell>
                      <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + ((parseInt(row.indent.dispatched) === 1) ? "Released" : "Pending")}</TableCell>
                      <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + row.createdDate_conv.toDateString() + ", " + row.createdDate_conv.toLocaleTimeString('en-US', { hour12: false })}</TableCell>
                      <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                        <IconButton color="primary" aria-label="upload picture" size="small" onClick={() => gotoIndentDetails(row)}>
                          <DetailImage />
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

      <Snackbar open={showSaved} autoHideDuration={6000} onClose={handleSavedClose}>
        <Alert onClose={handleSavedClose} severity="success">Successfully saved!</Alert>
      </Snackbar>

      <Backdrop className={classes.backdrop} open={showBackDrop} onClick={handleCloseBackDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>

    </div >
  );
}
