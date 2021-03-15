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

export default function AddNewUser(props) {

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
    admin: false,
    procurement: false,
    warehouse: false,
    projectManager: false,
    deputyManager: false,
    supervisor: false,
    usermanagement: false,
    subcontract: false,
    accounts: false,
    hrnpayroll: false,
    analytics: false
  });
  const [rolestate_error, set_rolestate_error] = React.useState(null);

  const [name, set_name] = React.useState('');
  const [name_error, set_name_error] = React.useState(null);

  const [email, set_email] = React.useState('');
  const [email_error, set_email_error] = React.useState(null);

  const [password, set_password] = React.useState('Password@123');
  const [password_error, set_password_error] = React.useState(null);

  const [phone, set_phone] = React.useState('');
  const [phone_error, set_phone_error] = React.useState(null);

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

  const [employeeId, set_employeeId] = React.useState('');
  const [employeeId_error, set_employeeId_error] = React.useState(null);

  const [contactingServer, setContactingServer] = React.useState(false);

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
      password: password.trim(),
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
    ) {
      set_rolestate_error("Atleast one role is required");
    }

    set_name_error(null);
    set_email_error(null);
    set_password_error(null);
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
    if (errors["email"]) {
      set_email_error(errors["email"]);
      errorOccured = true;
    }
    if (errors["password"]) {
      set_password_error(errors["password"]);
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
        let url = config["baseurl"] + "/api/user/useradd";

        let postObj = {};
        postObj["name"] = name.trim();
        postObj["email"] = email.trim();
        postObj["password"] = password.trim();
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

        postObj["phone"] = phone.trim();
        postObj["address"] = address.trim();
        postObj["city"] = city.trim();
        postObj["state"] = state.trim();
        postObj["country"] = country.trim();
        postObj["branch"] = branch.trim();
        postObj["employeeId"] = employeeId.trim();

        console.log("postObj: ", postObj);

        axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

        const response = await axios.post(url, postObj);

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

  const handleChange = (event) => {
    setRoleState({ ...roleState, [event.target.name]: event.target.checked });
    set_rolestate_error(null);
  };

  return (
    <div className={clsx(classes.root)}>
      {props.refreshUI &&

        <div className={classes.paper}>

          <EnhancedTableToolbar title={lstrings.AddUser} />

          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" onClick={handleBreadCrumUsersClick}>
              {lstrings.Users}
            </Link>
            <Typography color="textPrimary">{lstrings.AddUser}</Typography>
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
                label="User Email *" variant="outlined"
                onChange={(event) => { set_email(event.target.value); set_email_error(null); }} />
              {email_error && <Alert className={classes.alert} severity="error"> {email_error} </Alert>}

              <TextField className={classes.inputFields} id="formControl_password" defaultValue={password}
                label="Password *" variant="outlined"
                onChange={(event) => { set_password(event.target.value); set_password_error(null); }} />
              {password_error && <Alert className={classes.alert} severity="error"> {password_error} </Alert>}

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
