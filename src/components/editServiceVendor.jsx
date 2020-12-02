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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const Joi = require('joi');

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function EditServiceVendor(props) {

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
    formControl: {
      marginTop: theme.spacing(1),
      minWidth: 120,
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

  const [code, set_code] = React.useState(props.selectedServiceVendor.code);

  const [name, set_name] = React.useState(props.selectedServiceVendor.name);
  const [name_error, set_name_error] = React.useState(null);

  const [website, set_website] = React.useState(props.selectedServiceVendor.website);
  const [website_error, set_website_error] = React.useState(null);

  const [address, set_address] = React.useState(props.selectedServiceVendor.address);
  const [address_error, set_address_error] = React.useState(null);

  const [billingAddress, set_billingAddress] = React.useState(props.selectedServiceVendor.billingAddress);
  const [billingAddress_error, set_billingAddress_error] = React.useState(null);

  const [officePhone, set_officePhone] = React.useState(props.selectedServiceVendor.officePhone);
  const [officePhone_error, set_officePhone_error] = React.useState(null);

  const [contactName, set_contactName] = React.useState(props.selectedServiceVendor.contactName);
  const [contactName_error, set_contactName_error] = React.useState(null);

  const [contactEmail, set_contactEmail] = React.useState(props.selectedServiceVendor.contactEmail);
  const [contactEmail_error, set_contactEmail_error] = React.useState(null);

  const [contactPhone, set_contactPhone] = React.useState(props.selectedServiceVendor.contactPhone);
  const [contactPhone_error, set_contactPhone_error] = React.useState(null);

  const [city, set_city] = React.useState(props.selectedServiceVendor.city);
  const [city_error, set_city_error] = React.useState(null);

  const [district, set_district] = React.useState(props.selectedServiceVendor.district);
  const [district_error, set_district_error] = React.useState(null);

  const [state, set_state] = React.useState(props.selectedServiceVendor.state);
  const [state_error, set_state_error] = React.useState(null);

  const [country, set_country] = React.useState(props.selectedServiceVendor.country);
  const [country_error, set_country_error] = React.useState(null);

  const [latlong, set_latlong] = React.useState(props.selectedServiceVendor.latlong);
  const [latlong_error, set_latlong_error] = React.useState(null);

  const [contactingServer, setContactingServer] = React.useState(false);

  const [showConfirmationDialog, setShowConfirmationDialog] = React.useState(false);

  useEffect(() => {
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowError(false);
  };

  const handleBreadCrumUsersClick = () => {
    props.history.push("/servicevendors");
  };

  const handleCancel = () => {
    props.history.push("/servicevendors");
  };

  const validateData = () => {
    const schema = Joi.object({
      name: Joi.string().min(2).max(400).required(),
      website: Joi.string().min(2).max(500).required(),
      address: Joi.string().min(0).max(1024).required(),
      billingAddress: Joi.string().min(0).max(1024).required(),
      officePhone: Joi.string().min(2).max(500).required(),
      contactName: Joi.string().min(2).max(500).required(),
      contactEmail: Joi.string().required().email({ tlds: { allow: false } }),
      contactPhone: Joi.string().min(2).max(500).required(),
      city: Joi.string().min(2).max(500).required(),
      district: Joi.string().min(2).max(500).required(),
      state: Joi.string().min(2).max(500).required(),
      country: Joi.string().min(2).max(500).required(),
      latlong: Joi.string().min(2).max(500).required(),
    });
    const { error } = schema.validate({
      name: name.trim(),
      website: website.trim(),
      address: address.trim(),
      billingAddress: billingAddress.trim(),
      officePhone: officePhone.trim(),
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      city: city.trim(),
      district: district.trim(),
      state: state.trim(),
      country: country.trim(),
      latlong: latlong.trim(),
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
    set_website_error(null);
    set_address_error(null);
    set_billingAddress_error(null);
    set_officePhone_error(null);
    set_contactName_error(null);
    set_contactEmail_error(null);
    set_contactPhone_error(null);
    set_city_error(null);
    set_district_error(null);
    set_state_error(null);
    set_country_error(null);
    set_latlong_error(null);

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
    if (errors["billingAddress"]) {
      set_billingAddress_error(errors["billingAddress"]);
      errorOccured = true;
    }
    if (errors["officePhone"]) {
      set_officePhone_error(errors["officePhone"]);
      errorOccured = true;
    }
    if (errors["contactName"]) {
      set_contactName_error(errors["contactName"]);
      errorOccured = true;
    }
    if (errors["contactEmail"]) {
      set_contactEmail_error(errors["contactEmail"]);
      errorOccured = true;
    }
    if (errors["contactPhone"]) {
      set_contactPhone_error(errors["contactPhone"]);
      errorOccured = true;
    }
    if (errors["city"]) {
      set_city_error(errors["city"]);
      errorOccured = true;
    }
    if (errors["district"]) {
      set_district_error(errors["district"]);
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
        let url = config["baseurl"] + "/api/servicevendor/update";

        let postObj = {};
        postObj["name"] = name.trim();
        postObj["website"] = website.trim();
        postObj["address"] = address.trim();
        postObj["billingAddress"] = billingAddress.trim();
        postObj["officePhone"] = officePhone.trim();
        postObj["contactName"] = contactName.trim();
        postObj["contactEmail"] = contactEmail.trim();
        postObj["contactPhone"] = contactPhone.trim();
        postObj["city"] = city.trim();
        postObj["state"] = state.trim();
        postObj["district"] = district.trim();
        postObj["country"] = country.trim();
        postObj["latlong"] = latlong.trim();

        console.log("props.selectedServiceVendor._id: ", props.selectedServiceVendor._id);
        let updateObj = { _id: props.selectedServiceVendor._id, updateParams: postObj };

        axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

        const response = await axios.patch(url, updateObj);

        console.log("successfully Saved");
        setContactingServer(false);
        props.history.push("/servicevendors");
      }
      catch (e) {
        if (e.response) {
          console.log("Error in updating, ", e.response);
          setErrorMessage(e.response.data["message"]);
        }
        else {
          console.log("Error in updating: ", e);
          setErrorMessage("Error in updating vendor: ", e.message);
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
      let url = config["baseurl"] + "/api/servicevendor/delete";

      let postObj = {};
      postObj["_id"] = props.selectedServiceVendor["_id"];
      console.log("postObj: ", postObj);

      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

      const response = await axios.post(url, postObj);

      console.log("Seleted successfully");
      setContactingServer(false);
      props.history.push("/servicevendors");
    }
    catch (e) {
      if (e.response) {
        console.log("Error in deleting");
        setErrorMessage(e.response.data["message"]);
      }
      else {
        console.log("Error in deleting");
        setErrorMessage("Error in deleting: ", e.message);
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

  return (
    <div className={clsx(classes.root)}>
      {props.refreshUI &&

        <div className={classes.paper}>

          <EnhancedTableToolbar title={lstrings.EditServiceVendor} />

          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" onClick={handleBreadCrumUsersClick}>
              {lstrings.ServiceVendors}
            </Link>
            <Typography color="textPrimary">{lstrings.EditServiceVendor}</Typography>
          </Breadcrumbs>

          {/* <Paper className={classes.grid}> */}
          <form className={classes.papernew} autoComplete="off" noValidate>
            <TextField className={classes.inputFields} id="formControl_code" defaultValue={code}
              label="Description *" variant="outlined" disabled />

            {/* name */}
            <TextField className={classes.inputFields} id="formControl_name" defaultValue={name}
              label="Vendor Name *" variant="outlined"
              onChange={(event) => { set_name(event.target.value); set_name_error(null); }} />
            {name_error && <Alert className={classes.alert} severity="error"> {name_error} </Alert>}

            <TextField className={classes.inputFields} id="formControl_website" defaultValue={website}
              label="Website" variant="outlined"
              onChange={(event) => { set_website(event.target.value); set_website_error(null); }} />
            {website_error && <Alert className={classes.alert} severity="error"> {website_error} </Alert>}

            <TextField className={classes.inputFields} id="formControl_address" defaultValue={address}
              label="Address *" variant="outlined"
              onChange={(event) => { set_address(event.target.value); set_address_error(null); }} />
            {address_error && <Alert className={classes.alert} severity="error"> {address_error} </Alert>}

            <TextField className={classes.inputFields} id="formControl_billingAddress" defaultValue={billingAddress}
              label="Billing Address *" variant="outlined"
              onChange={(event) => { set_billingAddress(event.target.value); set_billingAddress_error(null); }} />
            {billingAddress_error && <Alert className={classes.alert} severity="error"> {billingAddress_error} </Alert>}

            <TextField className={classes.inputFields} id="formControl_officePhone" defaultValue={officePhone}
              label="Office Phone *" variant="outlined"
              onChange={(event) => { set_officePhone(event.target.value); set_officePhone_error(null); }} />
            {officePhone_error && <Alert className={classes.alert} severity="error"> {officePhone_error} </Alert>}

            <TextField className={classes.inputFields} id="formControl_contactName" defaultValue={contactName}
              label="Contact Name *" variant="outlined"
              onChange={(event) => { set_contactName(event.target.value); set_contactName_error(null); }} />
            {contactName_error && <Alert className={classes.alert} severity="error"> {contactName_error} </Alert>}

            <TextField className={classes.inputFields} id="formControl_contactEmail" defaultValue={contactEmail}
              label="Contact Email *" variant="outlined"
              onChange={(event) => { set_contactEmail(event.target.value); set_contactEmail_error(null); }} />
            {contactEmail_error && <Alert className={classes.alert} severity="error"> {contactEmail_error} </Alert>}

            <TextField className={classes.inputFields} id="formControl_contactPhone" defaultValue={contactPhone}
              label="Contact Phone *" variant="outlined"
              onChange={(event) => { set_contactPhone(event.target.value); set_contactPhone_error(null); }} />
            {contactPhone_error && <Alert className={classes.alert} severity="error"> {contactPhone_error} </Alert>}

            <TextField className={classes.inputFields} id="formControl_city" defaultValue={city}
              label="City *" variant="outlined"
              onChange={(event) => { set_city(event.target.value); set_city_error(null); }} />
            {city_error && <Alert className={classes.alert} severity="error"> {city_error} </Alert>}

            <TextField className={classes.inputFields} id="formControl_district" defaultValue={district}
              label="District *" variant="outlined"
              onChange={(event) => { set_district(event.target.value); set_district_error(null); }} />
            {district_error && <Alert className={classes.alert} severity="error"> {district_error} </Alert>}

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
          {showConfirmationDialog && <ConfirmationDialog noConfirmationDialogAction={noConfirmationDialogAction} yesConfirmationDialogAction={yesConfirmationDialogAction} message={lstrings.DeletingUserConfirmationMessage} title={lstrings.DeletingUser} />}
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
