import React, { useRef } from 'react';
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

import lockImage from '../assets/svg/ss/unlock.svg';
import "./auth.js";

const Joi = require('joi');

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <a color="inherit" href="https://someshwara.com/"> Someshwara Software Pvt Ltd</a>
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
        backgroundColor: '#ffffff'
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
    h1: {
        textAlign: 'center',
        margin: '8px 0px',
        fontWeight: 'bold'
    },
    text: {
        color: '#677788',
        textAlign: 'center',
        padding: '0px',
        fontWeight: '500'
    }
}));

export default function SignUpSide(props) {

    const classes = useStyles();
    const [contactingServer, setContactingServer] = React.useState(false);
    const email = useRef(null);
    const password = useRef(null);
    const confirmPassword = useRef(null);
    const [userNameError, setUserNameError] = React.useState(null);
    const [passwordError, setPasswordError] = React.useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = React.useState(null);


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

    const validateData = () => {
        const schema = Joi.object({
            email: Joi.string().min(5).max(100).required().email({ tlds: { allow: false } }),
            password: Joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*-]{3,30}$')),
            confirmPassword: Joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*-]{3,30}$'))
        });
        const { error } = schema.validate({ email: email.current.value.trim(), password: password.current.value.trim(), confirmPassword: confirmPassword.current.value.trim() }, { abortEarly: false });
        const allerrors = {};
        if (error) {
            for (let item of error.details)
                allerrors[item.path[0]] = item.message;
        }

        return allerrors;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        setUserNameError(null);
        setPasswordError(null);
        setConfirmPasswordError(null);

        const errors = validateData();

        let errorOccured = false;
        if (errors["email"]) {
            setUserNameError(errors["email"]);
            errorOccured = true;
        }
        if (errors["password"]) {
            setPasswordError(errors["password"]);
            errorOccured = true;
        }
        if (errors["confirmPassword"]) {
            setConfirmPasswordError(errors["confirmPassword"]);
            errorOccured = true;
        }
        if (password.current.value !== confirmPassword.current.value) {
            setConfirmPasswordError("Password and Confirm password should be same");
            errorOccured = true;
        }

        if (errorOccured)
            return;

        signUp();
    }

    const signUp = async () => {
        setContactingServer(true);
        try {
            const user = await Auth.signUp(email.current.value.trim(), password.current.value.trim());
            console.log("SignUp success: ", user);
            setContactingServer(false);

            window.localStorage.setItem("username", email.current.value.trim());
            window.localStorage.setItem("password", "");

            props.history.push('./verifyemail');
            return;
        } catch (error) {
            console.log(lstrings[error.code]);
            setUserNameError(lstrings[error.code] ? lstrings[error.code] : error.message);
            setContactingServer(false);
        }
    }

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />

            <Grid item xs={12} sm={6} className={classes.header}>
                <img src={LogoIcon} width='120' alt="" />
                <LanguageSelect language={language} themeChanged={themeChanged}></LanguageSelect>
            </Grid>
            <Grid item xs={false} sm={6} md={6} component={Paper} elevation={6} square>
                <Hidden xsDown>
                    <CoverPage></CoverPage>
                    {/* <Titles3D /> */}
                </Hidden>
            </Grid>

            <Grid item xs={12} sm={6} md={6} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <img src={lockImage} width='30px' height='30px' alt=""></img>
                    <Typography component="h1" variant="h5" className={classes.h1}>
                        Create your account
                    </Typography>
                    <Typography component="p" className={classes.text}>
                        Already have an account?
                        <Link to="/signin" > Sign in here </Link>
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={handleSubmit}>
                        <TextField
                            inputRef={email}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        {userNameError && <Alert className={classes.alert} severity="error"> {userNameError} </Alert>}
                        <TextField
                            inputRef={password}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        {passwordError && <Alert className={classes.alert} severity="error"> {passwordError} </Alert>}

                        <TextField
                            inputRef={confirmPassword}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="Confirm Password"
                            label="Confirm Password"
                            type="password"
                            id="ConfirmPassword"
                            autoComplete="current-password"
                        />
                        {confirmPasswordError && <Alert className={classes.alert} severity="error"> {confirmPasswordError} </Alert>}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={contactingServer}
                        >
                            Create an account
                        </Button>

                        <Box mt={5}>
                            <Copyright />
                        </Box>
                    </form>
                </div>
            </Grid >

        </Grid >
    );
}