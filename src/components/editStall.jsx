import React, { useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
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
import exhibitorsLogo from '../assets/svg/ss/exhibition.svg';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import AddSalesPerson from './addSalesPerson';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const Joi = require('joi');

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function createData(slno, exhibitor_name, website, status, stall_id, logo_url) {
  return { slno, exhibitor_name, website, status, stall_id, logo_url };
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

function EnhancedTableHead(props) {
  const dir = document.getElementsByTagName('html')[0].getAttribute('dir');
  const setDir = (dir === 'rtl' ? true : false);

  const headCells = [
    { id: 'slno', numeric: true, disablePadding: true, label: 'SL NO' },
    { id: 'sales_person_name', numeric: false, disablePadding: false, label: 'Sales Person Name' },
    { id: 'designation', numeric: false, disablePadding: false, label: 'Designation' },
    // { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'action', numeric: false, disablePadding: false, label: 'Action' },
  ];
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  // const createSortHandler = (property) => (event) => {
  //   onRequestSort(event, property);
  // };
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
            // onClick={createSortHandler(headCell.id)}
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

export default function EditStall(props) {

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
    h1: {
      margin: '0px',
      paddingRight: '10px',
      paddingLeft: '10px'
    },

  }));

  const classes = useStyles();
  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const [totalSalesPeople, setTotalSalesPeople] = React.useState(0);
  const [salesPeopleRows, setSalesPeopleRows] = React.useState([]);
  const [showAddSalesPerson, setShowAddSalesPerson] = React.useState(false);

  const [company_display_name, set_company_display_name] = React.useState(props.stallInfo["company_display_name"]);
  const [website_url, set_website_url] = React.useState(props.stallInfo["website_url"]);
  const [email, set_email] = React.useState(props.stallInfo["email"]);
  const [display_phone_number, set_display_phone_number] = React.useState(props.stallInfo["display_phone_number"]);
  const [logo_url, set_logo_url] = React.useState(props.stallInfo["logo_url"]);
  const [brochure_url, set_brochure_url] = React.useState(props.stallInfo["brochure_url"]);
  const [video1_url, set_video1_url] = React.useState(props.stallInfo["video1_url"]);
  const [video2_url, set_video2_url] = React.useState(props.stallInfo["video2_url"]);
  const [banner1_url, set_banner1_url] = React.useState(props.stallInfo["banner1_url"]);
  const [banner2_url, set_banner2_url] = React.useState(props.stallInfo["banner2_url"]);
  const [banner3_url, set_banner3_url] = React.useState(props.stallInfo["banner3_url"]);
  const [banner4_url, set_banner4_url] = React.useState(props.stallInfo["banner4_url"]);
  const [whatsapp_link, set_whatsapp_link] = React.useState(props.stallInfo["whatsapp_link"]);
  const [facebookpage_link, set_facebookpage_link] = React.useState(props.stallInfo["facebookpage_link"]);
  const [twitterpage_link, set_twitterpage_link] = React.useState(props.stallInfo["twitterpage_link"]);
  const [instagrampage_link, set_instagrampage_link] = React.useState(props.stallInfo["instagrampage_link"]);

  const [contactingServer, setContactingServer] = React.useState(false);
  const [company_display_name_error, set_company_display_name_error] = React.useState(null);
  const [website_url_error, set_website_url_error] = React.useState(null);
  const [email_error, set_email_error] = React.useState(null);
  const [display_phone_number_error, set_display_phone_number_error] = React.useState(null);
  const [logo_url_error, set_logo_url_error] = React.useState(null);
  const [brochure_url_error, set_brochure_url_error] = React.useState(null);
  const [video1_url_error, set_video1_url_error] = React.useState(null);
  const [video2_url_error, set_video2_url_error] = React.useState(null);
  const [banner1_url_error, set_banner1_url_error] = React.useState(null);
  const [banner2_url_error, set_banner2_url_error] = React.useState(null);
  const [banner3_url_error, set_banner3_url_error] = React.useState(null);
  const [banner4_url_error, set_banner4_url_error] = React.useState(null);
  const [whatsapp_link_error, set_whatsapp_link_error] = React.useState(null);
  const [facebookpage_link_error, set_facebookpage_link_error] = React.useState(null);
  const [twitterpage_link_error, set_twitterpage_link_error] = React.useState(null);
  const [instagrampage_link_error, set_instagrampage_link_error] = React.useState(null);

  async function getSalesPersonsList() {
    try {
      let url = config["baseurl"] + "/org/" + config["org"] + "/event/" + config["event"] + "/stall/" + props.stallInfo["stall_id"] + "/saleslist";
      const { data } = await axios.get(url);
      console.log(data);
      console.log(data.response);
      setTotalSalesPeople(data.response.length);
      setSalesPeopleRows(data.response);
    }
    catch (e) {
      console.log("Error in getting Exhibitor list");
      setErrorMessage("Error in getting Exhibitor list");
      setShowError(true);
    }
  }

  useEffect(() => {

    console.log("currentExhibitorStallInfo: ", props.stallInfo);
    if (props.stallInfo === null || props.stallInfo["stall_id"] === undefined) {
      console.log("redirecting");
      props.history.push('/exhibitorpanel')
      return;
    }

    getSalesPersonsList();

  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowError(false);
  };

  const handleBreadCrumOrganizationDetailClick = () => {
    props.history.push("/sa-organization-details");
  };

  const handleBreadCrumExhibitorsClick = () => {
    props.history.push("/exhibitorpanel");
  };

  const handleCancel = () => {
    props.history.push("/exhibitorpanel");
  };

  const validateData = () => {
    const schema = Joi.object({
      company_display_name: Joi.string().min(2).max(100).required(),
      logo_url: Joi.string().min(5).max(300).required(),
    });
    const { error } = schema.validate({
      company_display_name: company_display_name.trim(),
      logo_url: logo_url.trim(),
    }, { abortEarly: false });
    const allerrors = {};
    if (error) {
      for (let item of error.details)
        allerrors[item.path[0]] = item.message;
    }

    return allerrors;
  }

  const addSalesPersonAction = () => {
    setShowAddSalesPerson(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    set_company_display_name_error(null);
    set_logo_url_error(null);

    const errors = validateData();

    let errorOccured = false;
    if (errors["company_display_name"]) {
      set_company_display_name_error(errors["company_display_name"]);
      errorOccured = true;
    }
    if (errors["logo_url"]) {
      set_logo_url_error(errors["logo_url"]);
      errorOccured = true;
    }

    if (errorOccured)
      return;

    setContactingServer(true);
    try {
      let sessionData = await Auth.currentSession();
      try {
        let url = config["baseurl"] + "/org/" + config["org"] + "/event/" + config["event"] + "/stall/" + props.stallInfo["stall_id"];
        axios.defaults.headers.common['Authorization'] = sessionData["idToken"]["jwtToken"];

        let postObj = {};
        if (company_display_name.length > 0) postObj["company_display_name"] = company_display_name;
        postObj["website_url"] = website_url;
        postObj["email"] = email;
        postObj["display_phone_number"] = display_phone_number;
        if (logo_url.length > 0) postObj["logo_url"] = logo_url;
        postObj["brochure_url"] = brochure_url;
        postObj["video1_url"] = video1_url;
        postObj["video2_url"] = video2_url;
        postObj["banner1_url"] = banner1_url;
        postObj["banner2_url"] = banner2_url;
        postObj["banner3_url"] = banner3_url;
        postObj["banner4_url"] = banner4_url;
        postObj["whatsapp_link"] = whatsapp_link;
        postObj["facebookpage_link"] = facebookpage_link;
        postObj["twitterpage_link"] = twitterpage_link;
        postObj["instagrampage_link"] = instagrampage_link;

        await axios.patch(url, postObj);

        setContactingServer(false);
        console.log("successfully Saved");
        props.history.push("/exhibitorpanel");
      }
      catch (e) {
        console.log("Error in updating stall info");
        setErrorMessage("Error in updating stall info");
        setContactingServer(false);
        setShowError(true);
      }
    }
    catch (e) {
      console.log("Error in Auth: logout");
      setContactingServer(false);
      props.onAuthFailure();
    }
  };

  const handleCloseAddSalesPerson = () => {
    setShowAddSalesPerson(false);
    getSalesPersonsList();
  };

  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === 'asc';
    // setOrder(isAsc ? 'desc' : 'asc');
    // setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    // if (event.target.checked) {
    //   const newSelecteds = rows.map((n) => n.name);
    //   setSelected(newSelecteds);
    //   return;
    // }
    // setSelected([]);
  };

  const onDelete = (row) => {

  };

  return (
    <div className={clsx(classes.root)}>
      {props.refreshUI &&

        <div className={classes.paper}>

          <EnhancedTableToolbar title={lstrings.EditStall} />

          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" onClick={handleBreadCrumExhibitorsClick}>
              {lstrings.ExhibitorPanel}
            </Link>
            <Typography color="textPrimary">{lstrings.EditStall}</Typography>
          </Breadcrumbs>

          <Paper className={classes.grid}>
            <Grid container spacing={2}>
              <Grid item className={classes.totalAttendes}>
                <img src={exhibitorsLogo} width='25' alt="" />
                <h1 className={classes.h1}>{totalSalesPeople}</h1>
                <span> {lstrings.SalesPersons}</span>
              </Grid>
              <Grid item className={classes.addButton}>
                <Button onClick={() => addSalesPersonAction()} style={{ background: "#314293", color: "#FFFFFF" }} variant="contained" className={classes.button}>{"Add"}</Button>
              </Grid>
            </Grid>
          </Paper>
          <Paper className={classes.grid}>
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={'medium'}
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={classes}
                  numSelected={0}
                  order={'asc'}
                  orderBy={""}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={salesPeopleRows.length}
                />

                <TableBody>
                  {stableSort(salesPeopleRows, getComparator('asc', ""))
                    .map((row, index) => {
                      // const isItemSelected = isSelected(row.name);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          // aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row["user_id"]}
                        // selected={isItemSelected}
                        >
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'} component="th" id={labelId} scope="row" padding="none">
                            {index + 1}
                          </TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                            <div className={classes.flex}>
                              <span>
                                {(row["name"] && row["name"].length > 0) ? row["name"] : "[Sales Person not yet Registered]"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{row.designation}</TableCell>
                          {/* <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{row.email}</TableCell> */}
                          <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                            <Button onClick={() => onDelete(row)} variant="contained" className={classes.button}>Delete</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          <Paper className={classes.grid}>
            <form className={classes.papernew} autoComplete="off" noValidate>
              <TextField className={classes.inputFields} disabled id="formControl_stall_id" defaultValue={props.stallInfo["stall_id"]} label="Stall ID" variant="outlined" />
              <TextField className={classes.inputFields} disabled id="formControl_stall_type" defaultValue={props.stallInfo["stall_type"]} label="Stall Type" variant="outlined" />

              <TextField className={classes.inputFields} id="formControl_company_display_name" defaultValue={company_display_name} label="Company Display Name" variant="outlined" onChange={(event) => { set_company_display_name(event.target.value); set_company_display_name_error(null); }} />
              {company_display_name_error && <Alert className={classes.alert} severity="error"> {company_display_name_error} </Alert>}

              <TextField className={classes.inputFields} id="formControl_website_url" defaultValue={website_url} label="Website url" variant="outlined" onChange={(event) => { set_website_url(event.target.value); set_website_url_error(null); }} />
              {website_url_error && <Alert className={classes.alert} severity="error"> {website_url_error} </Alert>}

              <TextField className={classes.inputFields} id="formControl_email" defaultValue={email} label="Display Email" variant="outlined" onChange={(event) => { set_email(event.target.value); set_email_error(null); }} />
              {email_error && <Alert className={classes.alert} severity="error"> {email_error} </Alert>}

              <TextField className={classes.inputFields} id="formControl_display_phone_number" defaultValue={display_phone_number} label="Display Phone Number" variant="outlined" onChange={(event) => { set_display_phone_number(event.target.value); set_display_phone_number_error(null); }} />
              {display_phone_number_error && <Alert className={classes.alert} severity="error"> {display_phone_number_error} </Alert>}

              <TextField className={classes.inputFields} id="formControl_logo_url" defaultValue={logo_url} label="Logo URL" variant="outlined" onChange={(event) => { set_logo_url(event.target.value); set_logo_url_error(null); }} />
              {logo_url_error && <Alert className={classes.alert} severity="error"> {logo_url_error} </Alert>}

              <TextField className={classes.inputFields} id="formControl_brochure_url" defaultValue={brochure_url} label="Brouchure URL" variant="outlined" onChange={(event) => { set_brochure_url(event.target.value); set_brochure_url_error(null); }} />
              {brochure_url_error && <Alert className={classes.alert} severity="error"> {brochure_url_error} </Alert>}

              <TextField className={classes.inputFields} id="formControl_video1_url" defaultValue={video1_url} label="Video 1 URL" variant="outlined" onChange={(event) => { set_video1_url(event.target.value); set_video1_url_error(null); }} />
              {video1_url_error && <Alert className={classes.alert} severity="error"> {video1_url_error} </Alert>}

              <TextField className={classes.inputFields} id="formControl_video2_url" defaultValue={video2_url} label="Video 2 URL" variant="outlined" onChange={(event) => { set_video2_url(event.target.value); set_video2_url_error(null); }} />
              {video2_url_error && <Alert className={classes.alert} severity="error"> {video2_url_error} </Alert>}

              <TextField className={classes.inputFields} id="formControl_banner1_url" defaultValue={banner1_url} label="Banner 1 URL" variant="outlined" onChange={(event) => { set_banner1_url(event.target.value); set_banner1_url_error(null); }} />
              {banner1_url_error && <Alert className={classes.alert} severity="error"> {banner1_url_error} </Alert>}

              <TextField className={classes.inputFields} id="formControl_banner2_url" defaultValue={banner2_url} label="Banner 2 URL" variant="outlined" onChange={(event) => { set_banner2_url(event.target.value); set_banner2_url_error(null); }} />
              {banner2_url_error && <Alert className={classes.alert} severity="error"> {banner2_url_error} </Alert>}

              <TextField className={classes.inputFields} id="formControl_banner3_url" defaultValue={banner3_url} label="Banner 3 URL" variant="outlined" onChange={(event) => { set_banner3_url(event.target.value); set_banner3_url_error(null); }} />
              {banner3_url_error && <Alert className={classes.alert} severity="error"> {banner3_url_error} </Alert>}

              <TextField className={classes.inputFields} id="formControl_banner4_url" defaultValue={banner4_url} label="Banner 4 URL" variant="outlined" onChange={(event) => { set_banner4_url(event.target.value); set_banner4_url_error(null); }} />
              {banner4_url_error && <Alert className={classes.alert} severity="error"> {banner4_url_error} </Alert>}

              <TextField className={classes.inputFields} id="formControl_whatsapp_link" defaultValue={whatsapp_link} label="Whatsapp Link" variant="outlined" onChange={(event) => { set_whatsapp_link(event.target.value); set_whatsapp_link_error(null); }} />
              {whatsapp_link_error && <Alert className={classes.alert} severity="error"> {whatsapp_link_error} </Alert>}

              <TextField className={classes.inputFields} id="formControl_facebookpage_link" defaultValue={facebookpage_link} label="Facebookpage Link" variant="outlined" onChange={(event) => { set_facebookpage_link(event.target.value); set_facebookpage_link_error(null); }} />
              {facebookpage_link_error && <Alert className={classes.alert} severity="error"> {facebookpage_link_error} </Alert>}

              <TextField className={classes.inputFields} id="formControl_twitterpage_link" defaultValue={twitterpage_link} label="Twitter Link" variant="outlined" onChange={(event) => { set_twitterpage_link(event.target.value); set_twitterpage_link_error(null); }} />
              {twitterpage_link_error && <Alert className={classes.alert} severity="error"> {twitterpage_link_error} </Alert>}

              <TextField className={classes.inputFields} id="formControl_instagrampage_link" defaultValue={instagrampage_link} label="Instagram Link" variant="outlined" onChange={(event) => { set_instagrampage_link(event.target.value); set_instagrampage_link_error(null); }} />
              {instagrampage_link_error && <Alert className={classes.alert} severity="error"> {instagrampage_link_error} </Alert>}

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

      {showAddSalesPerson && <AddSalesPerson stall_id={props.stallInfo["stall_id"]} close={handleCloseAddSalesPerson} />}
    </div >
  );
}
