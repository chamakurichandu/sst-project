import React, { useRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    textarea: {
        resize: "both"
    }
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
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

export default function MentoringApplyForm(props) {
    const [open, setOpen] = React.useState(true);
    const textareaValue = useRef("");

    const handleClose = () => {
        props.mentorshipApplyFormClose();
    };

    const applyForm = () => {
        props.mentorshipApplyFormApply(textareaValue.current.value);
    }

    return (
        <div>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Mentoring Apply Form
        </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Explain the mentor on which topic you need mentoring...
          </Typography>
                    <TextField
                        inputRef={textareaValue}
                        id="outlined-textarea"
                        label="Message to Mentor"
                        placeholder="Your Message"
                        multiline
                        variant="outlined"
                        fullWidth
                        inputProps={{ className: styles.textarea }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={applyForm} color="primary">
                        Send
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
