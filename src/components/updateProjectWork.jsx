import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import EnhancedTableToolbar from './enhancedToolbar';
import axios from 'axios';
import config from "../config.json";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import lstrings from '../lstrings';
import ProjectsImage from '../assets/svg/ss/brief-2.svg';
import Link from '@material-ui/core/Link';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import DateFnsUtils from '@date-io/date-fns';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import IconButton from '@material-ui/core/IconButton';
import AddImage from '@material-ui/icons/Add';
import RemoveImage from '@material-ui/icons/Remove';
import SelectPlace from './selectPlace';
import SelectActivity from './selectActivity';
import UpdateActivity from './updateActivity';
import Chip from '@material-ui/core/Chip';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';
import StepConnector from '@material-ui/core/StepConnector';
import SettingsIcon from '@material-ui/icons/Settings';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Utils from './utils.js';
import WorkSurvey from './workSurvey';
import WorkInstallation from './workInstallation';
import WorkCommissioning from './workCommissioning';
import WorkAcceptance from './workAcceptance';
import WorkHandOver from './workHandOver';

const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  active: {
    '& $line': {
      borderColor: '#22BE6E',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#22BE6E',
    },
  },
  line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
  root: {
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
  },
  active: {
    color: '#F44A4A',
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: '#22BE6E',
    zIndex: 1,
    fontSize: 18,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
    </div>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
};

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  completed: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <VideoLabelIcon />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function createData(slno, data) {
  return { slno, data };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead2(props) {
  const dir = document.getElementsByTagName('html')[0].getAttribute('dir');
  const setDir = (dir === 'rtl' ? true : false);

  const headCells = [
    { id: 'slno', numeric: true, disablePadding: true, label: 'SL' },
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'Status', numeric: false, disablePadding: false, label: 'Status' },
    // { id: 'installation', numeric: false, disablePadding: false, label: 'Installation' },
    // { id: 'commissioning', numeric: false, disablePadding: false, label: 'Commissioning & Testing' },
    // { id: 'acceptance', numeric: false, disablePadding: false, label: 'Acceptance' },
    // { id: 'handover', numeric: false, disablePadding: false, label: 'Hand Over' },
    { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
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

function EnhancedTableHead(props) {
  const dir = document.getElementsByTagName('html')[0].getAttribute('dir');
  const setDir = (dir === 'rtl' ? true : false);

  const headCells = [
    { id: 'code', numeric: false, disablePadding: false, label: 'Code' },
    { id: 'name', numeric: false, disablePadding: false, label: 'Project Name' },
    { id: 'customer', numeric: false, disablePadding: false, label: 'Customer' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'startdate', numeric: false, disablePadding: false, label: 'Start Date' },
    { id: 'expectedenddate', numeric: false, disablePadding: false, label: 'Expected End Date' },
    { id: 'remarks', numeric: false, disablePadding: false, label: 'Remarks' },
    { id: 'documents', numeric: false, disablePadding: false, label: 'Documents' },
    { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' }
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

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableHeadSmall(props) {
  const dir = document.getElementsByTagName('html')[0].getAttribute('dir');
  const setDir = (dir === 'rtl' ? true : false);

  const headCells = [
    { id: 'name', numeric: false, disablePadding: false, label: props.title }
  ];

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={!setDir ? 'left' : 'right'} padding='none' sortDirection={false} >
            {headCell.label}
            {<IconButton color="primary" aria-label="upload picture" component="span" onClick={props.onAddClick}>
              <AddImage />
            </IconButton>}
            {<IconButton color="primary" aria-label="upload picture" component="span" onClick={props.onRemoveClick}>
              <RemoveImage />
            </IconButton>}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
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

export default function UpdateProjectWork(props) {

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
    smalltable: {
      minWidth: 150,
      maxHeight: 100,
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
    container: {
      maxHeight: 300,
    },
  }));

  const classes = useStyles();
  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const [value, setValue] = React.useState(-1);

  const [showBackDrop, setShowBackDrop] = React.useState(false);

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const [workData, setWorkData] = React.useState(null);
  const [surveyItems, setSurveyItems] = React.useState([]);

  const [allItems, set_allItems] = React.useState([]);

  const handleChange = (event, newValue) => {
    console.log(newValue);
    setValue(newValue);
  };

  function getSteps() {
    return ['Survey', 'Installation', 'Commissioning & Testing', "Acceptance", "Hand Over"];
  }

  async function getWorkDetails() {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/work/details?id=" + props.projectWork.work._id;
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

      const { data } = await axios.get(url);
      setWorkData(data);

      let newItems = [];
      if (data.work.survey_materials) {
        for (let i = 0; i < data.work.survey_materials.length; ++i) {
          let item = getItem(data.work.survey_materials[i].item);
          item.qty = parseInt(data.work.survey_materials[i].qty);
          newItems.push(item);
        }
      }
      setSurveyItems(newItems);
      setShowBackDrop(false);
    }
    catch (e) {
      console.log("Error in getting work details");
      setErrorMessage("Error in getting work details");
      setShowError(true);
      setShowBackDrop(false);
    }
  }

  async function getAllItemList(numberOfRows, search = "") {
    try {
      setShowBackDrop(true);
      let url = config["baseurl"] + "/api/material/list?count=" + numberOfRows + "&offset=" + 0 + "&search=" + search;
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log(data);

      set_allItems(data.list.docs);
      setShowBackDrop(false);
    }
    catch (e) {
      setShowBackDrop(false);
      console.log("Error in getting all items");
      setErrorMessage("Error in getting all items");
      setShowError(true);
    }
  }

  useEffect(() => {
    getAllItemList(10000, "");
  }, []);

  useEffect(() => {
    if (allItems.length > 0)
      getWorkDetails();
  }, [allItems]);

  useEffect(() => {
    if (workData)
      updateStepsAndTabs();
  }, [workData]);

  const getItem = (id) => {
    for (let i = 0; i < allItems.length; ++i) {
      if (allItems[i]._id === id)
        return allItems[i];
    }
    return null;
  };

  const updateStepsAndTabs = () => {
    const steps = workData.work.step_status;
    console.log("steps: ", steps);
    let activeTab = 4;
    let stepsCompleted = 5;
    for (let i = 0; i < steps.length; ++i) {
      if (steps[i] === 0) {
        stepsCompleted = i;
        activeTab = i;
        break;
      }
    }
    setActiveStep(stepsCompleted);
    setValue(activeTab);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowError(false);
  };

  const handleCloseBackDrop = () => {

  };

  const handleBreadCrumClick = (val) => {
    if (val === 1)
      props.history.push("/projects");
    else if (val === 2)
      props.history.push("/projectdetails");
  };

  const getActivityStatus = (status) => {
    let retStatus = "Not Started";
    switch (status) {
      case 0:
        retStatus = "Not Started";
        break;
      case 1:
        retStatus = "WIP";
        break;
      case 2:
        retStatus = "Completed";
        break;
      case 3:
        retStatus = "Hold";
        break;
    }

    return retStatus;
  };

  const gotoFromWorkSurvey = (val) => {
    switch (val) {
      case 1:
        getWorkDetails();
        // updateStepsAndTabs();
        // setActiveStep(1);
        break;
    }
  }

  const gotoFromWorkInstallation = (val) => {
    switch (val) {
      case 1:
        getWorkDetails();
        // updateStepsAndTabs();
        // setActiveStep(2);
        break;
    }
  }

  const gotoFromWorkCommissioning = (val) => {
    switch (val) {
      case 1:
        getWorkDetails();
        // updateStepsAndTabs();
        // setActiveStep(3);
        break;
    }
  }

  const gotoFromWorkAcceptance = (val) => {
    switch (val) {
      case 1:
        getWorkDetails();
        // updateStepsAndTabs();
        // setActiveStep(4);
        break;
    }
  }

  const gotoFromWorkHandOver = (val) => {
    switch (val) {
      case 1:
        getWorkDetails();
        // updateStepsAndTabs();
        break;
    }
  }

  return (
    <div className={clsx(classes.root)}>
      {props.refreshUI &&
        <div>
          <div className={classes.paper}>
            <EnhancedTableToolbar title={lstrings.Projects} />
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" onClick={() => handleBreadCrumClick(1)}>
                {"Projects"}
              </Link>
              <Link color="inherit" onClick={() => handleBreadCrumClick(2)}>
                {props.project.code}
              </Link>
              <Typography color="textPrimary">{workData ? workData.activity.name : ""}</Typography>
            </Breadcrumbs>
          </div>

          {
            <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          }
          {value != -1 &&
            <Paper className={classes.grid}>
              <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                  <Tab label="Survey" {...Utils.a11yProps(0)} />
                  <Tab label="Installation" {...Utils.a11yProps(1)} />
                  <Tab label="Commissioning & Testing" {...Utils.a11yProps(2)} />
                  <Tab label="Acceptance" {...Utils.a11yProps(3)} />
                  <Tab label="Hand Over" {...Utils.a11yProps(4)} />
                </Tabs>
              </AppBar>
              <TabPanel value={value} index={0}>
                {<WorkSurvey goto={gotoFromWorkSurvey} items={surveyItems} workData={workData} allItems={allItems} set_allItems={set_allItems}  {...props} />}
              </TabPanel>
              <TabPanel value={value} index={1}>
                {<WorkInstallation goto={gotoFromWorkInstallation} workData={workData} allItems={allItems} {...props} />}
              </TabPanel>
              <TabPanel value={value} index={2}>
                {<WorkCommissioning goto={gotoFromWorkCommissioning} workData={workData} {...props} />}
              </TabPanel>
              <TabPanel value={value} index={3}>
                {<WorkAcceptance goto={gotoFromWorkAcceptance} workData={workData} {...props} />}
              </TabPanel>
              <TabPanel value={value} index={4}>
                {<WorkHandOver goto={gotoFromWorkHandOver} workData={workData} {...props} />}
              </TabPanel>
            </Paper>
          }
        </div >
      }

      <Snackbar open={showError} autoHideDuration={6000} onClose={handleClose}>
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
