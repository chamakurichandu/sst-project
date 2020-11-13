import React, { useRef, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
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
import axios from 'axios';
import config from "../config.json";

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
    }
}));

export default function SignInSide(props) {
    const classes = useStyles();
    const email = useRef(null);
    const password = useRef(null);
    const [userNameError, setUserNameError] = React.useState(null);
    const [passwordError, setPasswordError] = React.useState(null);
    const [rememberMeChecked, setRememberMeChecked] = React.useState(true);
    const [contactingServer, setContactingServer] = React.useState(false);

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
        const remembered = window.localStorage.getItem("RememberSignIn");
        if (remembered && remembered === "true") {
            setRememberMeChecked(true);
            const rememberedUsername = window.localStorage.getItem("username");
            const rememberedPassword = window.localStorage.getItem("password");
            email.current.value = rememberedUsername;
            password.current.value = rememberedPassword;
        }
        else {
            setRememberMeChecked(false);
        }
    }, []);

    const validateData = () => {
        const schema = Joi.object({
            email: Joi.string().min(5).max(100).required().email({ tlds: { allow: false } }),
            password: Joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*-]{3,30}$'))
        });
        const { error } = schema.validate({ email: email.current.value.trim(), password: password.current.value.trim() }, { abortEarly: false });
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

        if (errorOccured)
            return;

        signIn();
    }

    const signIn = async () => {
        setContactingServer(true);
        try {
            let url = config["baseurl"] + "/api/user/login";

            let postObj = {};
            postObj["email"] = email.current.value.trim();
            postObj["password"] = password.current.value.trim();

            const response = await axios.post(url, postObj);

            console.log(response);
            console.log(response.data.authToken);
            console.log(response.data.name);
            window.localStorage.setItem("authToken", response.data["authToken"]);
            // window.localStorage.setItem("authToken", response.data["authToken"]);
            // postObj["password"] = password.current.value.trim();
            window.localStorage.setItem("name", response.data.name);

            if (window.localStorage.getItem("RememberSignIn") === "true") {
                window.localStorage.setItem("username", email.current.value.trim());
                window.localStorage.setItem("password", password.current.value.trim());
            }
            if (response.data["needPasswordReset"] === true) {
                props.setInProcessUser(response.data);
                props.history.push('/setpassword');
            } else {
                try {
                    url = config["baseurl"] + "/api/user/profile";
                    axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
                    const response = await axios.get(url);
                    const profileResp = response.data;
                    console.log(profileResp);
                    window.localStorage.setItem("profile", JSON.stringify(profileResp));

                    setContactingServer(false);
                    props.onAuthSuccess();
                }
                catch (e) {
                    console.log("error in profile API");
                    throw e;
                    return;
                }
            }
        } catch (error) {
            console.log("signin 4");
            if (error.response)
                setUserNameError(error.response.data["message"]);
            else
                setUserNameError(error.message);
            if (error.code === "UserNotConfirmedException") {
                try {
                    await Auth.resendSignUp(email.current.value.trim());
                }
                catch (error2) {

                }
                setContactingServer(false);
                props.history.push('./verifyemail');
            }
            else {

                setContactingServer(false);
            }
            return;
        }
    }

    const handleChange = (event) => {
        window.localStorage.setItem("RememberSignIn", (event.target.checked ? "true" : "false"));
        window.localStorage.setItem("username", (event.target.checked ? email.current.value.trim() : ""));
        window.localStorage.setItem("password", (event.target.checked ? password.current.value.trim() : ""));

        setRememberMeChecked(event.target.checked);
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
                    <Typography component="h1" variant="h5">
                        Sign in
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
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" checked={rememberMeChecked}
                                onChange={handleChange} />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={contactingServer}
                        >
                            Sign In
            </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link to="/forgotpassword" > Forgot password? </Link>
                            </Grid>
                            {/* <Grid item>
                                <Link to="/signup" > Don't have an account? Sign Up </Link>
                            </Grid> */}
                        </Grid>
                        <Box mt={5}>
                            <Copyright />
                        </Box>
                    </form>
                </div>
            </Grid >
        </Grid >
    );
}