import React, { useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Profile from '../assets/svg/ss/man.svg';
import Website from '../assets/svg/ss/website.svg';
import Mail from '../assets/svg/ss/mail.svg';
import Phone from '../assets/svg/ss/phone.svg';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import config from "../config.json";
import { Auth } from 'aws-amplify';

const exampleWrapperStyle = {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};
const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        overflow: 'auto',
        justifyContent: 'center',
        height: '100%',
        '@media (max-height: 420px)': {
            alignItems: "flex-start",
        },
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        // padding: theme.spacing(1.5, 1),
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        outline: 'none',
        padding: '10px 20px',
        width: '500px',
        borderRadius: '10px',
        overflow: 'auto',
        depth: 3,
        margin: '5px',
        '@media (max-width: 420px)': {
            padding: "10px 5px",
        }
    },
    paper2: {
        backgroundColor: "#f2f2f2",
        boxShadow: theme.shadows[5],
        // padding: theme.spacing(1.5, 1),
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        outline: 'none',
        padding: '10px 20px',
        width: '500px',
        borderRadius: '10px',
        overflow: 'auto',
        margin: '5px',
        '@media (max-width: 420px)': {
            padding: "10px 5px",
        }
    },
    feedbackText: {
        height: '120px',
        width: '250px',
        borderRadius: '10px',
        margin: '5px 0px 10px',
    },
    submit: {
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '10px',
    },
    h3: {
        textAlign: 'center',
        // margin: 0,
    },
    inputFields: {
        marginTop: 10,
    },
    card: {
        // margin: '0px 30px',
        position: 'relative'
    },
    profileImage: {
        position: 'absolute',
        right: '20px',
        top: '20px',
    },
    margin: {
        marginLeft: '8px'
    },
    pos: {
        display: 'flex',
        alignItems: 'center',
        padding: '2px 5px',
        '@media (max-width: 420px)': {
            fontSize: "14px",
            fontWeight: '400'
        }
    },
    title: {
        textAlign: 'left',
        fontWeight: '800'
    }
}));


