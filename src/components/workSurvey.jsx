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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function EnhancedTableHead(props) {
  const dir = document.getElementsByTagName('html')[0].getAttribute('dir');
  const setDir = (dir === 'rtl' ? true : false);

  const headCells = [
    { id: 'slno', numeric: true, disablePadding: true, label: 'SL' },
    { id: 'code', numeric: false, disablePadding: false, label: 'Code' },
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
    { id: 'uom', numeric: false, disablePadding: false, label: 'UOM' },
    { id: 'qty', numeric: false, disablePadding: false, label: 'Quantity' },
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

export default function WorkSurvey(props) {

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
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [supplyVendors, setSupplyVendors] = React.useState([]);
  const [uoms, set_uoms] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [warehouses, setWarehouses] = React.useState([]);

  const [showSaved, setShowSaved] = React.useState(false);

  const [showSelectItem, setShowSelectItem] = React.useState(false);

  const [work, set_work] = React.useState(null);

  const [items, set_items] = React.useState([]);
  const [items_error, set_items_error] = React.useState(null);

  const [editMode, setEditMode] = React.useState(false);

  const [showBackDrop, setShowBackDrop] = React.useState(false);

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
      if (e.response) {
        console.log("Error in getting UOMs list");
        setErrorMessage(e.response.data.message);
      }
      else {
        console.log("Error in getting UOMs list");
        setErrorMessage("Error in UOMs list");
      }
      setShowError(true);
      setShowBackDrop(false);
    }
  }

  async function getWorkDetails() {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/work/details?id=" + props.projectWork.work._id;
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

      const { data } = await axios.get(url);
      set_work(data);

      let newItems = [];
      if (data.work.survey_materials) {
        for (let i = 0; i < data.work.survey_materials.length; ++i) {
          let item = getItem(data.work.survey_materials[i].item);
          item.qty = parseInt(data.work.survey_materials[i].qty);
          newItems.push(item);
        }
      }
      set_items(newItems);

      setShowBackDrop(false);
    }
    catch (e) {
      if (e.response) {
        console.log("Error in getting work details");
        setErrorMessage(e.response.data.message);
      }
      else {
        console.log("Error in getting work details");
        setErrorMessage("Error in getting list");
      }
      setShowError(true);
      setShowBackDrop(false);
    }
  }

  useEffect(() => {
    console.log("props.workData: ", props.workData);
    getUOMList();
  }, []);

  useEffect(() => {
    if (props.allItems.length > 0)
      getWorkDetails();
  }, [props.allItems]);

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

  const handleCloseBackDrop = () => {

  };

  const getItem = (id) => {
    for (let i = 0; i < props.allItems.length; ++i) {
      if (props.allItems[i]._id === id)
        return props.allItems[i];
    }
    return null;
  };

  const handleAddMaterial = (mat) => {
    setShowSelectItem(true);
  };

  const deleteAction = (index) => {
    let newItems = [...items];
    newItems.splice(index, 1);
    set_items(newItems);
  }

  const closeSelectItemDialogAction = () => {
    setShowSelectItem(false);
  };

  const onSelectItem = (newitem) => {
    setShowSelectItem(false);

    for (let i = 0; i < items.length; ++i) {
      if (items[i]._id == newitem._id)
        return;
    }

    console.log(newitem);

    let newCopy = cloneDeep(newitem);
    newCopy.qty = 0;

    let newItems = [...items, newCopy];
    set_items(newItems);

    set_items_error(null);
  };

  const getuomFor = (value) => {
    for (let i = 0; i < uoms.length; ++i) {
      if (value === uoms[i]._id)
        return uoms[i].name;
    }
    return value;
  }

  const set_item_qty_for = (value, index) => {
    let newItems = [...items];
    newItems[index].qty = value;
    set_items(newItems);
  };

  const handleSave = async () => {
    if (!editMode) {
      setEditMode(true);
      return;
    }

    let errorOccured = false;
    for (let i = 0; i < items.length; ++i) {
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
      let url = config["baseurl"] + "/api/work/setsurveymaterials";

      let postObj = {};
      postObj["items"] = [];
      for (let i = 0; i < items.length; ++i) {
        postObj["items"].push({ item: items[i]._id, qty: parseInt(items[i].qty) });
      }

      console.log("postObj: ", postObj);
      let updateObj = { _id: props.projectWork.work._id, updateParams: postObj };

      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

      const response = await axios.patch(url, updateObj);
      console.log("successfully Saved");
      setShowBackDrop(false);
      setShowSaved(true);

      setEditMode(false);

      getWorkDetails();
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

  const handleComplete = async () => {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/work/completestep";

      let postObj = {};
      postObj["step"] = "survey";

      let updateObj = { _id: props.projectWork.work._id, updateParams: postObj };

      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

      const response = await axios.patch(url, updateObj);
      console.log("successfully Saved");
      setShowBackDrop(false);
      setShowSaved(true);

      props.goto(1);
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

  const handleCancel = () => {
    setEditMode(false);
  };

  return (
    <div className={clsx(classes.root)}>
      <div className={classes.paper}>
        <Paper className={classes.grid}>
          <Grid container spacing={2}>
            <Grid item className={classes.totalAttendes}>
              <img src={ProcurementImage} width='25' alt="" />
              <h1 className={classes.h1}>{items.length}</h1>
              <span>{"Materials from Survey"}</span>
            </Grid>
            <Grid item className={classes.addButton}>
              {editMode && <Button onClick={() => handleAddMaterial()} style={{ background: "#314293", color: "#FFFFFF" }} variant="contained" className={classes.button}>{"Add Material"}</Button>}
              <Button onClick={() => handleSave()} style={{ marginLeft: 10, background: "#314293", color: "#FFFFFF" }} variant="contained" className={classes.button}>{editMode ? "Save Survey" : "Edit Survey"}</Button>
              {editMode && <Button onClick={() => handleCancel()} style={{ marginLeft: 20, background: "#314293", color: "#FFFFFF" }} variant="contained" className={classes.button}>{"Cancel"}</Button>}
            </Grid>
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
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {items.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow hover tabIndex={-1} key={labelId}>
                      <TableCell align={dir === 'rtl' ? 'right' : 'left'} component="th" id={labelId} scope="row" padding="none">{(index + 1)}</TableCell>
                      <TableCell align={dir === 'rtl' ? 'right' : 'left'} >{row.code}</TableCell>
                      <TableCell align={dir === 'rtl' ? 'right' : 'left'} >{row.name}</TableCell>
                      <TableCell align={dir === 'rtl' ? 'right' : 'left'} >{row.description}</TableCell>
                      <TableCell align={dir === 'rtl' ? 'right' : 'left'} >{getuomFor(row.uomId)}</TableCell>
                      <TableCell align={dir === 'rtl' ? 'right' : 'left'} >
                        <TextField size="small" id={"formControl_qty_" + index} type="number" value={row.qty}
                          variant="outlined" disabled={!editMode} onChange={(event) => { set_item_qty_for(event.target.value, index) }} />
                      </TableCell>
                      <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                        {editMode &&
                          <IconButton color="primary" aria-label="delete" size="small" onClick={() => deleteAction(index)}><DeleteImage /></IconButton>
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Paper className={classes.grid}>
          <Grid container spacing={2}>
            <Grid item className={classes.totalAttendes}>
            </Grid>
            <Grid item className={classes.addButton}>
              <Button onClick={() => handleComplete()} style={{ background: "#314293", color: "#FFFFFF" }} variant="contained" className={classes.button}>{"Complete Survey"}</Button>
            </Grid>
          </Grid>
        </Paper>
      </div>

      { showSelectItem && <SelectItem closeAction={closeSelectItemDialogAction} onSelect={onSelectItem} items={props.allItems} type={"Materials"} />}

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
