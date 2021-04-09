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
import DeleteIcon from '@material-ui/icons/Delete';
import EnhancedTableToolbar from './enhancedToolbar';
import axios from 'axios';
import config from "../config.json";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import lstrings from '../lstrings';
import ProjectsImage from '../assets/svg/ss/brief-2.svg';
import Link from '@material-ui/core/Link';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import DateFnsUtils from '@date-io/date-fns';
import AddDocument from './addDocument';
import AddFolder from './addFolder';
import IconButton from '@material-ui/core/IconButton';
import fileImage from '../assets/svg/ss/file.svg';
import folderImage from '../assets/svg/ss/folder.svg';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

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
    { id: 'name', numeric: false, disablePadding: false, label: 'Document Name ' },
    { id: 'remarks', numeric: false, disablePadding: false, label: 'Remark' },
    { id: 'uploadeddate', numeric: false, disablePadding: false, label: 'Uploaded Date' },
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

export default function DocumentsFolder(props) {

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
  const [showAddDocument, setShowAddDocument] = React.useState(false);
  const [showAddFolder, setShowAddFolder] = React.useState(false);

  const [showBackDrop, setShowBackDrop] = React.useState(false);

  const [currentPath, setCurrentPath] = React.useState("/" + props.type);
  const [currentPathArr, setCurrentPathArr] = React.useState([]);

  const pageLimits = [10, 25, 50];
  let offset = 0;

  async function getList(parent, numberOfRows, search = "") {
    try {
      console.log(props.project);
      let url = config["baseurl"] + "/api/document/list?project=" + props.project._id + "&count=" + numberOfRows + "&offset=" + offset + "&search=" + search + "&parent=" + parent;
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log(data);
      let newRows = [];
      setTotalCount(data.list.totalDocs);
      const dateFns = new DateFnsUtils();
      for (let i = 0; i < data.list.docs.length; ++i) {
        data.list.docs[i].createdDate_conv = dateFns.date(data.list.docs[i].createdDate);
        newRows.push(createData((offset + i + 1),
          data.list.docs[i]
        ));
      }

      setRows(newRows);
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

  async function deleteDocument(index) {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/document/delete";

      let postObj = {};
      postObj["_id"] = rows[index].data._id;

      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

      const response = await axios.post(url, postObj);

      console.log("Delete Saved");
      setShowBackDrop(false);
      getList(currentPath, rowsPerPage);
    }
    catch (e) {
      if (e.response) {
        console.log("Error in creating");
        setErrorMessage(e.response.data["message"]);
      }
      else {
        console.log("Error in creating material");
        setErrorMessage("Error in creating material: ", e.message);
      }
      setShowError(true);
      setShowBackDrop(false);
    }
  }

  useEffect(() => {
    if (!props.project)
      return;

    setRows([]);

    setPage(0);
    offset = 0;
    setPath("/" + props.type);
    getList(("/" + props.type), rowsPerPage);

    console.log(props.type);


  }, [props.type, props.project]);

  const setPath = (path) => {
    setCurrentPath(path);
    setCurrentPathArr(path.split("/"));
  }

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
    getList(currentPath, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    offset = 0;
    getList(currentPath, newRowsPerPage);
  };

  const handleEdit = (data) => {
    console.log("handleEdit: ", data);

    props.setSelectedSupplyVendor(data);
    props.history.push("/editproject");
  };

  const handleAddFile = () => {
    setShowAddDocument(true);
  };

  const handleAddFolder = () => {
    setShowAddFolder(true);
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

    getList(currentPath, rowsPerPage, event.target.value);
  };

  const onDetails = (index) => {

    console.log(rows[index].data.path);
    if (rows[index].data.type === "folder") {
      let newPath = rows[index].data.parent + "/" + rows[index].data.name
      setPath(newPath);
      getList(newPath, rowsPerPage);
    }
    else {
      window.open(rows[index].data.path, '_blank');
    }
  };

  const handleCloseBackDrop = () => {

  };

  const addDocumentCloseAction = () => {
    setShowAddDocument(false);
    setShowAddFolder(false);
  };

  const onNewDocumentSavedAction = () => {
    setShowAddDocument(false);
    getList(currentPath, rowsPerPage);
  }

  const onNewFolderSavedAction = () => {
    setShowAddFolder(false);
    getList(currentPath, rowsPerPage);
  }

  const handleBreadCrumClick = (index) => {
    console.log("currentPathArr: ", currentPathArr);
    let path = "";
    for (let i = 0; i < currentPathArr.length; ++i) {
      if (currentPathArr[i].length > 0)
        path += "/" + currentPathArr[i];

      if (i === index)
        break;
    }

    console.log("path: ", path);

    setPath(path);
    getList(path, rowsPerPage);
  }

  return (
    <div className={clsx(classes.root)}>
      {props.refreshUI && props.project &&
        <div className={classes.paper}>
          <EnhancedTableToolbar title={"Documents: " + props.project.code + ": " + props.name} />
          {/* <span>{currentPath}</span> */}

          <Breadcrumbs aria-label="breadcrumb">
            {currentPathArr.map((row, index) => {
              return <Link key={"" + index} color="inherit" style={{ cursor: 'pointer' }} onClick={() => handleBreadCrumClick(index)}>
                {row}
              </Link>
            })
            }
          </Breadcrumbs>

          <Paper className={classes.grid}>
            <Grid container spacing={2}>
              <Grid item className={classes.totalAttendes}>
                <img src={ProjectsImage} width='25' alt="" />
                <h1 className={classes.h1}>{totalCount}</h1>
                <span>{"Documents"}</span>
              </Grid>
              <Grid item className={classes.addButton}>
                <Button onClick={() => handleAddFolder()} size="small" style={{ marginRight: 10, background: "#314293", color: "#FFFFFF" }} variant="contained" className={classes.button}>{"Add Folder"}</Button>
                <Button onClick={() => handleAddFile()} size="small" style={{ background: "#314293", color: "#FFFFFF" }} variant="contained" className={classes.button}>{"Add Document"}</Button>
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
                  {stableSort(rows, getComparator(order, orderBy))
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.name);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow hover tabIndex={-1} key={row.slno}>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'} component="th" id={labelId} scope="row" padding="none">{row.slno}</TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                            <Link href="#" onClick={() => onDetails(index)} color="inherit"><div className={classes.flex}><img src={row.data.type === "file" ? fileImage : folderImage} width='25' alt="" /><span>{"  " + row.data.name}</span></div></Link>
                          </TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{row.data.remark}</span></TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{row.data.createdDate_conv.toDateString()}</span></TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                            <IconButton color="primary" aria-label="delete picture" component="span" onClick={() => deleteDocument(index)}>
                              <DeleteIcon />
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

      }

      {showAddDocument && <AddDocument closeAction={addDocumentCloseAction} onNewSaved={onNewDocumentSavedAction} parent={currentPath} {...props} />}
      {showAddFolder && <AddFolder closeAction={addDocumentCloseAction} onNewSaved={onNewFolderSavedAction} parent={currentPath} {...props} />}

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
