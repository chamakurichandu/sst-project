import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import EnhancedTableToolbar from './enhancedToolbar';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import LOI from './loi';
import AddLOI from './addLOI';
import EditLOI from './editLOI';

import PO from './po';
import AddPO from './addPO';
import EditPO from './editPO';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Procurements(props) {

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

  }));

  const classes = useStyles();
  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [value, setValue] = React.useState(0);
  const [loi, setLoi] = React.useState(null);
  const [loiState, setLoiState] = React.useState(0);
  const [po, setPO] = React.useState(0);
  const [poState, setPOState] = React.useState(0);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowError(false);
  };

  const handleChange = (event, newValue) => {
    console.log(newValue);
    setValue(newValue);
    setLoiState(0);
    setPOState(0);
  };

  const gotoFromPO = (target, data) => {
    switch (target) {
      case "po":
        console.log("po");
        setPOState(0);
        break;

      case "addPO":
        console.log("addPO");
        setPOState(1);
        break;

      case "editPO":
        console.log("editPO");
        setPO(data);
        setPOState(2);
        break;
    }
  }

  const gotoFromLOI = (target, data) => {
    switch (target) {
      case "loi":
        console.log("loi");
        setLoiState(0);
        break;

      case "addLOI":
        console.log("addLOI");
        setLoiState(1);
        break;

      case "editLOI":
        console.log("editLOI");
        setLoi(data);
        setLoiState(2);
        break;

      case "createPO":
        setValue(1);
        setPOState(3);
        break;

    }
  };

  return (
    <div className={clsx(classes.root)}>
      {props.refreshUI &&

        <div className={classes.paper}>
          <EnhancedTableToolbar title="Procurement" />

          <AppBar position="static">
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
              <Tab label="Letter Of Intents" {...a11yProps(0)} />
              <Tab label="Purchase Orders" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            {loiState === 0 && <LOI goto={gotoFromLOI} setLoi={setLoi} projects={props.projects} setProjects={props.setProjects} warehouses={props.warehouses} setWarehouses={props.setWarehouses} />}
            {loiState === 1 && <AddLOI goto={gotoFromLOI} projects={props.projects} setProjects={props.setProjects} warehouses={props.warehouses} setWarehouses={props.setWarehouses} />}
            {loiState === 2 && <EditLOI goto={gotoFromLOI} loi={loi} projects={props.projects} setProjects={props.setProjects} warehouses={props.warehouses} setWarehouses={props.setWarehouses} />}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {poState === 0 && <PO goto={gotoFromPO} setPO={setPO} projects={props.projects} setProjects={props.setProjects} warehouses={props.warehouses} setWarehouses={props.setWarehouses} />}
            {poState === 1 && <AddPO goto={gotoFromPO} projects={props.projects} setProjects={props.setProjects} warehouses={props.warehouses} setWarehouses={props.setWarehouses} />}
            {poState === 2 && <EditPO goto={gotoFromPO} po={po} projects={props.projects} setProjects={props.setProjects} warehouses={props.warehouses} setWarehouses={props.setWarehouses} />}
            {poState === 3 && <AddPO goto={gotoFromPO} loi={loi} projects={props.projects} setProjects={props.setProjects} warehouses={props.warehouses} setWarehouses={props.setWarehouses} />}
          </TabPanel>
        </div>

      }
      <Snackbar open={showError} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </div >
  );
}
