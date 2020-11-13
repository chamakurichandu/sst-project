import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Viewer, { Worker } from '@phuocng/react-pdf-viewer';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    // backgroundColor: theme.palette.background.paper,
    // border: '2px solid #000',
    // boxShadow: theme.shadows[5],
    // padding: theme.spacing(2, 4, 3),
  },
}));

const exampleWrapperStyle = {
  width: '100%',
  position: 'absolute',
  left: '200px'
};

export default function PdfViewer(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  return (
    <div style={exampleWrapperStyle}>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={props.closePDFViewer}
      >
        <Fade in={open}>
          <div style={{ outline: 'none', overflow: 'auto' }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.5.207/build/pdf.worker.min.js">
              <div style={{ height: '85vh', width: '560px' }}>
                <button type='button' style={{ float: 'right' }} onClick={props.closePDFViewer}>X</button>
                <Viewer fileUrl="https://arxiv.org/pdf/quant-ph/0410100.pdf" />
              </div>
            </Worker>
          </div>
        </Fade>
      </Modal>
    </div>

  );

}
