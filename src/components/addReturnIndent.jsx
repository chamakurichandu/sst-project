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
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import AddImage from '@material-ui/icons/Add';
import SelectItem from './selectItem';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import cloneDeep from 'lodash/cloneDeep';
import ConfirmDelete from "./confirmDelete";


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

function EnhancedTableHeadSmall(props) {
    const dir = document.getElementsByTagName('html')[0].getAttribute('dir');
    const setDir = (dir === 'rtl' ? true : false);
  
    const headCells = [
      { id: 'name', numeric: false, disablePadding: false, label: props.title },
      { id: 'description', numeric: false, disablePadding: false, label: "Description" },
      { id: 'uom', numeric: false, disablePadding: false, label: "UOM" },
      { id: 'qty', numeric: true, disablePadding: false, label: "Qty" }
    ];
  
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell, index) => (
            <TableCell key={headCell.id} align={!setDir ? 'left' : 'right'} padding='none' sortDirection={false} >
              {headCell.label}
              {/* {index === 0 && <IconButton color="primary" aria-label="upload picture" component="span" onClick={props.onClick}>
                <AddImage />
              </IconButton>} */}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
export default function AddReturnIndent(props) {

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
    const [warehouses, setWarehouses] = React.useState([]);
    const [currentWarehouse, setCurrentWarehouse] = React.useState([]);
    const [warehouse_error, set_warehouse_error] = React.useState(null);

    const [customers, setCustomers] = React.useState([]);
    const [customer_error, set_customer_error] = React.useState(null);
    const [currentCustomer, setCurrentCustomer] = React.useState(-1);

    const [remarks, set_remarks] = React.useState('');
    const [files, set_files] = React.useState([]);

    const [contactingServer, setContactingServer] = React.useState(false);
    const [uoms, set_uoms] = React.useState([]);
    const [allItems, set_allItems] = React.useState([]);
    const [showSelectItem, setShowSelectItem] = React.useState(false);
    const [items_error, set_items_error] = React.useState(null);

    const [showBackDrop, setShowBackDrop] = React.useState(false);
    const [items, set_items] = React.useState([]);
    async function getList() {
        try {
            let url = config["baseurl"] + "/api/warehouse/list";
            axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
            const { data } = await axios.get(url);
            setWarehouses(data.list);
        }
        catch (e) {
            console.log("Error in getting users list");
            setErrorMessage("Error in getting users list");
            setShowError(true);
        }
    }

    useEffect(() => {
        getList();
    }, []);
    useEffect(() => {
        console.log(items)
    }, [items]);
    async function getReleaseItemsList() {
      try {
        setShowBackDrop(true);
        let url = config["baseurl"] + "/api/releasetransaction/materialsforproject?project=" + props.project._id;
        axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
        const { data } = await axios.get(url);
        console.log(data);
  
        set_items(data.list);
        setShowBackDrop(false);
      }
      catch (e) {
        setShowBackDrop(false);
        console.log("Error in getting all items");
        setErrorMessage("Error in getting all items");
        setShowError(true);
      }
    }

    async function getUOMList() {
        try {
          setShowBackDrop(true);
          let url = config["baseurl"] + "/api/uom/list";
          axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
          const { data } = await axios.get(url);
          set_uoms(data.list);
          setShowBackDrop(false);
        }
        catch (e) {
          console.log("Error in getting UOMs list");
          setErrorMessage("Error in getting UOMs list");
          setShowError(true);
          setShowBackDrop(false);
        }
      }
      useEffect(() => {
        if(props.project){
          getReleaseItemsList();
        getUOMList();
      }
    }, [props.project]);
     
    const set_item_qty_for = (value, index) => {
        console.log(value + "--" + index);
        let newItems = [...items];
        newItems[index].qty = value;
        set_items(newItems);
      };
    
      const set_item_rate_for = (value, index) => {
        let newItems = [...items];
        newItems[index].rate = value;
        set_items(newItems);
      };
    
      const getuomFor = (value) => {
        for (let i = 0; i < uoms.length; ++i) {
          if (value === uoms[i]._id)
            return uoms[i].name;
        }
        return value;
      }
      const handleScheduleDateChange = (value, index) => {
        let newItems = [...items];
        newItems[index].scheduled_date = value;
        set_items(newItems);
      };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowError(false);
    };

    const handleCancel = () => {
        props.history.push("/returnindents");
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

    const addItem = () => {
        setShowSelectItem(true);
      };
    
      const closeSelectItemDialogAction = () => {
        setShowSelectItem(false);
      };
      const onSelectItem = (newitem) => {
        setShowSelectItem(false);
        for (let i = 0; i < items.length; ++i) {
          newitem = newitem.filter(ii => ii._id !== items[i]._id);
        };
    
        if(newitem.length > 0) {
          newitem = newitem.map(ii => {
            let newCopy = cloneDeep(ii);
            newCopy.scheduled_date = new Date();
            newCopy.qty=0;
            return newCopy;
          });
          set_items([...items, ...newitem]);
          set_items_error(null);
        } else {
          setShowError(true);
          setErrorMessage('Already existing materials selected');
        }
        
      };
      // const onSelectItem = (newitem) => {
      //   setShowSelectItem(false);
    
      //   let newCopy = cloneDeep(newitem);
      //   newCopy.scheduled_date = new Date();
      //   newCopy.rate = 0;
      //   newCopy.qty = 0;
    
      //   let newItems = [...items, newCopy];
      //   set_items(newItems);
      // };
    
    const handleSave = async (e) => {
        e.preventDefault();

        try {
            setContactingServer(true);
            let url = config["baseurl"] + "/api/returnindent/add";
            console.log(currentWarehouse);
            console.log(warehouses);

            let postObj = {};
            postObj["warehouse"] = warehouses.find(warehouse => warehouse._id === currentWarehouse)._id;
            postObj["project"] = props.project._id;
            postObj["materials"] = items.map((item,i)=>{
                return {id:item._id,qty:item.qty}
            })
            
            console.log("postObj: ", postObj);

            axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
            const response = await axios.post(url, postObj);
            console.log("successfully Saved");
            setContactingServer(false);
            props.history.push("/returnindents");
        }
        catch (e) {
            if (e.response) {
                console.log("Error in creating");
                setErrorMessage(e.response.data["message"]);
            }
            else {
                console.log("Error in creating" + e);
                setErrorMessage("Error in creating: ", e.message);
            }
            setShowError(true);
            setContactingServer(false);
        }
    };
    const handleCloseBackDrop = () => {

    };

    const warehouseById = (id) => {
        return warehouses.filter(warehouse => warehouse._id === id)[0]?.name;
    }

    const handleWarehouseChange = event => {
        console.log(event.target.value);
        setCurrentWarehouse(event.target.value);
        set_warehouse_error(null)
    }

    const handleCustomerChange = (event) => {
        setCurrentCustomer(event.target.value);
        set_customer_error(null);
    };

    return (
        <div className={clsx(classes.root)}>
            {props.refreshUI &&

                <div className={classes.paper}>

                    <EnhancedTableToolbar title={"Add Return Indent"} />

                      <form className={classes.papernew} autoComplete="off" noValidate>

                        <FormControl size="small" variant="outlined" className={classes.formControl}>
                            <InputLabel id="warehouses-select-label">Warehouse *</InputLabel>
                            <Select
                                labelId="warehouse-select-label"
                                id="warehouse-select-label"
                                value={currentWarehouse === -1 ? "" : currentWarehouse}
                                onChange={handleWarehouseChange}
                                label="Warehouse *"
                               
                            >
                                {warehouses.map((row, index) => {
                                    return (
                                        <MenuItem key={"" + index} value={row._id}>
                                            <ListItemText primary={row.name} />
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                        
                        {customer_error && <Alert className={classes.alert} severity="error"> {customer_error} </Alert>}
                        <Paper className={classes.paper} style={{ marginTop: 10 }}>
            <TableContainer className={classes.container}>
              <Table className={classes.smalltable} stickyHeader aria-labelledby="tableTitle" size='small' aria-label="enhanced table" >
                <EnhancedTableHeadSmall title="Purchase Items" onClick={addItem} />
                <TableBody>
                  {items.map((row, index) => {
                    return (
                      <TableRow hover tabIndex={-1} key={"" + index} >
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + (index + 1) + ". " + row.details.name}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{"" + (index + 1) + ". " + row.details.description}</TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{getuomFor(row.details.uomId)}</TableCell>
                        {/* <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                          <MuiPickersUtilsProvider utils={DateFnsUtils} >
                            <DatePicker size="small" label="Schedule Date" inputVariant="outlined" format="dd/MM/yyyy" value={row.scheduled_date} onChange={(newDate) => handleScheduleDateChange(newDate, index)} />
                          </MuiPickersUtilsProvider>
                        </TableCell> */}
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>{console.log(row.qty)}
                          <TextField size="small" id={"formControl_qty_" + index} type="number" value={row.qty}
                            variant="outlined" onChange={(event) => { set_item_qty_for(event.target.value, index) }} />
                        </TableCell>
                        <TableCell align={dir === 'rtl' ? 'right' : 'left'}>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
                        <div className={classes.submit}>
                            <Button variant="contained" color="primary" onClick={handleCancel} disabled={contactingServer}>Cancel</Button>
                            <Button style={{ marginLeft: 10 }} variant="contained" color="primary" onClick={handleSave} disabled={contactingServer}>Save</Button>
                        </div>

                    </form>
                </div>
            }
            { showSelectItem && <SelectItem closeAction={closeSelectItemDialogAction} onSelect={onSelectItem} items={allItems} type={"Purchasable Items"} />}
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