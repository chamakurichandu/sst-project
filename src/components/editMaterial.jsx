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

  const [code, set_code] = React.useState(props.selectedMaterial.code);

  const [hsncode, set_hsncode] = React.useState(props.selectedMaterial.hsncode);
  const [hsncode_error, set_hsncode_error] = React.useState(null);

  const [name, set_name] = React.useState(props.selectedMaterial.name);
  const [name_error, set_name_error] = React.useState(null);

  const [description, set_description] = React.useState(props.selectedMaterial.description);
  const [description_error, set_description_error] = React.useState(null);

  const [productcategory, set_productcategory] = React.useState('');
  const [productcategory_error, set_productcategory_error] = React.useState(null);

  const [uom, set_uom] = React.useState('');
  const [uom_error, set_uom_error] = React.useState(null);
  const [showNewUOM, setShowNewUOM] = React.useState(false);
  const [showNewPC, setShowNewPC] = React.useState(false);

  const [contactingServer, setContactingServer] = React.useState(false);

  const [showConfirmationDialog, setShowConfirmationDialog] = React.useState(false);

  useEffect(() => {
    set_productcategory(getProductCategoryIndex(props.selectedMaterial.productCategoryId));
    set_uom(getUOMIndex(props.selectedMaterial.uomId));
  }, []);

  const getProductCategoryIndex = (id) => {
    console.log(props.productCategories);
    for (let i = 0; i < props.productCategories.length; ++i) {
      if (props.productCategories[i]._id == id) {
        return i;
      }
    }
    return '';
  };

  const getUOMIndex = (id) => {
    console.log(props.UOMs);
    for (let i = 0; i < props.UOMs.length; ++i) {
      if (props.UOMs[i]._id == id) {
        return i;
      }
    }
    return '';
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowError(false);
  };

  const handleBreadCrumUsersClick = () => {
    props.history.push("/materials");
  };

  const handleCancel = () => {
    props.history.push("/materials");
  };

  const validateData = () => {
    const schema = Joi.object({
      hsncode: Joi.string().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
    });
    const { error } = schema.validate({
      hsncode: hsncode.trim(),
      name: name.trim(),
      description: description.trim()
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

    set_hsncode_error(null);
    set_name_error(null);
    set_description_error(null);

    const errors = validateData();

    let errorOccured = false;
    if (errors["hsncode"]) {
      set_hsncode_error(errors["hsncode"]);
      errorOccured = true;
    }
    if (errors["name"]) {
      set_name_error(errors["name"]);
      errorOccured = true;
    }
    if (errors["description"]) {
      set_description_error(errors["description"]);
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
        let url = config["baseurl"] + "/api/material/update";

        let postObj = {};
        if (hsncode !== props.selectedMaterial.hsncode)
          postObj["hsncode"] = hsncode.trim();
        if (name !== props.selectedMaterial.name)
          postObj["name"] = name.trim();
        if (description !== props.selectedMaterial.description)
          postObj["description"] = description.trim();
        if (productcategory !== props.selectedMaterial.productCategoryId)
          postObj["productCategoryId"] = props.productCategories[productcategory];

        if (uom !== props.selectedMaterial.uomId)
          postObj["uomId"] = props.UOMs[uom];

        let updateObj = { _id: props.selectedMaterial._id, updateParams: postObj };

        axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

        const response = await axios.patch(url, updateObj);

        console.log("successfully Saved");
        setContactingServer(false);
        props.history.push("/materials");
      }
      catch (e) {
        if (e.response) {
          console.log("Error in creating new user, ", e.response);
          setErrorMessage(e.response.data["message"]);
        }
        else {
          console.log("Error in creating new user: ", e);
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
      let url = config["baseurl"] + "/api/material/delete";

      let postObj = {};
      postObj["_id"] = props.selectedMaterial["_id"];
      console.log("postObj: ", postObj);

      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

      const response = await axios.post(url, postObj);

      console.log("Seleted successfully");
      setContactingServer(false);
      props.history.push("/materials");
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

  const handleProductCategoryChange = (event) => {
    console.log(event.target.value);
    const selected = props.productCategories[parseInt(event.target.value)];
    if (!selected._id) {
      console.log("Its Add New");
      setShowNewPC(true);
    }
    else {
      set_productcategory(event.target.value);
    }
  };

  const handleUOMChange = (event) => {
    console.log(event.target.value);
    const selected = props.UOMs[parseInt(event.target.value)];
    if (!selected._id) {
      console.log("Its Add New");
      setShowNewUOM(true);
    }
    else {
      set_uom(event.target.value);
    }
  };

  return (
    <div className={clsx(classes.root)}>
      {props.refreshUI &&

        <div className={classes.paper}>

          <EnhancedTableToolbar title={lstrings.EditMaterial} />

          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" onClick={handleBreadCrumUsersClick}>
              {lstrings.Materials}
            </Link>
            <Typography color="textPrimary">{lstrings.EditMaterial}</Typography>
          </Breadcrumbs>

          {/* <Paper className={classes.grid}> */}
          <form className={classes.papernew} autoComplete="off" noValidate>
            <TextField className={classes.inputFields} id="formControl_code" defaultValue={code}
              label="Description *" variant="outlined" disabled />

            <TextField className={classes.inputFields} id="formControl_hsncode" defaultValue={hsncode}
              label="HSN Code *" variant="outlined"
              onChange={(event) => { set_hsncode(event.target.value); set_hsncode_error(null); }} />
            {hsncode_error && <Alert className={classes.alert} severity="error"> {hsncode_error} </Alert>}

            <TextField className={classes.inputFields} id="formControl_name" defaultValue={name}
              label="Name *" variant="outlined"
              onChange={(event) => { set_name(event.target.value); set_name_error(null); }} />
            {name_error && <Alert className={classes.alert} severity="error"> {name_error} </Alert>}

            <TextField className={classes.inputFields} id="formControl_description" defaultValue={description}
              label="Description *" variant="outlined"
              onChange={(event) => { set_description(event.target.value); set_description_error(null); }} />
            {description_error && <Alert className={classes.alert} severity="error"> {description_error} </Alert>}

            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="product-category-select-outlined-label">Product Category *</InputLabel>
              <Select
                labelId="product-category-select-outlined-label"
                id="product-category-select-outlined"
                value={productcategory}
                onChange={handleProductCategoryChange}
                label="Product Category *"
              >
                {props.productCategories && props.productCategories.map((row, index) => {
                  return (<MenuItem key={row.name} value={index}>{row.name}</MenuItem>);
                })}
              </Select>
            </FormControl>
            {productcategory_error && <Alert className={classes.alert} severity="error"> {productcategory_error} </Alert>}

            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="uom-select-outlined-label">UOM *</InputLabel>
              <Select
                labelId="uom-select-outlined-label"
                id="uom-select-outlined"
                value={uom}
                onChange={handleUOMChange}
                label="UOM *"
              >
                {props.UOMs && props.UOMs.map((row, index) => {
                  return (<MenuItem key={row.name} value={index}>{row.name}</MenuItem>);
                })}
              </Select>
            </FormControl>
            {uom_error && <Alert className={classes.alert} severity="error"> {uom_error} </Alert>}

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
