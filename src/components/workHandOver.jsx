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
import Button from '@material-ui/core/Button';
import axios from 'axios';
import config from "../config.json";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import ProcurementImage from '../assets/svg/ss/commercial-2.svg';
import TextField from '@material-ui/core/TextField';
import AddMaterialIndent from './addMaterialIndent';

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
    { id: 'acceptance_qty', numeric: false, disablePadding: false, label: 'Acceptance Quantity' },
    { id: 'handover_qty', numeric: false, disablePadding: false, label: 'Hand Over Quantity' }
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

export default function WorkHandOver(props) {

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
  const [uoms, set_uoms] = React.useState([]);
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
      console.log('get handover materials: ', data.work.survey_materials);
      let newItems = [];
      if (data.work.survey_materials) {
        for (let i = 0; i < data.work.survey_materials.length; ++i) {
          let item = getItem(data.work.survey_materials[i].item);
          item.acceptance_qty = data.work.survey_materials[i].acceptance_qty ? parseInt(data.work.survey_materials[i].acceptance_qty) : 0;
          item.handover_qty = data.work.survey_materials[i].handover_qty ? parseInt(data.work.survey_materials[i].handover_qty) : 0;
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

  
  const getItem = (id) => {
    for (let i = 0; i < props.allItems.length; ++i) {
      if (props.allItems[i]._id === id)
        return props.allItems[i];
    }
    return null;
  };

  const set_item_qty_for = (value, index) => {
    let newItems = [...items];
    newItems[index].handover_qty = value;
    set_items(newItems);
  };

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

  const handleComplete = async () => {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/work/completestep";

      let postObj = {};
      postObj["step"] = "handover";
      for (let i = 0; i < items.length; ++i) {
        if(parseInt(items[i].acceptance_qty) !== parseInt(items[i].handover_qty)) {
          throw { message: "Acceptance qty and Handover qty should be same" };
        }
      }

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
        setErrorMessage(`Error in creating: ${e.message}`);
      }
      setShowError(true);
      setShowBackDrop(false);
    }
  };

  const handleAddMaterialIndent = () => {
    setShowAddMaterialIndent(true);
  };

  const closeAddMaterialIndentDialog = () => {
    setShowAddMaterialIndent(false);
    // getMaterialIndentList();
  };

  const handleSelectAllClick = (event) => {
    // if (event.target.checked) {
    //   const newSelecteds = rows.map((n) => n.name);
    //   setSelected(newSelecteds);
    //   return;
    // }
    // setSelected([]);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const gotoIndentDetails = () => {

  };

  const getWarehouseName = (id) => {
    for (let i = 0; i < warehouses.length; ++i) {
      if (warehouses[i]._id === id) {
        return warehouses[i].name;
      }
    }
    return "Unknown";
  };

  const getuomFor = (value) => {
    for (let i = 0; i < uoms.length; ++i) {
      if (value === uoms[i]._id)
        return uoms[i].name;
    }
    return value;
  }

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
      let url = config["baseurl"] + "/api/work/sethandovermaterials";

      let postObj = {};
      postObj["items"] = [];
      for (let i = 0; i < items.length; ++i) {
        if (parseInt(items[i].handover_qty > parseInt(items[i].acceptance_qty))) {
          setErrorMessage("handover qty cannot be greater than acceptance qty");
          setShowError(true);
          return;
        }

        postObj["items"].push({ item: items[i]._id, handover_qty: parseInt(items[i].handover_qty) });
      }

      console.log("postObj: ", postObj);
      let updateObj = { _id: props.projectWork.work._id, updateParams: postObj };
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

      const response = await axios.patch(url, updateObj);
      console.log(response);
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
              <span>{"Materials in Hand Over"}</span>
            </Grid>
            <Grid item className={classes.addButton}>
              {!editMode && <Button onClick={() => handleComplete()} style={{ background: "#314293", color: "#FFFFFF", marginLeft: 5 }} variant="contained" className={classes.button}>{"Complete Hand Over"}</Button>}
              <Button onClick={() => handleSave()} style={{ marginLeft: 10, background: "#314293", color: "#FFFFFF" }} variant="contained" className={classes.button}>{editMode ? "Save Hand Over" : "Edit Hand Over"}</Button>
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
                rowCount={items.length}
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
                        <TextField size="small" id={"formControl_testing_qty_" + index} type="number" value={row.acceptance_qty} variant="outlined" disabled />
                      </TableCell>
                      <TableCell align={dir === 'rtl' ? 'right' : 'left'} >
                        <TextField size="small" id={"formControl_handover_qty_" + index} type="number" value={row.handover_qty}
                          variant="outlined" disabled={!editMode} onChange={(event) => { set_item_qty_for(event.target.value, index) }} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>        
      </div>
      {showAddMaterialIndent && <AddMaterialIndent workData={props.workData} indents={indents} closeAction={closeAddMaterialIndentDialog} materialIndents={materialIndents} warehouses={warehouses} {...props} />}
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
