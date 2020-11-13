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
    h5: {
        fontWeight: 'bold',
        margin: '10px'
    },
    instruction: {
        textAlign: 'center',
    }
}));

export default function ForgotPassword(props) {
    const classes = useStyles();
    const email = useRef(null);
    const [userNameError, setUserNameError] = React.useState(null);
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

    const validateData = () => {
        const schema = Joi.object({
            email: Joi.string().min(5).max(30).required().email({ tlds: { allow: false } }),
        });
        const { error } = schema.validate({ email: email.current.value.trim() }, { abortEarly: false });
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

        const errors = validateData();

        let errorOccured = false;
        if (errors["email"]) {
            setUserNameError(errors["email"]);
            errorOccured = true;
        }

        if (errorOccured)
            return;

        forgotPassword();
    }

    const forgotPassword = async () => {
        setContactingServer(true);
        try {
            await Auth.forgotPassword(email.current.value.trim());
            window.localStorage.setItem("username", email.current.value.trim());
            // console.log("forgot password success: ", data);
            setContactingServer(false);
            props.history.push('./resetpassword');
        } catch (error) {
            console.log("Error");
            setContactingServer(false);
            setUserNameError(error);
            return;
        }
    }

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
                    <Typography component="h1" variant="h5" className={classes.h5}>
                        Forgot Password?
                    </Typography>

                    <Typography component="p" className={classes.instruction}>
                        Enter the email address you used when you joined and we'll send you instructions to reset your password.
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

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={contactingServer}
                        >
                            Send
                        </Button>
                        <Link to="/signin" > Back to Sign in </Link>
                        <Box mt={5}>
                            <Copyright />
                        </Box>
                    </form>
                </div>
            </Grid >
        </Grid >
    );
}