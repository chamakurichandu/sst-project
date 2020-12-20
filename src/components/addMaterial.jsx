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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import AddUOM from './addUOM';
import AddProductCategory from './addProductCategory';

const Joi = require('joi');

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function AddMaterial(props) {

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
    submit: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '15px',
      margin: '5px',
    },
    formControl: {
      marginTop: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  const classes = useStyles();
  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const [itemname, set_itemname] = React.useState('');
  const [itemname_error, set_itemname_error] = React.useState(null);

  const [description, set_description] = React.useState('');
  const [description_error, set_description_error] = React.useState(null);

  const [productcategory, set_productcategory] = React.useState('');
  const [productcategory_error, set_productcategory_error] = React.useState(null);

  const [uom, set_uom] = React.useState('');
  const [uom_error, set_uom_error] = React.useState(null);

  const [contactingServer, setContactingServer] = React.useState(false);

  const [productCategories, setProductCategories] = React.useState(null);
  const [UOMs, setUOMs] = React.useState(null);
  const [showNewUOM, setShowNewUOM] = React.useState(false);
  const [showNewPC, setShowNewPC] = React.useState(false);

  async function getPCList() {
    try {
      let url = config["baseurl"] + "/api/productcategory/list";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      let newRows = [];
      data.list.push({ "name": <em>Add New</em> });
      setProductCategories(data.list);
    }
    catch (e) {
      console.log("Error in getting product categories list");
      setErrorMessage("Error in getting product categories list");
      setShowError(true);
    }
  }

  async function getUOMList() {
    try {
      let url = config["baseurl"] + "/api/uom/list";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      data.list.push({ "name": <em>Add New</em> });
      setUOMs(data.list);
    }
    catch (e) {
      console.log("Error in getting UOMs list");
      setErrorMessage("Error in getting UOMs list");
      setShowError(true);
    }
  }

  useEffect(() => {
    getPCList();
    getUOMList();
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowError(false);
  };

  const handleBreadCrumClick = () => {
    props.history.push("/materials");
  };

  const handleCancel = () => {
    props.history.push("/materials");
  };

  const validateData = () => {
    const schema = Joi.object({
      itemname: Joi.string().min(2).max(400).required(),
      description: Joi.string().min(2).max(500).required(),
      productcategory: Joi.number().min(0).max(10000).required(),
      uom: Joi.number().min(0).max(10000).required(),
    });
    const { error } = schema.validate({
      itemname: itemname.trim(),
      description: description.trim(),
      productcategory: productcategory,
      uom: uom,
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

    set_itemname_error(null);
    set_description_error(null);
    set_productcategory_error(null);
    set_uom_error(null);

    const errors = validateData();

    let errorOccured = false;
    if (errors["itemname"]) {
      set_itemname_error(errors["itemname"]);
      errorOccured = true;
    }
    if (errors["description"]) {
      set_description_error(errors["description"]);
      errorOccured = true;
    }
    if (errors["productcategory"]) {
      set_productcategory_error(errors["productcategory"]);
      errorOccured = true;
    }
    if (errors["uom"]) {
      set_uom_error(errors["uom"]);
      errorOccured = true;
    }

    if (errorOccured)
      return;

    try {
      setContactingServer(true);
      let url = config["baseurl"] + "/api/material/add";

      let postObj = {};
      postObj["name"] = itemname.trim();
      postObj["description"] = description.trim();
      postObj["productCategoryId"] = productCategories[productcategory]._id;
      postObj["uomId"] = UOMs[uom]._id;

      console.log("postObj: ", postObj);

      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

      const response = await axios.post(url, postObj);

      console.log("successfully Saved");
      setContactingServer(false);
      props.history.push("/materials");
    }
    catch (e) {
      if (e.response) {
        console.log("Error in creating material");
        setErrorMessage(e.response.data["message"]);
      }
      else {
        console.log("Error in creating");
        setErrorMessage("Error in creating: ", e.message);
      }
      setShowError(true);
      setContactingServer(false);
    }
  };

  const handleProductCategoryChange = (event) => {
    console.log(event.target.value);
    const selected = productCategories[parseInt(event.target.value)];
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
    const selected = UOMs[parseInt(event.target.value)];
    if (!selected._id) {
      console.log("Its Add New");
      setShowNewUOM(true);
    }
    else {
      set_uom(event.target.value);
    }
  };

  const closeNewUOMDialogAction = () => {
    setShowNewUOM(false);
  };

  const closeNewPCDialogAction = () => {
    setShowNewPC(false);
  };

  const onNewUOMSaved = () => {
    setShowNewUOM(false);
    getUOMList();
  };

  const onNewProductCategorySaved = () => {
    setShowNewPC(false);
    getPCList();
  };

  return (
    <div className={clsx(classes.root)}>
      {props.refreshUI &&

        <div className={classes.paper}>

          <EnhancedTableToolbar title={lstrings.AddMaterial} />

          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" onClick={handleBreadCrumClick}>
              {lstrings.Warehouses}
            </Link>
            <Typography color="textPrimary">{lstrings.AddMaterial}</Typography>
          </Breadcrumbs>

          {/* <Paper className={classes.grid}> */}
          <form className={classes.papernew} autoComplete="off" noValidate>
            {/* name */}
            <TextField className={classes.inputFields} id="formControl_itemname" defaultValue={itemname}
              label="Item Name *" variant="outlined"
              onChange={(event) => { set_itemname(event.target.value); set_itemname_error(null); }} />
            {itemname_error && <Alert className={classes.alert} severity="error"> {itemname_error} </Alert>}

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
                {productCategories && productCategories.map((row, index) => {
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
                {UOMs && UOMs.map((row, index) => {
                  return (<MenuItem key={row.name} value={index}>{row.name}</MenuItem>);
                })}
              </Select>
            </FormControl>
            {uom_error && <Alert className={classes.alert} severity="error"> {uom_error} </Alert>}

            <div className={classes.submit}>
              <Button variant="contained" color="primary" onClick={handleCancel} disabled={contactingServer}>Cancel</Button>
              <Button style={{ marginLeft: 10 }} variant="contained" color="primary" onClick={handleSave} disabled={contactingServer}>Save</Button>
            </div>

          </form>
          {/* </Paper> */}
        </div>
      }
      {showNewUOM && <AddUOM closeAction={closeNewUOMDialogAction} onNewSaved={onNewUOMSaved} />}
      {showNewPC && <AddProductCategory closeAction={closeNewPCDialogAction} onNewSaved={onNewProductCategorySaved} />}
      <Snackbar open={showError} autoHideDuration={60000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </div >
  );
}
