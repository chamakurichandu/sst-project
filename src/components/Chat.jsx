import React, { useRef } from "react";
import { ChatFeed, Message } from "react-chat-ui";
import "./../App.css";
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import ProfileImage from '../assets/svg/ss/man.svg';
import { withStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import SendImage from '@material-ui/icons/Send';

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
        resize: "both",
    }
});

export default function Chat(props) {

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
            padding: '0px 16px 16px',
        },
    }))(MuiDialogContent);

    const textareaValue = useRef("");
    const [messages, setMessages] = React.useState([]);

    const handleOnSubmit = () => {
        if (textareaValue.current.value !== '') {
            const msg = new Message({ id: 0, message: textareaValue.current.value });
            const newmessages = [...messages, ...[msg]];
            setMessages(newmessages);
            props.sendChat(props.currentRow["user_id"], textareaValue.current.value);
            textareaValue.current.value = "";
        }
    };

    return (
        <div>
            <Dialog fullWidth onClose={() => props.setChatUI(false)} aria-labelledby="customized-dialog-title" open={true}>
                <DialogTitle id="customized-dialog-title" onClose={() => props.setChatUI(false)}>
                    <div style={{ 'display': 'flex', 'alignItems': 'center' }}>
                        <img src={ProfileImage} width='30' alt="" style={{ 'marginRight': '10px' }} />
                        <span>{props.currentRow["name"]}</span>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div style={{ height: '60vh', display: 'flex', flexDirection: 'column' }}>
                        <ChatFeed
                            messages={props.newMessages}
                            bubbleStyles={{
                                text: {
                                    fontSize: 16
                                },
                                chatbubble: {
                                    borderRadius: 10,
                                    padding: 5,
                                }
                            }}
                        />
                    </div>
                </DialogContent>
                <div style={{ padding: 0, display: 'flex', alignItems: 'flex-end', marginBottom: 10, marginLeft: 10 }}>
                    <TextField
                        inputRef={textareaValue}
                        id="outlined-textarea"
                        label=""
                        placeholder="Your Message"
                        multiline
                        variant="outlined"
                        fullWidth
                        inputProps={{ className: styles.textarea }}
                    />
                    <IconButton color="primary" aria-label="upload picture" component="span" onClick={handleOnSubmit}>
                        <SendImage />
                    </IconButton>
                </div>
                {/* </div> */}

            </Dialog>
        </div>
    );
}
