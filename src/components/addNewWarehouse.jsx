import React from 'react';
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

const Joi = require('joi');

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function AddNewWarehouse(props) {

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
    papernew: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      outline: 'none',
      padding: '10px 20px',
      width: '100%',
      borderRadius: '10px',
      overflow: 'auto',
      depth: 3,
      margin: '5px',
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
  }));

  const classes = useStyles();
  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const [name, set_name] = React.useState('');
  const [name_error, set_name_error] = React.useState(null);

  const [address, set_address] = React.useState('');
  const [address_error, set_address_error] = React.useState(null);

  const [city, set_city] = React.useState('');
  const [city_error, set_city_error] = React.useState(null);

  const [state, set_state] = React.useState('');
  const [state_error, set_state_error] = React.useState(null);

  const [country, set_country] = React.useState('');
  const [country_error, set_country_error] = React.useState(null);

  const [branch, set_branch] = React.useState('');
  const [branch_error, set_branch_error] = React.useState(null);

  const [contactingServer, setContactingServer] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowError(false);
  };

  const handleBreadCrumClick = () => {
    props.history.push("/warehouses");
  };

  const handleCancel = () => {
    props.history.push("/warehouses");
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
      let url = config["baseurl"] + "/api/warehouse/add";

      let postObj = {};
      postObj["name"] = name.trim();
      postObj["address"] = address.trim();
      postObj["city"] = city.trim();
      postObj["state"] = state.trim();
      postObj["country"] = country.trim();
      postObj["branch"] = branch.trim();

      console.log("postObj: ", postObj);

      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

      const response = await axios.post(url, postObj);

      console.log("successfully Saved");
      setContactingServer(false);
      props.history.push("/warehouses");
    }
    catch (e) {
      if (e.response) {
        console.log("Error in creating warehouse");
        setErrorMessage(e.response.data["message"]);
      }
      else {
        console.log("Error in creating warehouse");
        setErrorMessage("Error in creating warehouse: ", e.message);
      }
      setShowError(true);
      setContactingServer(false);
    }
  };

  return (
    <div className={clsx(classes.root)}>
      {props.refreshUI &&

        <div className={classes.paper}>

          <EnhancedTableToolbar title={"Add Warehouse"} />

          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" onClick={handleBreadCrumClick}>
              {lstrings.Warehouses}
            </Link>
            <Typography color="textPrimary">{"Add Warehouse"}</Typography>
          </Breadcrumbs>

          <Paper className={classes.grid}>
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
                label="Warehouse Address *" variant="outlined"
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
                <Button variant="contained" color="primary" onClick={handleCancel} disabled={contactingServer}>Cancel</Button>
                <Button style={{ marginLeft: 10 }} variant="contained" color="primary" onClick={handleSave} disabled={contactingServer}>Save</Button>
              </div>
            </form>
          </Paper>
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
