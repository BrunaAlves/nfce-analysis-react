import React from "react";
import { makeStyles } from "@material-ui/styles";

// material
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  TextField
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 400
  },
}));


export default function AcquisitionDialog({onClose, onConfirm, title, payload, open}) {
  const classes = useStyles();
  const [fieldName, setFieldName] = React.useState(payload ? payload.name : "")

  const handleClose = () => {
    onClose?.();
  };

  const handleConfirm = () => {
    onConfirm?.({
        id: payload.id,
        name: fieldName,
    });
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
      <DialogContent dividers>
        <FormControl>
            <TextField 
                id="name" 
                label="Categoria" 
                variant="outlined" 
                value={fieldName} 
                fullWidth
                onChange={(evt) => setFieldName(evt.target.value)}/>
        </FormControl>
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
