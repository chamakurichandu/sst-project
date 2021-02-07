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
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import ReleaseMaterialIndent from './releaseMaterialIndent';

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
    { id: 'materialindent', numeric: false, disablePadding: false, label: 'Material Indent' },
    { id: 'projectcode', numeric: false, disablePadding: false, label: 'Project Code' },
    { id: 'projectname', numeric: false, disablePadding: false, label: 'Project Name' },
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

export default function ReleaseIndents(props) {

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
  const [totalVisited, setTotalVisited] = React.useState(0);
  const [materialIndents, setMaterialIndents] = React.useState([]);
  const [showBackDrop, setShowBackDrop] = React.useState(false);
  const [releaseMaterialIndent, showReleaseMaterialIndent] = React.useState(false);
  const [currentMaterialIndent, setCurrentMaterialIndent] = React.useState(null);

  const pageLimits = [10, 25, 50];
  let offset = 0;

  async function getMaterialIndentList() {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/materialindent/list?warehouse=" + props.warehouse._id + "&count=" + 1000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log(data);
      console.log(data.list);

      setMaterialIndents(data.list);

      setShowBackDrop(false);
    }
    catch (e) {
      console.log("Error in getting users list");
      setErrorMessage("Error in getting users list");
      setShowError(true);
      setShowBackDrop(false);
    }
  }

  useEffect(() => {
    if (props.warehouse)
      getMaterialIndentList();
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
    // getList(rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    offset = 0;
    // getList(newRowsPerPage);
  };

  const handleRelease = (data) => {
    console.log("handleRelease: ", data);

    setCurrentMaterialIndent(data);
    showReleaseMaterialIndent(true);
    // props.setSelectedUser(userdata);
    // props.history.push("/handlerele");
  };

  const handleReleaseClose = () => {
    showReleaseMaterialIndent(false);
    getMaterialIndentList();
  };

  const handleAddUser = () => {
    props.history.push("/addnewuser");
  };

  const getStringForArray = (data) => {
    let val = "";
    for (let i = 0; i < data.length; ++i) {
      if (i > 0)
        val += ", ";
      val += data[i];
    }
    return val;
  }

  const handleCloseBackDrop = () => {

  };

  const handleBreadCrumClick = (val) => {
    if (val === 1)
      props.history.push("/warehouses");
    else if (val === 2)
      props.history.push("/warehousehome");
  };

  return (
    <div className={clsx(classes.root)}>
      {props.refreshUI && props.warehouse &&

        <div className={classes.paper}>
          <EnhancedTableToolbar title={"Material Indents"} />
          {/* <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" onClick={() => handleBreadCrumClick(1)}>
              {"Warehouses"}
            </Link>
            <Link color="inherit" onClick={() => handleBreadCrumClick(2)}>
              {props.warehouse.name}
            </Link>
            <Typography color="textPrimary">{"Material Indent"}</Typography>
          </Breadcrumbs> */}

          <Paper className={classes.grid}>
            <Grid container spacing={2}>
              <Grid item className={classes.totalAttendes}>
                <img src={profileLogo} width='25' alt="" />
                <h1 className={classes.h1}>{materialIndents.length}</h1>
                <span>{"Material Indents"}</span>
              </Grid>
              {/* <Grid item className={classes.addButton}>
                <Button onClick={() => handleAddUser()} style={{ background: "#314293", color: "#FFFFFF" }} variant="contained" className={classes.button}>{lstrings.AddUser}</Button>
              </Grid> */}
            </Grid>
          </Paper>
          <Paper className={classes.grid}>
            {/* <div className={classes.search}>
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
              />
            </div> */}
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
                  {materialIndents.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={"" + (index + 1)}
                      >
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'} component="th" id={labelId} scope="row" padding="none">
                          {(index + 1)}
                        </TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{row.indent.code}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{row.project.code}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{row.project.name}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                          <div><Button onClick={() => handleRelease(row)} style={{ background: "#314293", color: "#FFFFFF" }} variant="contained" className={classes.button}>{"Release"}</Button></div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
      }
      {releaseMaterialIndent && <ReleaseMaterialIndent currentMaterialIndent={currentMaterialIndent} closeAction={handleReleaseClose} {...props} />}

      <Snackbar open={showError} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>

      <Backdrop className={classes.backdrop} open={showBackDrop} onClick={handleCloseBackDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>

    </div>
  );
}
