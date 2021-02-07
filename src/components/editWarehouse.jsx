import React, { useEffect } from 'react';
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
import { Auth } from 'aws-amplify';
import 'date-fns';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ConfirmationDialog from './confirmationDialog';
import Warehouses from './warehouses';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Image, { Shimmer } from 'react-shimmer'
import profileLogo from '../assets/svg/ss/profile.svg';
import Grid from '@material-ui/core/Grid';

const Joi = require('joi');

function createData(slno, data) {
  return { slno, data };
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const handleRequestSort = (event, property) => {
  // const isAsc = orderBy === property && order === 'asc';
  // setOrder(isAsc ? 'desc' : 'asc');
  // setOrderBy(property);
};

const handleSelectAllClick = (event) => {
  // if (event.target.checked) {
  //   const newSelecteds = rows.map((n) => n.name);
  //   setSelected(newSelecteds);
  //   return;
  // }
  // setSelected([]);
};

function EnhancedTableHead(props) {
  const dir = document.getElementsByTagName('html')[0].getAttribute('dir');
  const setDir = (dir === 'rtl' ? true : false);

  const headCells = [
    { id: 'slno', numeric: true, disablePadding: true, label: 'SL NO' },
    { id: 'name', numeric: false, disablePadding: false, label: 'Manager Name' },
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
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

export default function EditWarehouse(props) {

  const dir = document.getElementsByTagName('html')[0].getAttribute('dir');

  const useStyles = makeStyles((theme) => ({
    root: {
      width: 'calc(100%)',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(1),
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
    h1: {
      margin: '0px',
      paddingRight: '10px',
      paddingLeft: '10px'
    },
    exhibitor_image: {
      marginRight: '10px'
    },
    flex: {
      display: 'flex',
      alignItems: 'center'
    },

  }));

  const classes = useStyles();

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);

  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const [name, set_name] = React.useState(props.selectedWarehouse.name);
  const [name_error, set_name_error] = React.useState(null);

  const [address, set_address] = React.useState(props.selectedWarehouse.address);
  const [address_error, set_address_error] = React.useState(null);

  const [city, set_city] = React.useState(props.selectedWarehouse.city);
  const [city_error, set_city_error] = React.useState(null);

  const [state, set_state] = React.useState(props.selectedWarehouse.state);
  const [state_error, set_state_error] = React.useState(null);

  const [country, set_country] = React.useState(props.selectedWarehouse.country);
  const [country_error, set_country_error] = React.useState(null);

  const [branch, set_branch] = React.useState(props.selectedWarehouse.branch);
  const [branch_error, set_branch_error] = React.useState(null);

  const [managers, set_managers] = React.useState([]);
  const [managers_error, set_managers_error] = React.useState(null);

  const [totalCount, setTotalCount] = React.useState(0);

  const [contactingServer, setContactingServer] = React.useState(false);

  const [showConfirmationDialog, setShowConfirmationDialog] = React.useState(false);

  let offset = 0;

  useEffect(() => {
    if (props.selectedWarehouse)
      getList(100);
  }, [props.selectedWarehouse]);

  async function getList(numberOfRows) {
    try {
      let url = config["baseurl"] + "/api/warehouse/managers" + "?id=" + props.selectedWarehouse._id;
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log(data);
      console.log(data.count);
      setTotalCount(data.count);
      console.log(data.list);
      let newRows = [];
      for (let i = 0; i < data.count; ++i) {
        newRows.push(createData((offset + i + 1), data.list[i]));
      }

      set_managers(newRows);
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

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowError(false);
  };

  const handleBreadCrumClick = () => {
    props.history.push("/warehouseHome");
  };

  const handleCancel = () => {
    props.history.push("/warehouseHome");
  };

  const validateData = () => {
    const schema = Joi.object({
      name: Joi.string().required(),
      address: Joi.string().min(2).max(300).required(),
      city: Joi.string().min(2).max(100).required(),
      state: Joi.string().min(2).max(100).required(),
      country: Joi.string().min(2).max(100).required(),
      branch: Joi.string().min(2).max(100).required(),
    });
    const { error } = schema.validate({
      name: name.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      country: country.trim(),
    }, { abortEarly: false });
    const allerrors = {};
    if (error) {
      for (let item of error.details)
        allerrors[item.path[0]] = item.message;
    }

    return allerrors;
  }

  const handleSave = async (e) => {
    e.preventDefault();

    set_name_error(null);
    set_address_error(null);
    set_city_error(null);
    set_state_error(null);
    set_country_error(null);

    const errors = validateData();

    let errorOccured = false;
    if (errors["name"]) {
      set_name_error(errors["name"]);
      errorOccured = true;
    }
    if (errors["address"]) {
      set_address_error(errors["address"]);
      errorOccured = true;
    }
    if (errors["city"]) {
      set_city_error(errors["city"]);
      errorOccured = true;
    }
    if (errors["state"]) {
      set_state_error(errors["state"]);
      errorOccured = true;
    }
    if (errors["country"]) {
      set_country_error(errors["country"]);
      errorOccured = true;
    }

    if (errorOccured)
      return;

    try {
      setContactingServer(true);
      const url = config["baseurl"] + "/api/user/checkauth";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      await axios.get(url);

      try {
        let url = config["baseurl"] + "/api/warehouse/update";

        let postObj = {};
        if (name !== props.selectedWarehouse.name)
          postObj["name"] = name.trim();
        if (address !== props.selectedWarehouse.address)
          postObj["address"] = address.trim();
        if (city !== props.selectedWarehouse.city)
          postObj["city"] = city.trim();
        if (state !== props.selectedWarehouse.state)
          postObj["state"] = state.trim();
        if (country !== props.selectedWarehouse.country)
          postObj["country"] = country.trim();
        if (branch !== props.selectedWarehouse.branch)
          postObj["branch"] = branch.trim();

        console.log("postObj: ", postObj);

        let updateObj = { _id: props.selectedWarehouse._id, updateParams: postObj };

        axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

        const response = await axios.patch(url, updateObj);

        console.log("successfully Saved");
        setContactingServer(false);
        props.history.push("/warehouseHome");
      }
      catch (e) {
        if (e.response) {
          console.log("Error in creating new user");
          setErrorMessage(e.response.data["message"]);
        }
        else {
          console.log("Error in creating new user");
          setErrorMessage("Error in creating new user: ", e.message);
        }
        setShowError(true);
        setContactingServer(false);
      }
    }
    catch (e) {
      console.log("Error in Auth: logout");
      setContactingServer(false);
      props.onAuthFailure();
    }
  };

  const handleDelete = async () => {
    setContactingServer(true);

    try {
      let url = config["baseurl"] + "/api/warehouse/delete";

      let postObj = {};
      postObj["_id"] = props.selectedWarehouse["_id"];
      console.log("postObj: ", postObj);

      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

      const response = await axios.post(url, postObj);

      console.log("Seleted successfully");
      setContactingServer(false);
      props.history.push("/warehouses");
    }
    catch (e) {
      if (e.response) {
        console.log("Error in creating new user");
        setErrorMessage(e.response.data["message"]);
      }
      else {
        console.log("Error in creating new user");
        setErrorMessage("Error in creating new user: ", e.message);
      }
      setShowError(true);
      setContactingServer(false);
    }
  };

  const noConfirmationDialogAction = () => {
    setShowConfirmationDialog(false);
  };

  const yesConfirmationDialogAction = () => {
    setShowConfirmationDialog(false);

    handleDelete();
  };

  const handleAdd = () => {
    props.history.push("/addmanagers");
  };

  const handleManagerDelete = async (managerData) => {
    setContactingServer(true);
    try {
      let url = config["baseurl"] + "/api/warehouse/update";

      let postObj = {};
      postObj["managers"] = [...props.selectedWarehouse.managers];
      var index = postObj["managers"].indexOf(managerData._id);
      postObj["managers"].splice(index, 1);

      console.log("postObj: ", postObj);

      let updateObj = { _id: props.selectedWarehouse._id, updateParams: postObj };

      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

      const updatedWarehouse = await axios.patch(url, updateObj);
      props.setSelectedWarehouse(updatedWarehouse.data);
      console.log("updatedWarehouse: ", updatedWarehouse);
      console.log("successfully Saved");
      setContactingServer(false);

      getList(100);
    }
    catch (e) {
      if (e.response) {
        console.log("Error in creating new user");
        setErrorMessage(e.response.data["message"]);
      }
      else {
        console.log("Error in creating new user");
        setErrorMessage("Error in creating new user: ", e.message);
      }
      setShowError(true);
      setContactingServer(false);
    }
  };

  return (
    <div className={clsx(classes.root)}>
      {props.refreshUI && props.selectedWarehouse &&

        <div className={classes.paper}>

          <EnhancedTableToolbar title={"Edit Warehouse"} />

          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" onClick={handleBreadCrumClick}>
              {props.selectedWarehouse.name}
            </Link>
            <Typography color="textPrimary">{"Edit Warehouse"}</Typography>
          </Breadcrumbs>

          {/* <Paper className={classes.grid}> */}
          <form className={classes.papernew} autoComplete="off" noValidate>
            {/* name */}
            <TextField className={classes.inputFields} id="formControl_name" defaultValue={name}
              label="Warehouse Name *" variant="outlined"
              onChange={(event) => { set_name(event.target.value); set_name_error(null); }} />
            {name_error && <Alert className={classes.alert} severity="error"> {name_error} </Alert>}

            <TextField className={classes.inputFields} id="formControl_branch" defaultValue={branch}
              label="Office Branch" variant="outlined"
              onChange={(event) => { set_branch(event.target.value); set_branch_error(null); }} />
            {branch_error && <Alert className={classes.alert} severity="error"> {branch_error} </Alert>}

            <TextField className={classes.inputFields} id="formControl_address" defaultValue={address}
              label="Warehouse Address" variant="outlined"
              onChange={(event) => { set_address(event.target.value); set_address_error(null); }} />
            {address_error && <Alert className={classes.alert} severity="error"> {address_error} </Alert>}

            <TextField className={classes.inputFields} id="formControl_city" defaultValue={city}
              label="City *" variant="outlined"
              onChange={(event) => { set_city(event.target.value); set_city_error(null); }} />
            {city_error && <Alert className={classes.alert} severity="error"> {city_error} </Alert>}

            <TextField className={classes.inputFields} id="formControl_state" defaultValue={state}
              label="State *" variant="outlined"
              onChange={(event) => { set_state(event.target.value); set_state_error(null); }} />
            {state_error && <Alert className={classes.alert} severity="error"> {state_error} </Alert>}

            <TextField className={classes.inputFields} id="formControl_country" defaultValue={country}
              label="Country *" variant="outlined"
              onChange={(event) => { set_country(event.target.value); set_country_error(null); }} />
            {country_error && <Alert className={classes.alert} severity="error"> {country_error} </Alert>}

            <div className={classes.submit}>
              <Button variant="contained" color="secondary" onClick={() => { setShowConfirmationDialog(true); }} disabled={contactingServer}>{lstrings.Delete}</Button>
              <Button style={{ marginLeft: 50 }} variant="contained" color="primary" onClick={handleCancel} disabled={contactingServer}>{lstrings.Cancel}</Button>
              <Button style={{ marginLeft: 10 }} variant="contained" color="primary" onClick={handleSave} disabled={contactingServer}>{lstrings.Save}</Button>
            </div>
          </form>
          {/* </Paper> */}

          <Paper className={classes.grid}>
            <Paper className={classes.grid}>
              <Grid container spacing={2}>
                <Grid item className={classes.totalAttendes}>
                  <img src={profileLogo} width='25' alt="" />
                  <h1 className={classes.h1}>{totalCount}</h1>
                  <span>{"Managers"}</span>
                </Grid>
                <Grid item className={classes.addButton}>
                  <Button onClick={() => handleAdd()} style={{ background: "#314293", color: "#FFFFFF" }} variant="contained" className={classes.button}>{"Add Manager"}</Button>
                </Grid>
              </Grid>
            </Paper>

            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={'small'}
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={classes}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={managers.length}
                />

                <TableBody>
                  {managers.map((row, index) => {
                    // const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={row.slno}
                      >
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'} component="th" id={labelId} scope="row" padding="none">
                          {row.slno}
                        </TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                          <div className={classes.flex}>
                            <Image
                              src={profileLogo}
                              NativeImgProps={{ className: classes.exhibitor_image, width: 40, height: 40 }}
                              style={{ objectFit: 'cover' }}
                              fallback={<Shimmer width={50} height={50} />} />

                            <span>
                              {row.data.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{row.data.email}</span><br></br><span>{row.data.email}</span></TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                          <div><Button onClick={() => handleManagerDelete(row.data)} style={{ background: "#314293", color: "#FFFFFF" }} variant="contained" className={classes.button}>{lstrings.Delete}</Button></div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          {showConfirmationDialog && <ConfirmationDialog noConfirmationDialogAction={noConfirmationDialogAction} yesConfirmationDialogAction={yesConfirmationDialogAction} message={"Do you want to delete the warehouse? Please confirm"} title={"Deleting Warehouse!"} />}
        </div>
      }
      <Snackbar open={showError} autoHideDuration={60000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </div >
  );
}
