import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import config from "../config.json";

export default function MaterialIndentDetails(props) {

    const dir = document.getElementsByTagName('html')[0].getAttribute('dir');

    const useStyles = makeStyles((theme) => ({
        root: {
            width: 'calc(100%)',
            marginTop: "5em"
        },
        paper: {
            width: '90%',
            margin: '0 auto',
            marginBottom: theme.spacing(2),
            padding: 20,
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
        inputFields: {
            width: "100%",
            margin: "0.5em 0"
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
            paddingLeft: '10px',
            textAlign: 'center'
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

    const [warehouses, setWarehouses] = React.useState([]);
    const [showBackDrop, setShowBackDrop] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [showError, setShowError] = React.useState(false);
    const { indent, project, createdDate_conv } = props.materialIndentsDetails;
    const classes = useStyles();
    async function getWarehouseList() {
        try {
          setShowBackDrop(true);
          let url = config["baseurl"] + "/api/warehouse/list";
          axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
          const { data } = await axios.get(url);
          console.log(data);
          console.log(data.count);
          console.log(data.list);
          setWarehouses(data.list);
          setShowBackDrop(false);
        }
        catch (e) {
          console.log("Error in getting users list");
          setErrorMessage("Error in getting users list");
          setShowError(true);
          setShowBackDrop(false);
        }
      }
    
      useEffect(() => {
    
        getWarehouseList();
    
      }, [props.project]);
    const getWarehouseName = (id) => {
        for (let i = 0; i < warehouses.length; ++i) {
          if (warehouses[i]._id === id) {
            return warehouses[i].name;
          }
        }
        return "Unknown";
      };
    return (
        <div className={clsx(classes.root)}>
            <Typography className={classes.h1} variant="h5" component="div">Material Indents Details</Typography>
            <Paper className={classes.paper}>
                <TextField size="small" className={classes.inputFields} disabled defaultValue={project.name}
                    label="Project Name" variant="outlined" multiline />
                <TextField size="small" className={classes.inputFields} disabled value={getWarehouseName(indent.warehouse)}
                    label="WH Name" variant="outlined" multiline />
                    <TextField size="small" className={classes.inputFields} disabled defaultValue={((parseInt(indent.dispatched) === 1) ? "Released" : "Pending")}
                    label="Status" variant="outlined" multiline />
                <TextField size="small" className={classes.inputFields} disabled defaultValue={indent.code}
                    label="Code" variant="outlined" multiline />
                    <TextField size="small" className={classes.inputFields} disabled defaultValue={project.remark}
                    label="Remarks " variant="outlined" multiline />
                <TextField size="small" className={classes.inputFields} disabled defaultValue={createdDate_conv}
                    label="Created Date" variant="outlined" multiline />
                <div style={{ textAlign: "right" }}>
                    <Button variant="contained" color="primary" onClick={() => props.history.goBack()}>Back</Button>
                </div>
            </Paper>
        </div >
    )
}
