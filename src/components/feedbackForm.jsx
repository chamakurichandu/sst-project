import React from 'react';
import Vimeo from '@u-wave/react-vimeo';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
// import StarRatings from 'react-star-ratings';
import ReactStars from "react-rating-stars-component";
import Button from '@material-ui/core/Button';
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
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(1.5, 1),
        display: 'flex',
        flexDirection:'column',
        position: 'relative',
        outline:'none'
    },
    feedbackText:{
        height: '120px',
        width: '250px',
        borderRadius: '10px',
        margin: '5px 0px 10px',
    },
    submit: {
        // width:'50%',
        display:'flex',
        justifyContent: 'flex-end'
    },
    h3:{
        textAlign:'center',
        margin: 0,
    }
}));
export default function FeedbackForm() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const ratingChanged = (newRating) => {
        console.log(newRating);
    };

    return (
        <div style={exampleWrapperStyle}>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
            >
                <Fade in={open}>
                    <form className={classes.paper}>
                        <button type='button' style={{ position:'absolute', right:'5px', top:'5px' }} onClick={handleClose}>X</button>
                        <h3 className={classes.h3}>FEEDBACK FORM</h3>
                        <ReactStars
                            count={5}
                            onChange={ratingChanged}
                            size={24}
                            activeColor="#ffd700"
                        />
                        <textarea className={classes.feedbackText}></textarea>
                        <div className={classes.submit}><Button variant="contained" color="primary">Send</Button></div>
                    </form>
                </Fade>
            </Modal>
        </div>

    );

}