export default function BusinessCard(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [createCard, setCreateCard] = React.useState(true);
    const [previewCard, setPreviewCard] = React.useState(false);

    const [fullName, setFullName] = React.useState('');
    const [designation, setDesignation] = React.useState('');
    const [companyName, setCompanyName] = React.useState('');
    const [website, setWebsite] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [mobileNumber, setMobileNumber] = React.useState('');

    const [nameError, setNameError] = React.useState(null);
    const [contactingServer, setContactingServer] = React.useState(false);

    useEffect(() => {
        let profileData = JSON.parse(window.localStorage.getItem("profile"));
        if (profileData["name"] !== null)
            setFullName(profileData["name"]);
        if (profileData["email"] !== null)
            setEmail(profileData["email"]);
        if (profileData["designation"] !== null)
            setDesignation(profileData["designation"]);
        if (profileData["company"] !== null)
            setCompanyName(profileData["company"]);
        if (profileData["website"] !== null)
            setWebsite(profileData["website"]);
        if (profileData["phone"] !== null)
            setMobileNumber(profileData["phone"]);

        if (props.businessCardStep == 2) {
            setCreateCard(false);
            setPreviewCard(true);
        }
        else {
            setCreateCard(true);
            setPreviewCard(false);
        }
    }, []);

    const handleSave = async () => {
        if (fullName.length === 0) {
            setNameError("Full Name required");
            return;
        }

        let profileData = JSON.parse(window.localStorage.getItem("profile"));

        if (fullName.length > 0) profileData["name"] = fullName;
        if (designation.length > 0) profileData["designation"] = designation;
        if (website.length > 0) profileData["website"] = website;
        if (companyName.length > 0) profileData["company"] = companyName;
        if (mobileNumber.length > 0) profileData["phone"] = mobileNumber;

        window.localStorage.setItem("profile", JSON.stringify(profileData));

        setContactingServer(true);

        try {
            let sessionData = await Auth.currentSession();
            try {
                let url = config["baseurl"] + "/org/" + config["org"] + "/event/" + config["event"] + "/profile";
                axios.defaults.headers.common['Authorization'] = sessionData["idToken"]["jwtToken"];
                let postObj = {};
                if (fullName.length > 0) postObj["name"] = fullName;
                if (designation.length > 0) postObj["designation"] = designation;
                if (website.length > 0) postObj["website"] = website;
                if (companyName.length > 0) postObj["company"] = companyName;
                if (mobileNumber.length > 0) postObj["phone"] = mobileNumber;

                await axios.patch(url, postObj);
            }
            catch (e) {
                console.log("Error in saving business card");
            }
            setContactingServer(false);
        }
        catch (e) {
            console.log("error in getting session");
            setContactingServer(false);
            props.onAuthFailure();
        }

        setCreateCard(false);
        setPreviewCard(true);
    };

    const handleCloseCard = async () => {
        props.closeBusinessCard();
    };

    const handleBack = () => {
        setCreateCard(true);
        setPreviewCard(false);
    };

    return (
        <div style={exampleWrapperStyle}>
            {createCard &&
                <Modal aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description" className={classes.modal} open={open}>
                    <Fade in={open}>
                        <form className={classes.paper} autoComplete="off" noValidate>
                            <h3 className={classes.h3} id="staticBackdropLabel">CREATE YOUR BUSINESS CARD</h3>
                            <TextField className={classes.inputFields} id="formControlFullName" defaultValue={fullName} label="Full Name" variant="outlined" onChange={(event) => { setFullName(event.target.value); setNameError(null); }} />
                            {nameError && <Alert className={classes.alert} severity="error"> {nameError} </Alert>}
                            <TextField className={classes.inputFields} id="formControlDesignation" defaultValue={designation} label="Designation" variant="outlined" onChange={event => setDesignation(event.target.value)} />
                            <TextField className={classes.inputFields} id="formControlCompanyName" defaultValue={companyName} label="Company Name" variant="outlined" onChange={event => setCompanyName(event.target.value)} />
                            <TextField className={classes.inputFields} id="formControlWebsite" defaultValue={website} label="Website" variant="outlined" onChange={event => setWebsite(event.target.value)} />
                            <TextField className={classes.inputFields} id="formControlEmail" defaultValue={email} label="Email" variant="outlined" disabled />
                            <TextField className={classes.inputFields} id="formControlMobileNumber" defaultValue={mobileNumber} label="Mobile Number" variant="outlined" onChange={event => setMobileNumber(event.target.value)} />
                            <div className={classes.submit}><Button variant="contained" color="primary" onClick={handleSave} disabled={contactingServer}>Save</Button></div>
                        </form>
                    </Fade>
                </Modal>}
            {previewCard &&
                <Modal aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description" className={classes.modal} open={open}>
                    <Fade in={open}>
                        <form className={classes.paper2} autoComplete="off">
                            <h3 className={classes.h3} id="staticBackdropLabel">BUSINESS CARD PREVIEW</h3>
                            <Card className={classes.card}>
                                <CardContent>
                                    <img src={Profile} width='50' alt="" className={classes.profileImage} />
                                    {/* <Typography className={classes.title} color="textPrimary">BUSINESS CARD</Typography> */}
                                    <Typography className={classes.pos} color="textPrimary"><strong>{fullName}</strong></Typography>
                                    <Typography className={classes.pos} color="textPrimary">{designation}</Typography>
                                    <Typography className={classes.pos} color="textPrimary">{companyName}</Typography>
                                    <Typography className={classes.pos} color="textPrimary">
                                        <img src={Website} width='18' alt="" />
                                        <span className={classes.margin}>{website}</span>
                                    </Typography>
                                    <Typography className={classes.pos} color="textPrimary">
                                        <img src={Mail} width='18' alt="" />
                                        <span className={classes.margin}>{email}</span>
                                    </Typography>
                                    <Typography className={classes.pos} color="textPrimary">
                                        <img src={Phone} width='18' alt="" />
                                        <span className={classes.margin}>{mobileNumber}</span>
                                    </Typography>
                                </CardContent>
                            </Card>
                            <div className={classes.submit}>
                                <Button variant="contained" color="primary" className={classes.margin} onClick={handleBack} disabled={contactingServer}>Edit</Button>
                                <Button variant="contained" color="primary" className={classes.margin} onClick={handleCloseCard} disabled={contactingServer}>Close</Button>
                            </div>
                        </form>
                    </Fade>
                </Modal>}
        </div>
    );

}
