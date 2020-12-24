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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AddImage from '@material-ui/icons/Add';
import SelectPlace from './selectPlace';
import SelectActivity from './selectActivity';
import AddFeeder from './addFeeder';
import EditFeeder from './editFeeder';
import Chip from '@material-ui/core/Chip';

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
    { id: 'survey', numeric: false, disablePadding: false, label: 'Survey' },
    { id: 'installation', numeric: false, disablePadding: false, label: 'Installation' },
    { id: 'commissioning', numeric: false, disablePadding: false, label: 'Commissioning & Testing' },
    { id: 'acceptance', numeric: false, disablePadding: false, label: 'Acceptance' },
    { id: 'handover', numeric: false, disablePadding: false, label: 'Hand Over' },
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
            {<IconButton color="primary" aria-label="upload picture" component="span" onClick={props.onClick}>
              <AddImage />
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
  const [activities, setActivities] = React.useState([]);

  const [projectDivisions, setProjectDivisions] = React.useState([]);
  const [projectSubDivisions, setProjectSubDivisions] = React.useState([]);
  const [projectSections, setProjectSections] = React.useState([]);
  const [projectActivities, setProjectActivities] = React.useState([]);

  const [currentDivision, setCurrentDivision] = React.useState(-1);
  const [currentSubDivision, setCurrentSubDivision] = React.useState(-1);
  const [currentSection, setCurrentSection] = React.useState(-1);
  const [currentActivity, setCurrentActivity] = React.useState(-1);

  const [showSelectDivision, setShowSelectDivision] = React.useState(false);
  const [showSelectSubDivision, setShowSelectSubDivision] = React.useState(false);
  const [showSelectSection, setShowSelectSection] = React.useState(false);
  const [showSelectActivity, setShowSelectActivity] = React.useState(false);

  const [showAddFeederDialog, setShowAddFeederDialog] = React.useState(false);
  const [showEditFeederDialog, setShowEditFeederDialog] = React.useState(false);

  const [selectedFeeder, setSelectedFeeder] = React.useState(null);
  const [currentProj, setCurrentProj] = React.useState(null);

  const [showBackdrop, setShowBackdrop] = React.useState(false);

  const pageLimits = [10, 25, 50];
  let offset = 0;

  async function getProject() {
    try {
      let url = config["baseurl"] + "/api/project/details";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      axios.defaults.headers.common['_id'] = props.project._id;
      const { data } = await axios.get(url);
      delete axios.defaults.headers.common['_id'];
      console.log(data);

      const dateFns = new DateFnsUtils();
      data.startdate_conv = dateFns.date(data.startdate);
      data.exp_enddate_conv = dateFns.date(data.exp_enddate);

      setCurrentProj(data);
      props.setProject(data);

      getDivisionList();
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
    setActivities([]);
    setProjectActivities([]);
    setCurrentActivity(-1);

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
    setActivities([]);
    setProjectActivities([]);
    setCurrentActivity(-1);

    console.log("getDivisionListForProject called");
    try {
      setShowBackdrop(true);
      console.log("page: ", page);
      let url = config["baseurl"] + "/api/projectPlace/list?type=division&project=" + currentProj._id + "&count=" + 10000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      // console.log(data);

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
    setActivities([]);
    setProjectActivities([]);
    setCurrentActivity(-1);

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
    setActivities([]);
    setProjectActivities([]);
    setCurrentActivity(-1);

    console.log("getSubDivisionListForProject called");
    try {
      setShowBackdrop(true);
      console.log("page: ", page);
      const divisionIndex = currentDivision === -1 ? 0 : currentDivision;
      let url = config["baseurl"] + "/api/projectPlace/list?type=subdivision&project=" + currentProj._id + "&count=" + 10000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);
      // console.log(data);

      let filtered = [];
      for (let i = 0; i < data.list.docs.length; ++i) {
        const t = data.list.docs[i].place;
        for (let k = 0; k < subDivisions.length; ++k) {
          if (t === subDivisions[k]._id)
            filtered.push(subDivisions[k]);
        }
      }
      setProjectSubDivisions(filtered);
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
    setActivities([]);
    setProjectActivities([]);
    setCurrentActivity(-1);

    console.log("getSectionList called");
    try {
      setShowBackdrop(true);
      // console.log("page: ", page);

      const index = currentSubDivision === -1 ? 0 : currentSubDivision;

      let url = config["baseurl"] + "/api/section/list?subdivision=" + subDivisions[index]._id + "&count=" + 1000 + "&offset=" + 0 + "&search=" + "";
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
    setActivities([]);
    setProjectActivities([]);
    setCurrentActivity(-1);

    console.log("getSectionListForProject called");
    try {
      setShowBackdrop(true);
      // console.log("page: ", page);

      const index = currentSubDivision === -1 ? 0 : currentSubDivision;
      let url = config["baseurl"] + "/api/projectPlace/list?type=section&project=" + currentProj._id + "&count=" + 10000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);

      let filtered = [];
      for (let i = 0; i < data.list.docs.length; ++i) {
        const t = data.list.docs[i].place;
        for (let k = 0; k < sections.length; ++k) {
          if (t === sections[k]._id)
            filtered.push(sections[k]);
        }
      }

      setProjectSections(filtered);
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

  async function getActivitiesList() {
    setActivities([]);
    setProjectActivities([]);
    setCurrentActivity(-1);

    console.log("getActivitiesList called");
    try {
      setShowBackdrop(true);
      // console.log("page: ", page);

      const index = currentSubDivision === -1 ? 0 : currentSubDivision;

      let url = config["baseurl"] + "/api/activity/list?count=" + 10000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);

      setActivities(data.list.docs);

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

  async function getActivitiesListForProject() {
    setProjectActivities([]);
    setCurrentActivity(-1);

    console.log("getActivitiesListForProject called");
    try {
      setShowBackdrop(true);
      // console.log("page: ", page);

      const index = currentSubDivision === -1 ? 0 : currentSubDivision;
      let url = config["baseurl"] + "/api/projectactivity/list?section=" + projectSections[currentSection]._id + "&project=" + currentProj._id + "&count=" + 10000 + "&offset=" + 0 + "&search=" + "";
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);

      let filtered = [];
      for (let i = 0; i < data.list.docs.length; ++i) {
        const t = data.list.docs[i].activity;
        for (let k = 0; k < activities.length; ++k) {
          if (t === activities[k]._id)
            filtered.push(activities[k]);
        }
      }

      setProjectActivities(filtered);
      setCurrentActivity(0);

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

  const getFeeders = async (nRows, search = "") => {
    console.log("getFeeders called");
    setRows([]);
    if (projectActivities.length === 0 || currentActivity === -1)
      return;
    console.log("getFeeders called 2");
    console.log("projectActivities: ", projectActivities);
    console.log("currentActivity: ", currentActivity);
    console.log("projectActivities[currentActivity]._id: ", projectActivities[currentActivity]._id);
    try {
      setShowBackdrop(true);
      // console.log("page: ", page);      

      let url = config["baseurl"] + "/api/work/list?activity_ref_id=" + projectActivities[currentActivity]._id + "&count=" + nRows + "&offset=" + offset + "&search=" + search;
      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
      const { data } = await axios.get(url);

      setTotalCount(data.list.totalDocs);
      let newRows = [];
      for (let i = 0; i < data.list.docs.length; ++i) {
        newRows.push(createData((offset + i + 1),
          data.list.docs[i]
        ));
      }

      console.log(newRows);

      setRows(newRows);

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


    getProject();

  }, []);

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
      getActivitiesList();
  }, [projectSections, currentSection]);

  useEffect(() => {
    if (activities.length > 0)
      getActivitiesListForProject();
  }, [activities]);

  useEffect(() => {
    if (projectActivities.length > 0)
      getFeeders(rowsPerPage);
  }, [projectActivities, currentActivity]);

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
    getFeeders(rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    offset = 0;
    getFeeders(newRowsPerPage);
  };

  const handleEditFeeder = (data) => {
    console.log("handleEditFeeder: ", data);

    setSelectedFeeder(data);
    setShowEditFeederDialog(true);
  };

  const handleAddFeeder = () => {
    setShowAddFeederDialog(true);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const BorderLinearProgress = withStyles((theme) => ({
    root: {
      height: 10,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
      borderRadius: 5,
      backgroundColor: '#1a90ff',
    },

  }))(LinearProgress);

  const getStringForArray = (data) => {
    let val = "";
    for (let i = 0; i < data.length; ++i) {
      if (i > 0)
        val += ", ";
      val += data[i];
    }
    return val;
  }

  const onSearchChange = (event) => {
    console.log(event.target.value);

    getFeeders(rowsPerPage, event.target.value);
  };

  const onDetails = (index) => {

  };

  const handleCloseBackDrop = () => {

  };

  const getCustomer = (customerId) => {
    for (let i = 0; i < props.customers.length; ++i) {
      if (props.customers[i]._id === customerId)
        return props.customers[i].name;
    }
    return customerId;
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

  const handleActivityClick = (event, index) => {
    setCurrentActivity(index);
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

  const addActivity = () => {
    setShowSelectActivity(true);
  };

  const closeSelectPlaceDialogAction = () => {
    setShowSelectDivision(false);
    setShowSelectSubDivision(false);
    setShowSelectSection(false);
    setShowSelectActivity(false);
  };

  const onSelectDivision = () => {
    setShowSelectDivision(false);
    getDivisionListForProject();
  };

  const onSelectSubDivision = () => {
    setShowSelectSubDivision(false);
    getSubDivisionListForProject();
  };

  const onSelectSection = () => {
    setShowSelectSection(false);
    getSectionListForProject();
  };

  const onSelectActivity = () => {
    setShowSelectActivity(false);
    getActivitiesListForProject();
  };

  const getDivisionName = (place) => {
    for (let i = 0; i < divisions.length; ++i) {
      if (divisions[i]._id === place)
        return divisions[i].name;
    }
    return place;
  };

  const closeAddFeederAction = () => {
    setShowAddFeederDialog(false);
  };

  const onNewFeederSavedAction = () => {
    setShowAddFeederDialog(false);
    getFeeders(rowsPerPage);
  };

  const closeEditFeederAction = () => {
    setShowEditFeederDialog(false);
  };

  const deleteFeederAction = async () => {
    setShowEditFeederDialog(false);

    try {
      setShowBackdrop(true);
      let url = config["baseurl"] + "/api/work/delete";

      let postObj = {};
      postObj["_id"] = selectedFeeder._id;

      axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");

      const response = await axios.post(url, postObj);

      console.log("successfully Saved");
      setShowBackdrop(false);

      getFeeders(rowsPerPage);
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

  const onEditFeederSavedAction = () => {
    setShowEditFeederDialog(false);
    getFeeders(rowsPerPage);
  };

  const getFeederStatus = (status) => {
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

  const getFeederColor = (status) => {
    let retStatus = "red";
    switch (status) {
      case 0:
        retStatus = "red";
        break;
      case 1:
        retStatus = "orange";
        break;
      case 2:
        retStatus = "green";
        break;
    }

    return retStatus;
  };

  const handleProjectEdit = () => {
    props.history.push("/editproject");
  };

  const handleOpenDoc = (index) => {
    const file = currentProj.docs[index];
    console.log(file);
    window.open(file.path, '_blank');
  };

  return (
    <div className={clsx(classes.root)}>
      {props.refreshUI &&
        <div>
          {/* <PDFDownloadLink document={<Quixote />} fileName="somename.pdf">
            {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
          </PDFDownloadLink> */}
          <div className={classes.paper}>
            <EnhancedTableToolbar title={lstrings.Projects} />
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" onClick={handleBreadCrumClick}>
                {"Projects"}
              </Link>
              <Typography color="textPrimary">{props.project.name}</Typography>
            </Breadcrumbs>

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

                  {currentProj &&
                    <TableBody>
                      <TableRow hover tabIndex={-1} key={"1"}>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'} >{currentProj.code}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{currentProj.name}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{getCustomer(currentProj.customer)}</span></TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{currentProj.status}</span></TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{currentProj.startdate_conv.toDateString()}</span></TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{currentProj.exp_enddate_conv.toDateString()}</span></TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}><span>{currentProj.remark}</span></TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                          {currentProj.docs.map((file, index) => {
                            return (<Chip style={{ marginTop: 5, marginRight: 5 }} key={"chip" + index} label={file.name} clickable variant="outlined" onClick={() => handleOpenDoc(index)} />);
                          })}
                        </TableCell>

                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                          <div><Button onClick={() => handleProjectEdit()} style={{ background: "#314293", color: "#FFFFFF" }} variant="contained" className={classes.button}>{lstrings.Edit}</Button></div>
                        </TableCell>

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
                        <EnhancedTableHeadSmall title="Division" onClick={addDivision} />
                        <TableBody>
                          {projectDivisions.map((row, index) => {
                            return (
                              <TableRow hover tabIndex={-1} key={"" + index} selected={index === currentDivision} onClick={(event) => handleDivisionsClick(event, index)} >
                                <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + (index + 1) + ". " + getDivisionName(row.place)}</TableCell>
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
                        <EnhancedTableHeadSmall title="SubDivision" onClick={addSubDivision} />
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
                        <EnhancedTableHeadSmall title="Section" onClick={addSection} />
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
                        <EnhancedTableHeadSmall title="Activity" onClick={addActivity} />
                        <TableBody>
                          {projectActivities.map((row, index) => {
                            return (
                              <TableRow hover tabIndex={-1} key={"" + index} selected={index === currentActivity} onClick={(event) => handleActivityClick(event, index)} >
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
            (projectActivities.length > 0) &&
            <div className={classes.paper}>
              <Paper className={classes.grid}>
                <Grid container spacing={2}>
                  <Grid item className={classes.totalAttendes}>
                    {/* <img src={ProjectsImage} width='25' alt="" /> */}
                    <h1 className={classes.h1}>{totalCount}</h1>
                    <span>{"Feeders"}</span>
                  </Grid>
                  <Grid item className={classes.addButton}>
                    <Button onClick={() => handleAddFeeder()} style={{ background: "#314293", color: "#FFFFFF" }} variant="contained" className={classes.button}>{"Add Feeder"}</Button>
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
                      {rows.map((row, index) => {
                        const isItemSelected = isSelected(row.name);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return (
                          <TableRow hover tabIndex={-1} key={row.slno}>
                            <TableCell align={dir === 'rtl' ? 'right' : 'left'} component="th" id={labelId} scope="row" padding="none">{row.slno}</TableCell>
                            <TableCell align={dir === 'rtl' ? 'right' : 'left'} >{row.data.name}</TableCell>
                            <TableCell align={dir === 'rtl' ? 'right' : 'left'} style={{ color: getFeederColor(row.data.step_status[0]) }}>{getFeederStatus(row.data.step_status[0])}</TableCell>
                            <TableCell align={dir === 'rtl' ? 'right' : 'left'} style={{ color: getFeederColor(row.data.step_status[1]) }}>{getFeederStatus(row.data.step_status[1])}</TableCell>
                            <TableCell align={dir === 'rtl' ? 'right' : 'left'} style={{ color: getFeederColor(row.data.step_status[2]) }}>{getFeederStatus(row.data.step_status[2])}</TableCell>
                            <TableCell align={dir === 'rtl' ? 'right' : 'left'} style={{ color: getFeederColor(row.data.step_status[3]) }}>{getFeederStatus(row.data.step_status[3])}</TableCell>
                            <TableCell align={dir === 'rtl' ? 'right' : 'left'} style={{ color: getFeederColor(row.data.step_status[4]) }}>{getFeederStatus(row.data.step_status[4])}</TableCell>
                            <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                              <div><Button size='small' onClick={() => handleEditFeeder(row.data)} style={{ background: "#314293", color: "#FFFFFF" }} variant="contained" className={classes.button}>{lstrings.Edit}</Button> </div>
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

      { showSelectDivision && <SelectPlace closeAction={closeSelectPlaceDialogAction} onSelect={onSelectDivision} project={currentProj} items={divisions} type={"division"} />}
      { showSelectSubDivision && <SelectPlace closeAction={closeSelectPlaceDialogAction} onSelect={onSelectSubDivision} project={currentProj} items={subDivisions} type={"subdivision"} />}
      { showSelectSection && <SelectPlace closeAction={closeSelectPlaceDialogAction} onSelect={onSelectSection} project={currentProj} items={sections} type={"section"} />}
      { showSelectActivity && (projectSections.length > 0) && <SelectActivity closeAction={closeSelectPlaceDialogAction} onSelect={onSelectActivity} project={currentProj} items={activities} type={"activity"} section={projectSections[currentSection]} projectActivities={projectActivities} />}
      { showAddFeederDialog && (projectActivities.length > 0) && (currentActivity !== -1) && <AddFeeder closeAction={closeAddFeederAction} onSavedAction={onNewFeederSavedAction} activity_ref_id={projectActivities[currentActivity]._id} />}
      { showEditFeederDialog && <EditFeeder closeAction={closeEditFeederAction} deleteAction={deleteFeederAction} onSavedAction={onEditFeederSavedAction} feeder={selectedFeeder} />}
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
