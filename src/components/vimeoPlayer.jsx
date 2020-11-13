import React from 'react';
import Vimeo from '@u-wave/react-vimeo';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
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
    paperVideo: {
        position: 'relative',
        outline: 'none'
    },
}));

export default function VimeoPlayer(props) {

    const classes = useStyles();
    return (
        <div style={exampleWrapperStyle}>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={true}
                onClose={props.closeVideoPlayer}
            >
                <Fade in={true}>
                    <div className={classes.paperVideo}>
                        <button type='button' style={{ position: 'absolute', right: 0 }} onClick={props.closeVideoPlayer}>X</button>
                        <Vimeo video="29474908" autoplay />
                    </div>
                </Fade>
            </Modal>
        </div>

    );

}
