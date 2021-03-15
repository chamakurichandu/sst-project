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
import ConfirmationDialog from './confirmationDialog';

const Joi = require('joi');

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function EditUser(props) {

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

  const [roleState, setRoleState] = React.useState({
    admin: props.selectedUser.role.includes("admin"),
    procurement: props.selectedUser.role.includes("procurement"),
    warehouse: props.selectedUser.role.includes("warehouse"),
    projectManager: props.selectedUser.role.includes("projectManager"),
    deputyManager: props.selectedUser.role.includes("deputyManager"),
    supervisor: props.selectedUser.role.includes("supervisor"),
    usermanagement: props.selectedUser.role.includes("usermanagement"),
    subcontract: props.selectedUser.role.includes("subcontract"),
    accounts: props.selectedUser.role.includes("accounts"),
    hrnpayroll: props.selectedUser.role.includes("hrnpayroll"),
    analytics: props.selectedUser.role.includes("analytics")
  });
  const [rolestate_error, set_rolestate_error] = React.useState(null);

  const [name, set_name] = React.useState(props.selectedUser.name);
  const [name_error, set_name_error] = React.useState(null);

  const [email, set_email] = React.useState(props.selectedUser.email);
  const [email_error, set_email_error] = React.useState(null);

  const [phone, set_phone] = React.useState(props.selectedUser.phone);
  const [phone_error, set_phone_error] = React.useState(null);

  const [address, set_address] = React.useState(props.selectedUser.address);
  const [address_error, set_address_error] = React.useState(null);

  const [city, set_city] = React.useState(props.selectedUser.city);
  const [city_error, set_city_error] = React.useState(null);

  const [state, set_state] = React.useState(props.selectedUser.state);
  const [state_error, set_state_error] = React.useState(null);

  const [country, set_country] = React.useState(props.selectedUser.country);
  const [country_error, set_country_error] = React.useState(null);

  const [branch, set_branch] = React.useState(props.selectedUser.branch);
  const [branch_error, set_branch_error] = React.useState(null);

  const [employeeId, set_employeeId] = React.useState(props.selectedUser.employeeId);
  const [employeeId_error, set_employeeId_error] = React.useState(null);

  const [contactingServer, setContactingServer] = React.useState(false);

  const [showConfirmationDialog, setShowConfirmationDialog] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowError(false);
  };

  const handleBreadCrumUsersClick = () => {
    props.history.push("/users");
  };

  const handleCancel = () => {
    props.history.push("/users");
  };

  const validateData = () => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required().email({ tlds: { allow: false } }),
      password: Joi.string().min(6).max(100).required(),
      phone: Joi.string().min(5).max(15).required(),
      city: Joi.string().min(2).max(100).required(),
      state: Joi.string().min(2).max(100).required(),
      country: Joi.string().min(2).max(100).required(),
      branch: Joi.string().min(2).max(100).required(),
      employeeId: Joi.string().min(2).max(100).required(),
    });
    const { error } = schema.validate({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
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

    if (roleState.admin === false
      && roleState.procurement === false
      && roleState.warehouse === false
      && roleState.projectManager === false
      && roleState.deputyManager === false
      && roleState.supervisor === false
      && roleState.subcontract === false
      && roleState.accounts === false
      && roleState.hrnpayroll === false
      && roleState.analytics === false

    ) {
      set_rolestate_error("Atleast one role is required");
    }

    set_name_error(null);
    set_phone_error(null);
    set_city_error(null);
    set_state_error(null);
    set_country_error(null);

    const errors = validateData();

    let errorOccured = false;
    if (errors["name"]) {
      set_name_error(errors["name"]);
      errorOccured = true;
    }
    if (errors["phone"]) {
      set_phone_error(errors["phone"]);
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
        let url = config["baseurl"] + "/api/user/userupdate";

        let postObj = {};
        if (name !== props.selectedUser.name)
          postObj["name"] = name.trim();
        postObj["role"] = [];
        if (roleState.admin) postObj["role"].push("admin");
        if (roleState.procurement) postObj["role"].push("procurement");
        if (roleState.warehouse) postObj["role"].push("warehouse");
        if (roleState.projectManager) postObj["role"].push("projectManager");
        if (roleState.deputyManager) postObj["role"].push("deputyManager");
        if (roleState.supervisor) postObj["role"].push("supervisor");
        if (roleState.usermanagement) postObj["role"].push("usermanagement");
        if (roleState.subcontract) postObj["role"].push("subcontract");
        if (roleState.accounts) postObj["role"].push("accounts");
        if (roleState.hrnpayroll) postObj["role"].push("hrnpayroll");
        if (roleState.analytics) postObj["role"].push("analytics");

        if (phone !== props.selectedUser.phone)
          postObj["phone"] = phone.trim();
        if (address !== props.selectedUser.address)
          postObj["address"] = address.trim();
        if (city !== props.selectedUser.city)
          postObj["city"] = city.trim();
        if (state !== props.selectedUser.state)
          postObj["state"] = state.trim();
        if (country !== props.selectedUser.country)
          postObj["country"] = country.trim();
        if (branch !== props.selectedUser.branch)
          postObj["branch"] = branch.trim();
        if (employeeId !== props.selectedUser.employeeId)
          postObj["employeeId"] = employeeId.trim();

        console.log("postObj: ", postObj);

        let updateObj = { _id: props.selectedUser._id, updateParams: postObj };

        axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

        const response = await axios.patch(url, updateObj);

        console.log("successfully Saved");
        setContactingServer(false);
        props.history.push("/users");
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
      let url = config["baseurl"] + "/api/user/userdelete";

      let postObj = {};
      postObj["_id"] = props.selectedUser["_id"];
      console.log("postObj: ", postObj);

      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

      const response = await axios.post(url, postObj);

      console.log("Seleted successfully");
      setContactingServer(false);
      props.history.push("/users");
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

  const handleChange = (event) => {
    setRoleState({ ...roleState, [event.target.name]: event.target.checked });
    set_rolestate_error(null);
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

          <EnhancedTableToolbar title={lstrings.EditUser} />

          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" onClick={handleBreadCrumUsersClick}>
              {lstrings.Users}
            </Link>
            <Typography color="textPrimary">{lstrings.EditUser}</Typography>
          </Breadcrumbs>

          <Paper className={classes.grid}>
            <form className={classes.papernew} autoComplete="off" noValidate>
              <Paper variant="outlined">
                <span>Roles of the user</span>
                <FormGroup row style={{ marginLeft: 10 }}>
                  <FormControlLabel control={<Checkbox checked={roleState.admin} onChange={handleChange} name="admin" color="primary" />}
                    label="Admin" />
                  <FormControlLabel control={<Checkbox checked={roleState.procurement} onChange={handleChange} name="procurement" color="primary" />}
                    label="Procurement" />
                  <FormControlLabel control={<Checkbox checked={roleState.warehouse} onChange={handleChange} name="warehouse" color="primary" />}
                    label="Warehouse" />
                  <FormControlLabel control={<Checkbox checked={roleState.projectManager} onChange={handleChange} name="projectManager" color="primary" />}
                    label="Project Manager" />
                  <FormControlLabel control={<Checkbox checked={roleState.deputyManager} onChange={handleChange} name="deputyManager" color="primary" />}
                    label="Deputy Manager" />
                  <FormControlLabel control={<Checkbox checked={roleState.supervisor} onChange={handleChange} name="supervisor" color="primary" />}
                    label="Supervisor" />
                  <FormControlLabel control={<Checkbox checked={roleState.usermanagement} onChange={handleChange} name="usermanagement" color="primary" />}
                    label="User Management" />
                  <FormControlLabel control={<Checkbox checked={roleState.subcontract} onChange={handleChange} name="subcontract" color="primary" />}
                    label="SubContract" />
                  <FormControlLabel control={<Checkbox checked={roleState.accounts} onChange={handleChange} name="accounts" color="primary" />}
                    label="Accounts" />
                  <FormControlLabel control={<Checkbox checked={roleState.hrnpayroll} onChange={handleChange} name="hrnpayroll" color="primary" />}
                    label="HR & Payroll" />
                  <FormControlLabel control={<Checkbox checked={roleState.analytics} onChange={handleChange} name="analytics" color="primary" />}
                    label="Analytics" />

                </FormGroup>
              </Paper>
              {rolestate_error && <Alert className={classes.alert} severity="error"> {rolestate_error} </Alert>}

              {/* name */}
              <TextField className={classes.inputFields} id="formControl_name" defaultValue={name}
                label="User Name *" variant="outlined"
                onChange={(event) => { set_name(event.target.value); set_name_error(null); }} />
              {name_error && <Alert className={classes.alert} severity="error"> {name_error} </Alert>}

              <TextField className={classes.inputFields} id="formControl_email" defaultValue={email}
                label="User Email *" variant="outlined" disabled
                onChange={(event) => { set_email(event.target.value); set_email_error(null); }} />
              {email_error && <Alert className={classes.alert} severity="error"> {email_error} </Alert>}

              <TextField className={classes.inputFields} id="formControl_employeeId" defaultValue={employeeId}
                label="Employee Id *" variant="outlined"
                onChange={(event) => { set_employeeId(event.target.value); set_employeeId_error(null); }} />
              {employeeId_error && <Alert className={classes.alert} severity="error"> {employeeId_error} </Alert>}

              <TextField className={classes.inputFields} id="formControl_phone" defaultValue={phone}
                label="Phone Number *" variant="outlined"
                onChange={(event) => { set_phone(event.target.value); set_phone_error(null); }} />
              {phone_error && <Alert className={classes.alert} severity="error"> {phone_error} </Alert>}

              <TextField className={classes.inputFields} id="formControl_branch" defaultValue={branch}
                label="Office Branch" variant="outlined"
                onChange={(event) => { set_branch(event.target.value); set_branch_error(null); }} />
              {branch_error && <Alert className={classes.alert} severity="error"> {branch_error} </Alert>}

              <TextField className={classes.inputFields} id="formControl_address" defaultValue={address}
                label="User Address" variant="outlined"
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
          </Paper>
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
