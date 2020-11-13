import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import EnhancedTableToolbar from './enhancedToolbar';
import Grid from '@material-ui/core/Grid';
import blueImage from '../assets/Images/blueBack.png';
import Image from '../assets/Images/button1.png';
import ManImage from '../assets/svg/ss/man.svg';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import EventIcon from '@material-ui/icons/Event';
import LunchIcon from '../assets/svg/ss/fast-food.svg';
import CalendarIcon from '../assets/svg/ss/calendar.svg';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
        width: 'calc(100%)',
        paddingLeft: 20,
        paddingRight: 20
    },
    grid: {
        padding: theme.spacing(0),
        top: 0,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginBottom: '20px',

    },
    h1: {
        margin: '0px',
        paddingRight: '10px',
        paddingLeft: '10px'
    },
    agendaSession: {
        background: '#42a6c9',
        padding: '10px',
    },
    agendaSessionActive: {
        background: 'green',
        padding: '10px',
    }
}));
function getSteps() {
    return [
        { 'sessionTiming': '09:30 AM - 10:00 AM', 'Title': 'Networking & Welcome Note', 'Likes': '3', 'ProfileImage': ManImage, 'eventIcon': CalendarIcon, Active: true, color: '#ed5d53', buttonColor: '#2d307a', buttonTitle: "Recorded Session" },
        { 'sessionTiming': '10:00 AM - 11:00 AM', 'Title': 'Artificial Intelligence in your day to day life', 'Likes': '0', 'ProfileImage': ManImage, 'eventIcon': CalendarIcon, Active: false, color: '#26afc7', buttonColor: '#2d307a', buttonTitle: "Recorded Session" },
        { 'sessionTiming': '11:00 AM - 12:00 AM', 'Title': 'Neural Networks', 'Likes': '1', 'ProfileImage': ManImage, 'eventIcon': CalendarIcon, Active: false, color: '#42c277', buttonColor: '#2d307a', buttonTitle: "Recorded Session" },
        { 'sessionTiming': '12:00 PM - 01:00 PM', 'Title': 'Augmented Reality and Artificial Intelligence', 'Likes': '2', 'ProfileImage': ManImage, 'eventIcon': CalendarIcon, Active: false, color: '#7267eb', buttonColor: '#2d307a', buttonTitle: "Recorded Session" },
        { 'sessionTiming': '01:00 PM - 02:00 PM', 'Title': 'Lunch Break', 'Likes': '7', 'ProfileImage': ManImage, 'eventIcon': LunchIcon, Active: false, color: '#e35b83', buttonColor: '#2d307a', buttonTitle: "Recorded Session" },
        { 'sessionTiming': '02:00 PM - 03:00 PM', 'Title': 'Virtual Reality', 'Likes': '7', 'ProfileImage': ManImage, 'eventIcon': CalendarIcon, Active: false, color: '#ed5d53', buttonColor: '#2d307a', buttonTitle: "Recorded Session" },
        { 'sessionTiming': '03:00 AM - 04:00 PM', 'Title': 'Spacial points for Augmented Reality', 'Likes': '7', 'ProfileImage': ManImage, 'eventIcon': CalendarIcon, Active: false, color: '#26afc7', buttonColor: '#3e9331', buttonTitle: "Live Session" },
        { 'sessionTiming': '04:00 AM - 05:00 PM', 'Title': 'Gamify every part of software', 'Likes': '7', 'ProfileImage': ManImage, 'eventIcon': CalendarIcon, Active: false, color: '#42c277', buttonColor: '#8e8f8d', buttonTitle: "Upcoming" },
    ];
}

const Agenda = (props) => {
    const steps = getSteps();
    const classes = useStyles();

    const watchAction = (index) => {
        if (index === 6) {
            props.history.push('/auditorium');
        }
    };

    return (<div className={clsx(classes.root)}>
        {props.refreshUI && <div>
            <EnhancedTableToolbar title='Agenda' />
            {steps.map((label, index) => (

                <Paper className={classes.grid} key={label.Title}>
                    <Grid container spacing={2}>
                        <Grid item xs={3} style={{ padding: '0px 8px' }}>
                            <div style={{ background: label.color, padding: '10px', }}>
                                <h3 style={{ color: 'white', margin: '10px' }}>{label.sessionTiming}</h3>
                                <div style={{ borderTop: '1px solid white', padding: '10px' }}>
                                    {/* <img style={{ width: 20, marginRight:'10px' }} src={Image} width='20' alt="" /> */}
                                    {/* <img style={{ width: 20 }} src={Image} width='20' alt="" /> */}
                                    <img style={{ color: 'white', width: 25, height: 25 }} src={label.eventIcon} width='25' height='25' alt="" />
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={9} className={classes.agendaDetails}>
                            <section style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3 style={{ margin: '5px', color: '#737373' }}>{label.Title}</h3>
                                <aside style={{ padding: '0px 20px' }}>
                                    <IconButton aria-label="add to favorites">
                                        <FavoriteIcon />
                                    </IconButton>
                                    <span>{label.Likes}</span>
                                </aside>
                            </section>
                            <section style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <img style={{ width: 40 }} src={label.ProfileImage} width='40' height='40' alt="" />
                                <Button onClick={() => watchAction(index)} style={{ background: label.buttonColor, color: "#FFFFFF", marginRight: 10 }} variant="contained" className={classes.button}>{label.buttonTitle}</Button>
                                {/* <div style={{ marginRight: '20px', background: '#dedede', padding: '10px 30px', borderRadius: '20px', fontWeight: 'bold' }}>Watch Session</div> */}
                            </section>
                        </Grid>
                    </Grid>
                </Paper>
            ))}
        </div>
        }
    </div>);
}

export default Agenda;
