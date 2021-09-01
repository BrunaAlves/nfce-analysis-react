import React from "react";
import { makeStyles } from "@material-ui/styles";

// material
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 300
  },
}));


export default function ConfirmDialog({onClose, onConfirm, onCancel, title, message, open}) {
  const classes = useStyles();
  const handleClose = () => {
    onClose?.();
  };

  const handleConfirm = () => {
    onConfirm?.();
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      className={classes.root}
      fullWidth={true}
      PaperProps={{
        style: {
          minWidth: classes.root.minWidth
        }
      }}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        {title}
      </DialogTitle>
      <DialogContent>
        {message}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleConfirm} color="primary">
          Confirmar
        </Button>
        <Button autoFocus onClick={handleClose} color="primary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
