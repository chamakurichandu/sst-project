import React, { useEffect, useState } from 'react';
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
import 'date-fns';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import { v4 as uuidv4 } from 'uuid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import DateFnsUtils from '@date-io/date-fns';
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

const Joi = require('joi');

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function AddProject(props) {

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
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  const classes = useStyles();
  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const [name, set_name] = React.useState('');
  const [name_error, set_name_error] = React.useState(null);

  const [customers, setCustomers] = React.useState([]);
  const [customer_error, set_customer_error] = React.useState(null);
  const [currentCustomer, setCurrentCustomer] = React.useState(-1);

  const [remarks, set_remarks] = React.useState('');
  const [remarks_error, set_remarks_error] = React.useState(null);

  const [startDate, handleStartDateChange] = useState(new Date());
  const [expEndDate, handleExpEndDateChange] = useState(new Date());

  const [files, set_files] = React.useState([]);

  const [contactingServer, setContactingServer] = React.useState(false);

  const [showBackDrop, setShowBackDrop] = React.useState(false);

  async function getCustomerList() {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/customer/list?count=" + 1000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log(data);

      setCustomers(data.list.docs);
      setShowBackDrop(false);
    }
    catch (e) {
      setShowBackDrop(false);
      if (e.response) {
        setErrorMessage(e.response.data.message);
      }
      else {
        setErrorMessage("Error in getting list");
      }
      setShowError(true);
    }
  }

  useEffect(() => {
    getCustomerList();
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowError(false);
  };

  const handleBreadCrumClick = () => {
    props.history.push("/projects");
  };

  const handleCancel = () => {
    props.history.push("/projects");
  };

  const validateData = () => {
    const schema = Joi.object({
      name: Joi.string().min(2).max(400).required(),
      remarks: Joi.string().min(0).max(4096).required()
    });
    const { error } = schema.validate({
      name: name.trim(),
      remarks: remarks.trim()
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

    // const dateFns = new DateFnsUtils();
    // console.log(startDate.toUTCString());
    // const initialDateFnsDate = dateFns.date(startDate.toUTCString());
    // console.log(initialDateFnsDate);
    // console.log(startDate);
    // console.log(Date.parse(startDate.toUTCString()));

    set_name_error(null);
    set_remarks_error(null);

    const errors = validateData();

    let errorOccured = false;
    if (errors["name"]) {
      set_name_error(errors["name"]);
      errorOccured = true;
    }
    if (errors["remarks"]) {
      set_remarks_error(errors["remarks"]);
      errorOccured = true;
    }

    if (currentCustomer === -1) {
      set_customer_error("Customer is required");
    }

    console.log("1");
    if (errorOccured)
      return;
    console.log("2");
    try {
      setContactingServer(true);
      let url = config["baseurl"] + "/api/project/add";

      let postObj = {};
      postObj["name"] = name.trim();
      postObj["customer"] = customers[currentCustomer]._id;
      postObj["remark"] = remarks.trim();
      postObj["startdate"] = startDate.toUTCString();
      postObj["exp_enddate"] = expEndDate.toUTCString();
      postObj["docs"] = [];
      for (let i = 0; i < files.length; ++i) {
        postObj["docs"].push({ name: files[i].name, path: files[i].path });
      }

      console.log("postObj: ", postObj);

      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      console.log("3");
      const response = await axios.post(url, postObj);
      console.log("4");
      console.log("successfully Saved");
      setContactingServer(false);
      props.history.push("/projects");
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
      setContactingServer(false);
    }
  };

  const handleDelete = (index) => {
    console.log("handleDelete: index: ", index);
    let newFiles = [...files];
    newFiles.splice(index, 1);
    set_files(newFiles);
  };

  const handleOpenDoc = (index) => {
    const file = files[index];
    console.log(file);
    window.open(file.path, '_blank');
  };

  const onFileSelected = (event) => {
    console.log(event.target.files[0]);

    let fileParts = event.target.files[0].name.split('.');
    console.log(fileParts);
    let file = { file: event.target.files[0], name: uuidv4() + "." + fileParts[1] };

    uploadFile(file)
  };

  const uploadFile = async (myfile) => {
    setShowBackDrop(true);

    console.log("Preparing the upload");
    let url = config["baseurl"] + "/api/cloud/sign_s3";
    axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
    const profileInfo = JSON.parse(window.localStorage.getItem("profile"));
    try {
      const response = await axios.post(url, {
        fileName: myfile.name,
        fileType: myfile.file.fileType,
        folder: "project_docs"
      });

      if (response) {
        var returnData = response.data.data.returnData;
        var signedRequest = returnData.signedRequest;

        // Put the fileType in the headers for the upload
        var options = { headers: { 'x-amz-acl': 'public-read', 'Content-Type': myfile.file.type } };
        try {
          const result = await axios.put(signedRequest, myfile.file, options);

          let newFiles = [...files];
          myfile.path = returnData.url;
          myfile.name = myfile.file.name;
          console.log("myfile: ", myfile);
          newFiles.push(myfile);
          set_files(newFiles);

          setShowBackDrop(false);

          console.log("Response from s3 Success: ", returnData.url);
        }
        catch (error) {
          console.log("ERROR: ", JSON.stringify(error));
          setShowBackDrop(false);
          alert("ERROR " + JSON.stringify(error));
        }
      }
    }
    catch (error) {
      console.log("error: ", error);
      setShowBackDrop(false);
      alert(JSON.stringify(error));
    }
  };

  const handleCloseBackDrop = () => {

  };

  const handleCustomerChange = (event) => {
    setCurrentCustomer(event.target.value);
    set_customer_error(null);
  };

  return (
    <div className={clsx(classes.root)}>
      {props.refreshUI &&

        <div className={classes.paper}>

          <EnhancedTableToolbar title={"Add Project"} />

          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" onClick={handleBreadCrumClick}>
              {"Projects"}
            </Link>
            <Typography color="textPrimary">{"Add Project"}</Typography>
          </Breadcrumbs>

          {/* <Paper className={classes.grid}> */}
          <form className={classes.papernew} autoComplete="off" noValidate>
            {/* name */}
            <TextField size="small" className={classes.inputFields} id="formControl_name" defaultValue={name}
              label="Project Name *" variant="outlined"
              onChange={(event) => { set_name(event.target.value); set_name_error(null); }} />
            {name_error && <Alert className={classes.alert} severity="error"> {name_error} </Alert>}

            <FormControl size="small" variant="outlined" className={classes.formControl}>
              <InputLabel id="customer-select-label">Customer *</InputLabel>
              <Select
                labelId="customer-select-label"
                id="customer-select-label"
                value={currentCustomer === -1 ? "" : currentCustomer}
                onChange={handleCustomerChange}
                label="Customer *"
              >
                {customers.map((row, index) => {
                  return (
                    <MenuItem key={"" + index} value={index}>{row.name}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {customer_error && <Alert className={classes.alert} severity="error"> {customer_error} </Alert>}

            <TextField size="small" className={classes.inputFields} id="formControl_remarks" defaultValue={remarks}
              label="Remarks *" variant="outlined" multiline
              onChange={(event) => { set_remarks(event.target.value); set_remarks_error(null); }} />
            {remarks_error && <Alert className={classes.alert} severity="error"> {remarks_error} </Alert>}

            <FormControl variant="outlined" size="small" className={classes.formControl}>
              <MuiPickersUtilsProvider utils={DateFnsUtils} >
                <DatePicker size="small" label="StartDate" inputVariant="outlined" format="dd/MM/yyyy" value={startDate} onChange={handleStartDateChange} />
              </MuiPickersUtilsProvider>
            </FormControl>

            <FormControl variant="outlined" size="small" className={classes.formControl}>
              <MuiPickersUtilsProvider utils={DateFnsUtils} >
                <DatePicker size="small" label="Exp EndDate" inputVariant="outlined" format="dd/MM/yyyy" value={expEndDate} onChange={handleExpEndDateChange} />
              </MuiPickersUtilsProvider>
            </FormControl>

            <div style={{ marginTop: 10 }}>
              <div>
                {files.map((file, index) => {
                  return (<Chip style={{ marginTop: 5, marginRight: 5 }} key={"chip" + index} label={file.name} clickable variant="outlined" onClick={() => handleOpenDoc(index)} onDelete={() => handleDelete(index)} />);
                })}
              </div>
              <div style={{ marginTop: 5 }}>
                <Button style={{ background: "#314293", color: "#FFFFFF" }} variant="contained" component="label" onChange={onFileSelected}>
                  Upload Document
                  <input type="file" hidden />
                </Button>
              </div>
            </div>

            <div className={classes.submit}>
              <Button variant="contained" color="primary" onClick={handleCancel} disabled={contactingServer}>Cancel</Button>
              <Button style={{ marginLeft: 10 }} variant="contained" color="primary" onClick={handleSave} disabled={contactingServer}>Save</Button>
            </div>

          </form>
          {/* </Paper> */}
        </div>
      }
      <Snackbar open={showError} autoHideDuration={60000} onClose={handleClose}>
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
