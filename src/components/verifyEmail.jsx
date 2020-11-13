import React, { useRef, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Hidden from '@material-ui/core/Hidden';
import LogoIcon from '../assets/svg/logos/logo.svg';
import CoverPage from './coverPage';
import LanguageSelect from './languageSelect';
import { Auth } from 'aws-amplify';
import lstrings from '../lstrings.js';
import Snackbar from '@material-ui/core/Snackbar';

import lockImage from '../assets/svg/ss/unlock.svg';
import "./auth.js";

const Joi = require('joi');

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <a color="inherit" href="https://someshwara.com/">Someshwara Software Pvt Ltd</a>
            {' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    alert: {
        marginTop: -8
    },
    header: {
        position: 'absolute',
        width: '100%',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0px 10px'
    },
    grid: {
        textAlign: 'center',
        margin: '8px 0px',
        fontWeight: 'bold'
    },
    text: {
        color: '#677788',
        textAlign: 'center',
        margin: '2px 0px !important',
        padding: '0px',
        fontWeight: '500'
    }
}));

export default function VerifyEmail(props) {
    const [contactingServer, setContactingServer] = React.useState(false);
    const classes = useStyles();
    const code = useRef(null);
    const [codeError, setCodeError] = React.useState(null);
    const [email, setEmail] = React.useState(null);
    const [emailVerified, setEmailVerified] = React.useState(false);
    const [alertOpen, setAlertOpen] = React.useState(false);


    const theme = useTheme();
    const [language, setLanguage] = React.useState('en');
    const themeChanged = (event) => {
        setLanguage(event.target.value);
        let direction = 'ltr';
        let lang = event.target.value;
        if (event.target.value === 'ar') {
            direction = 'rtl';
            theme.direction = 'rtl';
            lang = 'ar';
        }
        else if (event.target.value === 'en') {
            direction = 'ltr';
            theme.direction = 'ltr';
            lang = 'en';
        }
        else {
            direction = 'ltr';
            theme.direction = 'ltr';
            lang = 'en';
        }

        document.getElementsByTagName('html')[0].setAttribute("dir", direction);
        lstrings.setLanguage(lang);
    };

    useEffect(() => {
        setEmail(window.localStorage.getItem("username"));
    }, []);

    const validateData = () => {
        const schema = Joi.object({
            code: Joi.string().min(6).pattern(new RegExp('^[0-9]{3,30}$'))
        });
        const { error } = schema.validate({ code: code.current.value.trim() }, { abortEarly: false });
        const allerrors = {};
        if (error) {
            for (let item of error.details)
                allerrors[item.path[0]] = item.message;
        }

        return allerrors;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        setCodeError(null);

        const errors = validateData();

        let errorOccured = false;

        if (errors["code"]) {
            setCodeError(errors["code"]);
            errorOccured = true;
        }

        if (errorOccured)
            return;

        verify();
    };

    const verify = async () => {
        setContactingServer(true);
        try {
            await Auth.confirmSignUp(window.localStorage.getItem("username"), code.current.value);

            setEmailVerified(true);
            // setTimeout(() => {
            //     props.onVerifyEmailSuccess();
            // }, 3);
        } catch (error) {
            console.log('error: ', error);
            setCodeError(lstrings[error.code] ? lstrings[error.code] : error.message);
            setContactingServer(false);
        }
    };

    const resendCode = async () => {
        console.log("resendCode");
        try {
            await Auth.resendSignUp(window.localStorage.getItem("username"));
            console.log('code resent successfully');
            setAlertOpen(true);
        } catch (err) {
            console.log('error resending code: ', err);
        }
    };

    const handleClose = () => {
        setAlertOpen(false);
    };

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />

            <Grid item xs={12} sm={6} className={classes.header}>
                <img src={LogoIcon} width='120' alt="" />
                <LanguageSelect language={language} themeChanged={themeChanged}></LanguageSelect>
            </Grid>

            <Grid item xs={false} sm={6} md={6}>
                <Hidden xsDown>
                    <CoverPage></CoverPage>
                </Hidden>
            </Grid>
            <Grid item xs={12} sm={6} md={6} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <img src={lockImage} width='30px' height='30px' alt=""></img>
                    <Grid container>
                        <Grid item xs={12} className={classes.grid}>
                            <h1>Verify your email</h1>
                        </Grid>
                        <Grid item xs={12} className={classes.text}>
                            We've sent a code to your email address:
                        </Grid>
                        <Grid item xs={12} className={classes.grid}>
                            {email}
                        </Grid>
                        <Grid item xs={12} className={classes.text}>
                            Please enter the code below to continue.
                        </Grid>
                    </Grid>

                    <form className={classes.form} noValidate onSubmit={handleSubmit}>
                        {!emailVerified &&
                            <TextField
                                inputRef={code}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="code"
                                label="Enter Code"
                                name="code"
                                autoComplete="code"
                                autoFocus
                            />
                        }
                        {codeError && <Alert className={classes.alert} severity="error"> {codeError} </Alert>}
                        {!emailVerified && <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={contactingServer}
                        >
                            Next
                        </Button>
                        }
                        {emailVerified && <Alert className={classes.alert} severity={'success'}> <div><Typography>Email verified Successfully</Typography> <Link to="./signin" style={{ cursor: 'pointer' }} >  Login Now</Link> </div> </Alert>}

                        {!emailVerified &&
                            <Grid container className={classes.grid}>
                                <Grid item xs={12} className={classes.text}>
                                    Didn't receive an email?
                                <a onClick={resendCode} style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }} > Resend</a>
                                </Grid>
                                <Grid item xs={12} className={classes.text}>
                                    Return to Sign Up?
                                <Link to="./signup" style={{ cursor: 'pointer' }} > Sign Up</Link>
                                </Grid>
                            </Grid>
                        }
                        <Box mt={5}>
                            <Copyright />
                        </Box>
                    </form>
                </div>

            </Grid >

            { <Snackbar open={alertOpen} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    New code sent your email!
                </Alert>
            </Snackbar>}
        </Grid >
    );
}