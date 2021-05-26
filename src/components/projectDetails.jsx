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
    // { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' }
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

export default function ProjectDetails(props) {

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
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(true);
  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [rows, setRows] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [customers, setCustomers] = React.useState([]);

  const [divisions, setDivisions] = React.useState([]);
  const [subDivisions, setSubDivisions] = React.useState([]);
  const [sections, setSections] = React.useState([]);
  const [feeders, setFeeders] = React.useState([]);
  const [activities, setActivities] = React.useState([]);

  const [projectDivisions, setProjectDivisions] = React.useState([]);
  const [projectSubDivisions, setProjectSubDivisions] = React.useState([]);
  const [projectSections, setProjectSections] = React.useState([]);
  const [projectFeeders, setProjectFeeders] = React.useState([]);
  const [projectActivities, setProjectActivities] = React.useState([]);

  const [currentDivision, setCurrentDivision] = React.useState(-1);
  const [currentSubDivision, setCurrentSubDivision] = React.useState(-1);
  const [currentSection, setCurrentSection] = React.useState(-1);
  const [currentFeeder, setCurrentFeeder] = React.useState(-1);

  const [showSelectDivision, setShowSelectDivision] = React.useState(false);
  const [showRemoveDivision, setShowRemoveDivision] = React.useState(false);

  const [showSelectSubDivision, setShowSelectSubDivision] = React.useState(false);
  const [showRemoveSubDivision, setShowRemoveSubDivision] = React.useState(false);

  const [showSelectSection, setShowSelectSection] = React.useState(false);
  const [showRemoveSection, setShowRemoveSection] = React.useState(false);

  const [showSelectFeeder, setShowSelectFeeder] = React.useState(false);
  const [showRemoveFeeder, setShowRemoveFeeder] = React.useState(false);

  const [showAddActivityDialog, setShowAddActivityDialog] = React.useState(false);
  const [showEditActivityDialog, setShowEditActivityDialog] = React.useState(false);

  const [activityName, setActivityName] = React.useState(null);
  const [selectedActivity, setSelectedActivity] = React.useState(null);

  const [showBackdrop, setShowBackdrop] = React.useState(false);

  const [activeStep, setActiveStep] = React.useState(2);
  const steps = getSteps();

  const pageLimits = [10, 25, 50];
  let offset = 0;

  function getSteps() {
    return ['Survey', 'Installation', 'Commissioning & Testing', "Acceptance", "Hand Over"];
  }

  // async function getProject() {
  //   try {
  //     let url = config["baseurl"] + "/api/project/details";
  //     axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
  //     axios.defaults.headers.common['_id'] = props.project._id;
  //     const { data } = await axios.get(url);
  //     delete axios.defaults.headers.common['_id'];
  //     console.log("ProjectDetails: project: ", data);

  //     const dateFns = new DateFnsUtils();
  //     data.startdate_conv = dateFns.date(data.startdate);
  //     data.exp_enddate_conv = dateFns.date(data.exp_enddate);

  //     setCurrentProj(data);
  //     props.setProject(data);

  //     getDivisionList();
  //   }
  //   catch (e) {

  //     if (e.response) {
  //       setErrorMessage(e.response.data.message);
  //     }
  //     else {
  //       setErrorMessage("Error in getting list");
  //     }
  //     setShowError(true);
  //   }
  // }
  async function getCustomerList() {
    try {
      let url = config["baseurl"] + "/api/customer/list?count=" + 1000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log(data);
      setCustomers(data.list.docs);
    }
    catch (e) {
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

  const getDivisionList = async () => {
    console.log("getDivisionList called");
    setDivisions([]);
    setProjectDivisions([]);
    setCurrentDivision(-1);
    setSubDivisions([]);
    setProjectSubDivisions([]);
    setCurrentSubDivision(-1);
    setSections([]);
    setProjectSections([]);
    setCurrentSection(-1);
    setFeeders([]);
    setProjectFeeders([]);
    setCurrentFeeder(-1);

    try {
      setShowBackdrop(true);
      console.log("page: ", page);
      let url = config["baseurl"] + "/api/division/list?count=" + 10000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      // console.log(data);

      setDivisions(data.list.docs);
      setShowBackdrop(false);
    }
    catch (e) {
      console.log(e.response);
      setShowBackdrop(false);
      if (e.response) {
        setErrorMessage(e.response.data.message);
      }
      else {
        setErrorMessage("Error in getting divisions");
      }
      console.log("Error in getting divisions");
      setShowError(true);
    }
  }

  const getDivisionListForProject = async () => {
    setProjectDivisions([]);
    setCurrentDivision(-1);
    setSubDivisions([]);
    setProjectSubDivisions([]);
    setCurrentSubDivision(-1);
    setSections([]);
    setProjectSections([]);
    setCurrentSection(-1);
    setFeeders([]);
    setProjectFeeders([]);
    setCurrentFeeder(-1);

    console.log("getDivisionListForProject called");
    try {
      setShowBackdrop(true);
      console.log("page: ", page);
      let url = config["baseurl"] + "/api/projectPlace/list?type=division&project=" + props.project._id + "&parent=parent" + "&count=" + 10000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      // console.log(data);

      for (let i = 0; i < data.list.docs.length; ++i) {
        const t = data.list.docs[i].place;
        for (let k = 0; k < divisions.length; ++k) {
          if (t === divisions[k]._id)
            data.list.docs[i].name = divisions[k].name;
        }
      }

      setProjectDivisions(data.list.docs);
      setCurrentDivision(0);

      setShowBackdrop(false);
    }
    catch (e) {
      console.log(e.response);
      setShowBackdrop(false);
      if (e.response) {
        setErrorMessage(e.response.data.message);
      }
      else {
        setErrorMessage("Error in getting divisions");
      }
      console.log("Error in getting divisions");
      setShowError(true);
    }
  }

  const getSubDivisionList = async () => {
    setSubDivisions([]);
    setProjectSubDivisions([]);
    setCurrentSubDivision(-1);
    setSections([]);
    setProjectSections([]);
    setCurrentSection(-1);
    setFeeders([]);
    setProjectFeeders([]);
    setCurrentFeeder(-1);

    console.log("getSubDivisionList called");
    try {
      setShowBackdrop(true);
      console.log("page: ", page);
      const divisionIndex = currentDivision === -1 ? 0 : currentDivision;
      let url = config["baseurl"] + "/api/subdivision/list?division=" + projectDivisions[divisionIndex].place + "&count=" + 10000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      // console.log(data);

      setSubDivisions(data.list.docs);
      setShowBackdrop(false);
    }
    catch (e) {
      console.log(e.response);
      setShowBackdrop(false);
      if (e.response) {
        setErrorMessage(e.response.data.message);
      }
      else {
        setErrorMessage("Error in getting subdivisions");
      }
      console.log("Error in getting subdivisions");
      setShowError(true);
    }
  }

  const getSubDivisionListForProject = async () => {
    setProjectSubDivisions([]);
    setCurrentSubDivision(-1);
    setSections([]);
    setProjectSections([]);
    setCurrentSection(-1);
    setFeeders([]);
    setProjectFeeders([]);
    setCurrentFeeder(-1);

    console.log("getSubDivisionListForProject called");
    try {
      setShowBackdrop(true);
      console.log("page: ", page);
      let url = config["baseurl"] + "/api/projectPlace/list?type=subdivision&project=" + props.project._id + "&parent=" + projectDivisions[currentDivision].place + "&count=" + 10000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      console.log(data);

      for (let i = 0; i < data.list.docs.length; ++i) {
        const t = data.list.docs[i].place;
        for (let k = 0; k < subDivisions.length; ++k) {
          if (t === subDivisions[k]._id)
            data.list.docs[i].name = subDivisions[k].name;
        }
      }

      setProjectSubDivisions(data.list.docs);
      setCurrentSubDivision(0);
      setShowBackdrop(false);
    }
    catch (e) {
      console.log(e.response);
      setShowBackdrop(false);
      if (e.response) {
        setErrorMessage(e.response.data.message);
      }
      else {
        setErrorMessage("Error in getting subdivisions");
      }
      console.log("Error in getting subdivisions");
      setShowError(true);
    }
  }

  async function getSectionList() {
    setSections([]);
    setProjectSections([]);
    setCurrentSection(-1);
    setFeeders([]);
    setProjectFeeders([]);
    setCurrentFeeder(-1);

    console.log("getSectionList called");
    try {
      setShowBackdrop(true);
      // console.log("page: ", page);

      const index = currentSubDivision === -1 ? 0 : currentSubDivision;
      let url = config["baseurl"] + "/api/section/list?subdivision=" + projectSubDivisions[index].place + "&count=" + 1000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);

      setSections(data.list.docs);

      setShowBackdrop(false);
    }
    catch (e) {
      console.log(e.response);
      setShowBackdrop(false);
      if (e.response) {
        setErrorMessage(e.response.data.message);
      }
      else {
        setErrorMessage("Error in getting sections");
      }
      console.log("Error in getting sections");
      setShowError(true);
    }
  }

  async function getSectionListForProject() {
    setProjectSections([]);
    setCurrentSection(-1);
    setFeeders([]);
    setProjectFeeders([]);
    setCurrentFeeder(-1);

    console.log("getSectionListForProject called");
    try {
      setShowBackdrop(true);
      // console.log("page: ", page);

      let url = config["baseurl"] + "/api/projectPlace/list?type=section&project=" + props.project._id + "&parent=" + projectSubDivisions[currentSubDivision].place + "&count=" + 10000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);

      for (let i = 0; i < data.list.docs.length; ++i) {
        const t = data.list.docs[i].place;
        for (let k = 0; k < sections.length; ++k) {
          if (t === sections[k]._id)
            data.list.docs[i].name = sections[k].name;
        }
      }

      setProjectSections(data.list.docs);
      setCurrentSection(0);

      setShowBackdrop(false);
    }
    catch (e) {
      console.log(e.response);
      setShowBackdrop(false);
      if (e.response) {
        setErrorMessage(e.response.data.message);
      }
      else {
        setErrorMessage("Error in getting sections");
      }
      console.log("Error in getting sections");
      setShowError(true);
    }
  }

  async function getFeedersList() {
    setFeeders([]);
    setProjectFeeders([]);
    setCurrentFeeder(-1);

    console.log("getActivitiesList called");
    try {
      setShowBackdrop(true);
      // console.log("page: ", page);

      const index = currentSection === -1 ? 0 : currentSection;

      let url = config["baseurl"] + "/api/feeder/list?section=" + projectSections[index].place + "&count=" + 10000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);

      setFeeders(data.list.docs);

      console.log("feeders: ", feeders);

      setShowBackdrop(false);
    }
    catch (e) {
      console.log(e.response);
      setShowBackdrop(false);
      if (e.response) {
        setErrorMessage(e.response.data.message);
      }
      else {
        setErrorMessage("Error in getting sections");
      }
      console.log("Error in getting sections");
      setShowError(true);
    }
  }

  async function getFeedersListForProject() {
    setProjectFeeders([]);
    setCurrentFeeder(-1);

    console.log("getFeedersListForProject called");
    try {
      setShowBackdrop(true);
      // console.log("page: ", page);

      let url = config["baseurl"] + "/api/projectPlace/list?type=feeder&project=" + props.project._id + "&parent=" + projectSections[currentSection].place + "&count=" + 10000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);

      for (let i = 0; i < data.list.docs.length; ++i) {
        const t = data.list.docs[i].place;
        for (let k = 0; k < feeders.length; ++k) {
          if (t === feeders[k]._id)
            data.list.docs[i].name = feeders[k].name;
        }
      }

      setProjectFeeders(data.list.docs);
      setCurrentFeeder(0);

      setShowBackdrop(false);
    }
    catch (e) {
      console.log(e.response);
      setShowBackdrop(false);
      if (e.response) {
        setErrorMessage(e.response.data.message);
      }
      else {
        setErrorMessage("Error in getting activities for project");
      }
      console.log("Error in getting activities for project");
      setShowError(true);
    }
  }

  const getActivities = async (nRows, search = "") => {
    console.log("getActivities called");
    setRows([]);
    if (projectFeeders.length === 0 || currentFeeder === -1)
      return;

    try {
      setShowBackdrop(true);
      // console.log("page: ", page);      

      let url = config["baseurl"] + "/api/activity/list?count=" + 10000 + "&offset=" + offset + "&search=" + search;
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);

      console.log("data.list.docs: ", data.list.docs);

      setShowBackdrop(false);
      setActivities(data.list.docs);
    }
    catch (e) {
      console.log(e.response);
      setShowBackdrop(false);
      if (e.response) {
        setErrorMessage(e.response.data.message);
      }
      else {
        setErrorMessage("Error in getting activities for project");
      }
      console.log("Error in getting activities for project");
      setShowError(true);
    }
  };

  const getActivitiesForProject = async (nRows, search = "") => {
    console.log("getActivitiesForProject called");
    setRows([]);
    if (projectFeeders.length === 0 || currentFeeder === -1)
      return;

    try {
      setShowBackdrop(true);

      console.log(projectFeeders[currentFeeder]);

      let url = config["baseurl"] + "/api/work/list?&feeder_ref_id=" + projectFeeders[currentFeeder].place + "&count=" + 10000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);

      console.log("works data:", data);

      setProjectActivities(data.list);
      setShowBackdrop(false);
    }
    catch (e) {
      console.log(e.response);
      setShowBackdrop(false);
      if (e.response) {
        setErrorMessage(e.response.data.message);
      }
      else {
        setErrorMessage("Error in getting feeders for project");
      }
      console.log("Error in getting feeders for project");
      setShowError(true);
    }
  };

  useEffect(() => {

    console.log("ProjectDetails: project 1 : ", props.project);

    if (props.project)
      getDivisionList();

  }, [props.project]);

  useEffect(() => {
    if (divisions.length > 0)
      getDivisionListForProject();
  }, [divisions]);

  useEffect(() => {
    if (projectDivisions.length > 0)
      getSubDivisionList();
  }, [projectDivisions, currentDivision]);

  useEffect(() => {
    if (subDivisions.length > 0)
      getSubDivisionListForProject();
  }, [subDivisions]);

  useEffect(() => {
    if (projectSubDivisions.length > 0)
      getSectionList();
  }, [projectSubDivisions, currentSubDivision]);

  useEffect(() => {
    if (sections.length > 0)
      getSectionListForProject();
  }, [sections]);

  useEffect(() => {
    if (projectSections.length > 0)
      getFeedersList();
  }, [projectSections, currentSection]);

  useEffect(() => {
    if (feeders.length > 0)
      getFeedersListForProject();
  }, [feeders]);

  useEffect(() => {
    if (projectFeeders.length > 0)
      getActivities(rowsPerPage);
  }, [projectFeeders, currentFeeder]);

  useEffect(() => {
    // if (activities.length > 0)
    getActivitiesForProject();
  }, [activities]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowError(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    offset = newPage * rowsPerPage;
    setPage(newPage);
    getActivities(rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    offset = 0;
    getActivities(newRowsPerPage);
  };

  const handleEditActivity = (data, name) => {
    console.log("handleEditActivity: ", data);

    props.setSelectedProjectWork(data);
    props.history.push("/updateprojectwork");
    // setActivityName(name);
    // setSelectedActivity(data);
    // setShowEditActivityDialog(true);
  };

  const handleAddActivity = () => {
    setShowAddActivityDialog(true);
  };

  const onSearchChange = (event) => {
    console.log(event.target.value);

    getActivities(rowsPerPage, event.target.value);
  };

  const onDetails = (index) => {

  };

  const handleCloseBackDrop = () => {

  };

  const getCustomer = (customerId) => {
    for (let i = 0; i < customers.length; ++i) {
      if (customers[i]._id === customerId)
        return customers[i].name;
    }
    return "Customer not available";
  };

  const handleBreadCrumClick = () => {
    props.history.push("/projects");
  };

  const handleDivisionsClick = (event, index) => {
    setCurrentDivision(index);
  };

  const handleSubDivisionsClick = (event, index) => {
    setCurrentSubDivision(index);
  };

  const handleSectionClick = (event, index) => {
    setCurrentSection(index);
  };

  const handleFeederClick = (event, index) => {
    setCurrentFeeder(index);
  };

  const addDivision = () => {
    setShowSelectDivision(true);
  };

  const addSubDivision = () => {
    setShowSelectSubDivision(true);
  };

  const addSection = () => {
    setShowSelectSection(true);
  };

  const addFeeder = () => {
    setShowSelectFeeder(true);
  };

  const removeDivision = () => {
    setShowRemoveDivision(true);
  };

  const removeSubDivision = () => {
    setShowRemoveSubDivision(true);
  };

  const removeFeeder = () => {
    setShowRemoveFeeder(true);
  };

  const removeSection = () => {
    setShowRemoveSection(true);
  };

  const closeSelectPlaceDialogAction = () => {
    setShowSelectDivision(false);
    setShowRemoveDivision(false);
    setShowSelectSubDivision(false);
    setShowRemoveSubDivision(false);
    setShowSelectSection(false);
    setShowRemoveSection(false);
    setShowSelectFeeder(false);
    setShowRemoveFeeder(false);
    setShowAddActivityDialog(false);
  };

  const onSelectDivision = () => {
    setShowSelectDivision(false);
    setShowRemoveDivision(false);
    getDivisionListForProject();
  };

  const onSelectSubDivision = () => {
    setShowSelectSubDivision(false);
    setShowRemoveSubDivision(false);
    getSubDivisionListForProject();
  };

  const onSelectSection = () => {
    setShowSelectSection(false);
    setShowRemoveSection(false);
    getSectionListForProject();
  };

  const onSelectFeeder = () => {
    setShowSelectFeeder(false);
    setShowRemoveFeeder(false);
    getFeedersListForProject();
  };

  const onSelectActivity = () => {
    setShowAddActivityDialog(false);
    getActivitiesForProject();
  };

  const getDivisionName = (place) => {
    for (let i = 0; i < divisions.length; ++i) {
      if (divisions[i]._id === place)
        return divisions[i].name;
    }
    return place;
  };

  const closeAddActivityAction = () => {
    setShowAddActivityDialog(false);
  };

  const onNewActivitySavedAction = () => {
    setShowAddActivityDialog(false);
    getActivities(rowsPerPage);
  };

  const closeEditActivityAction = () => {
    setShowEditActivityDialog(false);
  };

  const deleteActivityAction = async () => {
    setShowEditActivityDialog(false);

    try {
      setShowBackdrop(true);
      let url = config["baseurl"] + "/api/work/delete";

      let postObj = {};
      postObj["_id"] = selectedActivity._id;

      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

      const response = await axios.post(url, postObj);

      console.log("successfully Saved");
      setShowBackdrop(false);

      getActivities(rowsPerPage);
    }
    catch (e) {
      if (e.response) {
        console.log("Error in editing 1");
        console.log("e.response: ", e.response);
        setErrorMessage(e.response.data["message"]);
      }
      else {
        console.log("Error in editing 2");
        setErrorMessage("Error in editing: ", e.message);
      }
      setShowError(true);
      setShowBackdrop(false);
    }
  };

  const onEditActivitySavedAction = () => {
    setShowEditActivityDialog(false);
    getActivities(rowsPerPage);
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

  const getActivityColor = (status) => {
    let retStatus = "red";
    switch (status) {
      case 0:
        retStatus = "gray";
        break;
      case 1:
        retStatus = "orange";
        break;
      case 2:
        retStatus = "green";
        break;
      case 3:
        retStatus = "red";
        break;
    }

    return retStatus;
  };

  const handleProjectEdit = () => {
    props.history.push("/editproject");
  };

  const handleOpenDoc = (index) => {
    const file = props.project.docs[index];
    console.log(file);
    window.open(file.path, '_blank');
  };

  return (
    <div className={clsx(classes.root)}>
      {props.refreshUI && props.project &&
        <div>
          {/* <PDFDownloadLink document={<Quixote />} fileName="somename.pdf">
            {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
          </PDFDownloadLink> */}
          <div className={classes.paper}>
            <EnhancedTableToolbar title={"Project: " + props.project.code} />
            {/* <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" onClick={handleBreadCrumClick}>
                {"Project Details"}
              </Link>
              <Typography color="textPrimary">{props.project.code}</Typography>
            </Breadcrumbs> */}

            <Paper className={classes.grid}>
              <TableContainer>
                <Table
                  className={classes.table}
                  aria-labelledby="tableTitle"
                  size={dense ? 'small' : 'medium'}
                  aria-label="enhanced table"
                >
                  <EnhancedTableHead
                    classes={classes}
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={rows.length}
                  />

                  {props.project &&
                    <TableBody>
                      <TableRow hover tabIndex={-1} key={"1"}>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'} >{props.project.code}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{props.project.name}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{getCustomer(props.project.customer)}</span></TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{props.project.status}</span></TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{props.project.startdate_conv.toDateString()}</span></TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{props.project.exp_enddate_conv.toDateString()}</span></TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{props.project.remark}</span></TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                          {props.project.docs.map((file, index) => {
                            return (<Chip style={{ marginTop: 5, marginRight: 5 }} key={"chip" + index} label={file.name} clickable variant="outlined" onClick={() => handleOpenDoc(index)} />);
                          })}
                        </TableCell>

                        {/* {props.adminRole && <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                          <div><Button onClick={() => handleProjectEdit()} style={{ background: "#314293", color: "#FFFFFF" }} variant="contained" className={classes.button}>{lstrings.Edit}</Button></div>
                        </TableCell>} */}

                      </TableRow>
                    </TableBody>
                  }
                </Table>
              </TableContainer>
            </Paper>
          </div>

          <div className={classes.paper}>

            <Paper className={classes.grid} style={{ textAlign: 'left' }}>
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  <Paper className={classes.paper}>
                    <TableContainer className={classes.container}>
                      <Table className={classes.smalltable} stickyHeader aria-labelledby="tableTitle" size='small' aria-label="enhanced table" >
                        <EnhancedTableHeadSmall title="Division" onAddClick={addDivision} onRemoveClick={removeDivision} />
                        <TableBody>
                          {projectDivisions.map((row, index) => {
                            return (
                              <TableRow hover tabIndex={-1} key={"" + index} selected={index === currentDivision} onClick={(event) => handleDivisionsClick(event, index)} >
                                <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + (index + 1) + ". " + row.name}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper className={classes.paper}>
                    <TableContainer className={classes.container}>
                      <Table className={classes.smalltable} stickyHeader aria-labelledby="tableTitle" size='small' aria-label="enhanced table" >
                        <EnhancedTableHeadSmall title="SubDivision" onAddClick={addSubDivision} onRemoveClick={removeSubDivision} />
                        <TableBody>
                          {projectSubDivisions.map((row, index) => {
                            return (
                              <TableRow hover tabIndex={-1} key={"" + index} selected={index === currentSubDivision} onClick={(event) => handleSubDivisionsClick(event, index)} >
                                <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + (index + 1) + ". " + row.name}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper className={classes.paper}>
                    <TableContainer className={classes.container}>
                      <Table className={classes.smalltable} stickyHeader aria-labelledby="tableTitle" size='small' aria-label="enhanced table" >
                        <EnhancedTableHeadSmall title="Section" onAddClick={addSection} onRemoveClick={removeSection} />
                        <TableBody>
                          {projectSections.map((row, index) => {
                            return (
                              <TableRow hover tabIndex={-1} key={"" + index} selected={index === currentSection} onClick={(event) => handleSectionClick(event, index)} >
                                <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + (index + 1) + ". " + row.name}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper className={classes.paper}>
                    <TableContainer className={classes.container}>
                      <Table className={classes.smalltable} stickyHeader aria-labelledby="tableTitle" size='small' aria-label="enhanced table" >
                        <EnhancedTableHeadSmall title="Feeders/Locations" onAddClick={addFeeder} onRemoveClick={removeFeeder} />
                        <TableBody>
                          {projectFeeders.map((row, index) => {
                            return (
                              <TableRow hover tabIndex={-1} key={"" + index} selected={index === currentFeeder} onClick={(event) => handleFeederClick(event, index)} >
                                <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + (index + 1) + ". " + row.name}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </div>
          {
            (projectFeeders.length > 0) &&
            <div className={classes.paper}>
              <Paper className={classes.grid}>
                <Grid container spacing={2}>
                  <Grid item className={classes.totalAttendes}>
                    {/* <img src={ProjectsImage} width='25' alt="" /> */}
                    <h1 className={classes.h1}>{projectActivities.length}</h1>
                    <span>{"Activities"}</span>
                  </Grid>
                  <Grid item className={classes.addButton}>
                    <Button onClick={() => handleAddActivity()} style={{ background: "#314293", color: "#FFFFFF" }} variant="contained" className={classes.button}>{"Add Activity"}</Button>
                  </Grid>
                </Grid>
              </Paper>
              <Paper className={classes.grid}>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="Search"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={onSearchChange}
                  />
                </div>
                <TableContainer>
                  <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size='small'
                    aria-label="enhanced table"
                  >
                    <EnhancedTableHead2
                      classes={classes}
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={handleSelectAllClick}
                      onRequestSort={handleRequestSort}
                      rowCount={rows.length}
                    />

                    <TableBody>
                      {projectActivities.map((row, index) => {
                        let stepsCompleted = 5;
                        for (let i = 0; i < row.work.step_status.length; ++i) {
                          if (row.work.step_status[i] === 0) {
                            stepsCompleted = i;
                            break;
                          }
                        }
                        return (
                          <TableRow hover tabIndex={-1} key={"index" + index}>
                            <TableCell align={dir === 'rtl' ? 'right' : 'left'} component="th" id={"Label" + index} scope="row" padding="none">{"" + (index + 1)}</TableCell>
                            <TableCell align={dir === 'rtl' ? 'right' : 'left'} >{index < projectActivities.length && projectActivities[index].activity.name}</TableCell>
                            <TableCell>
                              <Stepper alternativeLabel activeStep={stepsCompleted} connector={<QontoConnector />}>
                                {steps.map((label) => (
                                  <Step key={label}>
                                    <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
                                  </Step>
                                ))}
                              </Stepper>
                            </TableCell>
                            <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                              <div><Button size='small' onClick={() => handleEditActivity(row, projectActivities[index].activity.name)} style={{ background: "#314293", color: "#FFFFFF" }} variant="contained" className={classes.button}>{"Detail"}</Button> </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={pageLimits}
                  component="div"
                  count={totalCount}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </Paper>
            </div>
          }
        </div >
      }

      { showSelectDivision && <SelectPlace closeAction={closeSelectPlaceDialogAction} onSelect={onSelectDivision} project={props.project} parent={""} items={divisions} type={"division"} mode={"add"} />}
      { showRemoveDivision && <SelectPlace closeAction={closeSelectPlaceDialogAction} onSelect={onSelectDivision} project={props.project} orginalItems={divisions} items={projectDivisions} type={"division"} mode={"remove"} />}

      { showSelectSubDivision && <SelectPlace closeAction={closeSelectPlaceDialogAction} onSelect={onSelectSubDivision} project={props.project} parent={projectDivisions[currentDivision].place} items={subDivisions} type={"subdivision"} mode={"add"} />}
      { showRemoveSubDivision && <SelectPlace closeAction={closeSelectPlaceDialogAction} onSelect={onSelectSubDivision} project={props.project} orginalItems={subDivisions} items={projectSubDivisions} type={"subdivision"} mode={"remove"} />}

      { showSelectSection && <SelectPlace closeAction={closeSelectPlaceDialogAction} onSelect={onSelectSection} project={props.project} parent={projectSubDivisions[currentSubDivision].place} items={sections} type={"section"} mode={"add"} />}
      { showRemoveSection && <SelectPlace closeAction={closeSelectPlaceDialogAction} onSelect={onSelectSection} project={props.project} orginalItems={sections} items={projectSections} type={"section"} mode={"remove"} />}

      { showSelectFeeder && <SelectPlace closeAction={closeSelectPlaceDialogAction} onSelect={onSelectFeeder} project={props.project} parent={projectSections[currentSection].place} items={feeders} type={"feeder"} mode={"add"} />}
      { showRemoveFeeder && <SelectPlace closeAction={closeSelectPlaceDialogAction} onSelect={onSelectFeeder} project={props.project} orginalItems={feeders} items={projectFeeders} type={"feeder"} mode={"remove"} />}

      { showAddActivityDialog && (projectFeeders.length > 0) && (currentFeeder !== -1) &&
        <SelectActivity closeAction={closeAddActivityAction} onSavedAction={onNewActivitySavedAction} project={props.project} items={activities} feeder_ref_id={projectFeeders[currentFeeder].place} />}

      { showEditActivityDialog && <UpdateActivity closeAction={closeEditActivityAction} deleteAction={deleteActivityAction} onSavedAction={onEditActivitySavedAction} activityName={activityName} activity={selectedActivity} />}
      <Snackbar open={showError} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>

      <Backdrop className={classes.backdrop} open={showBackdrop} onClick={handleCloseBackDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>

    </div >
  );
}
