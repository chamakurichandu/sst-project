import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Background from '../assets/audiotorium/render_px_19.jpg';
import Banner1Ver from '../assets/audiotorium/banner1.jpg';
import Banner1Hor from '../assets/audiotorium/banner1-portrait.jpg';
import Banner2Ver from '../assets/audiotorium/banner2.jpg';
import Banner2Hor from '../assets/audiotorium/banner2-portrait.jpg';
import '../index.css';

import Vimeo from '@u-wave/react-vimeo';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
    exampleWrapperStyle: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        // alignItems: 'center'
    },
    paper: {
        // backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50% 50%',
        backgroundImage: `url(${Background})`,
        height: '100vh',
        width: 'calc(100% - 73px)',
        // alignItems: 'center',
        backgroundSize: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        position: 'absolute',
        left: '73px',
        '@media (max-width: 400px)': {
            width: 'calc(100% - 48px)',
            left: '48px',
            flexDirection: 'column !important',
            overflow: 'hidden !important',
            justifyContent: 'center !important',
        }
    },
    modal: {
        display: 'flex',
        // alignItems: 'center',
        justifyContent: 'center',
        width: '500px',

    },
    paperVideo: {
        position: 'relative',
        top: '20%',
        outline: 'none',
        width: '100%',
        height: '100%',
        '@media (max-width: 670px)': {
            height: "auto",
        }
    },
    banner: {
        width: '40%',
        height: '28vw',
        '@media (max-width: 400px)': {
            width: 'auto',
            height: 'auto'
        }
    },
    Vertical: {
        display: 'flex',
        '@media (max-width: 400px)': {
            display: "none",
        }
    },
    Horizontal: {
        display: 'none',
        '@media (max-width: 400px)': {
            display: "flex",

        }
    }

}));
export default function FlatAuditorium() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <div className={classes.paper}>
            <div className={classes.banner}>
                <img src={Banner1Ver} width='100%' height='100%' alt='' className={classes.Vertical}></img>
                <img src={Banner1Hor} width='100%' height='100%' alt='' className={classes.Horizontal}></img>
            </div>
            <div className={classes.paperVideo}>
                {/* <button type='button' style={{ position: 'absolute', right: 0 }} onClick={handleClose}>X</button> */}
                <div style={{ width: '100%', height: '100%' }} id='iframeDiv'>
                    <Vimeo video="465515407" autoplay />
                </div>
            </div>
            <div className={classes.banner}>
                <img src={Banner2Ver} width='100%' height='100%' alt='' className={classes.Vertical}></img>
                <img src={Banner2Hor} width='100%' height='100%' alt='' className={classes.Horizontal}></img>
            </div>
        </div>
    )
}
