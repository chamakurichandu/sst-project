import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import AlertIcon from '../assets/svg/ss/bell.svg';
import lstrings from '../lstrings.js';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    image: {
        position: 'absolute',
        left: theme.spacing(2),
        top: theme.spacing(2.5),
        color: theme.palette.grey[500],
    },
    textarea: {
        resize: "both"
    },
    title:{
        marginLeft:30
    }
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (        
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <img src={AlertIcon} className={classes.image} width='25' alt="" />
            <Typography className={classes.title} variant="h6">{children}</Typography>
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

export default function ConfirmDelete(props) {
    const [open, setOpen] = React.useState(true);

    return (
        <div>
            <Dialog onClose={props.noConfirmationDialogAction} aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{lstrings.DeleteItemConfirmationMessage}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.noConfirmationDialogAction} color="primary">{lstrings["No"]}</Button>
                    <Button onClick={props.yesConfirmationDialogAction} color="primary">{lstrings["Yes"]}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
