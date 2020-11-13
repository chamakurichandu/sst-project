import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Background from '../assets/audiotorium/render_px_19.jpg';
// import Banner1Ver from '../assets/audiotorium/banner1.jpg';
// import Banner1Hor from '../assets/audiotorium/banner1-portrait.jpg';
// import Banner2Ver from '../assets/audiotorium/banner2.jpg';
// import Banner2Hor from '../assets/audiotorium/banner2-portrait.jpg';
import '../index.css';

import ReactPlayer from 'react-player'

const useStyles = makeStyles((theme) => ({
    exampleWrapperStyle: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    paper: {
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50% 50%',
        backgroundImage: `url(${Background})`,
        height: '100vh',
        width: 'calc(100% - 73px)',
        alignItems: 'center',
        backgroundSize: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        position: 'absolute',
        overflow: 'hidden',
        left: '73px',
        '@media (max-width: 400px)': {
            width: 'calc(100% - 48px)',
            left: '48px',
            flexDirection: 'column !important',
            overflow: 'hidden !important',
            justifyContent: 'center !important',
            background: 'black'
        }
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '500px',

    },
    paperVideo: {
        position: 'relative',
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
    },
    player: {
        '@media (max-width: 400px)': {
            height: "30vh !important",

        }
    }

}));
export default function FlatYoutubeAuditorium() {
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
                {/* <img src={Banner1Ver} width='100%' height='100%' alt='' className={classes.Vertical}></img> */}
                {/* <img src={Banner1Hor} width='100%' height='100%' alt='' className={classes.Horizontal}></img> */}
            </div>
            <div className={classes.paperVideo}>
                <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', top: '50%', transform: 'translateY(-40%)' }}>
                    <ReactPlayer
                        url="https://youtu.be/MevKTPN4ozw"
                        controls
                        // playbackRate={2}
                        className={classes.player}
                        width="100%"
                        height="28vw"
                    />
                </div>
            </div>
            <div className={classes.banner}>
                {/* <img src={Banner2Ver} width='100%' height='100%' alt='' className={classes.Vertical}></img> */}
                {/* <img src={Banner2Hor} width='100%' height='100%' alt='' className={classes.Horizontal}></img> */}
            </div>
        </div>
    )
}
