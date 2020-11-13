import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import LogoIcon from '../assets/svg/logos/logo.svg';
import Tick from '../assets/svg/ss/tick.svg';


const useStyles = makeStyles((theme) => ({
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    lists: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
    },
    h4: {
        marginTop: '0px',
        marginBottom: '10px',
        color: '#004D6D'
    },
    h2: {
        textAlign: 'center'
    },
    listText: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'start',
        marginBottom: '20px'
    },
    tickImg: {
        marginRight: '10px'
    }
}));

export default function CoverPage() {
    const classes = useStyles();
    return (
        <Grid container>
            <Grid item xs={false} sm={false} md={1} />
            <Grid item xs={false} sm={12} md={10}>
                <div className={classes.paper}>
                    <img src={LogoIcon} width='250' alt="" />
                    <h2 className={classes.h2}>Project Management for<br></br>Smart Executives</h2>
                    <ListItem className={classes.lists}>
                        <ListItemText>
                            <div className={classes.listText}>
                                <img src={Tick} width='20' alt="" className={classes.tickImg} />
                                <div>
                                    <h4 className={classes.h4}>Project Mangement</h4>
                                    <span>
                                        ...
                                    </span>
                                </div>
                            </div>
                        </ListItemText>

                        <ListItemText>
                            <div className={classes.listText}>
                                <img src={Tick} width='20' alt="" className={classes.tickImg} />
                                <div>
                                    <h4 className={classes.h4}>Procurement</h4>
                                    <span>
                                        ...
                                    </span>
                                </div>
                            </div>
                        </ListItemText>

                        <ListItemText>
                            <div className={classes.listText}>
                                <img src={Tick} width='20' alt="" className={classes.tickImg} />
                                <div>
                                    <h4 className={classes.h4}>Warehouse Management</h4>
                                    <span>
                                        ...
                                    </span>
                                </div>
                            </div>
                        </ListItemText>
                        <ListItemText>
                            <div className={classes.listText}>
                                <img src={Tick} width='20' alt="" className={classes.tickImg} />
                                <div>
                                    <h4 className={classes.h4}>Task Management and Live Location based Tracking</h4>
                                    <span>
                                        ...
                                    </span>
                                </div>
                            </div>
                        </ListItemText>
                        <ListItemText>
                            <div className={classes.listText}>
                                <img src={Tick} width='20' alt="" className={classes.tickImg} />
                                <div>
                                    <h4 className={classes.h4}>Vendor Management</h4>
                                    <span>
                                        ...
                                    </span>
                                </div>
                            </div>
                        </ListItemText>
                    </ListItem>
                </div>
            </Grid>
            <Grid item xs={false} sm={false} md={1} />

        </Grid>
    );
}
