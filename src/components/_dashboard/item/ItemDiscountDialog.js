import React from "react";
import { makeStyles } from "@material-ui/styles";
import config from "../../../config.json";
import AuthService from "../../../services/auth.service";
import axios from "axios";

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


export default function ItemDiscountDialog({onClose, onConfirm, title, payload, open}) {
  const classes = useStyles();
  const [discountVal, setDiscountVal] = React.useState(payload ? payload.discountValue : 0)

  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();

  const handleClose = () => {
    onClose?.();
  };

  const handleConfirm = () => {
    axios.post(`${baseUrl}/discount/${payload.id}`, {discountValue : discountVal}, {
      headers: { Authorization: `Bearer ${currentUser.token}` }
    }).then(() => {
      handleClose();
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
                label="Total de desconto" 
                variant="outlined" 
                value={discountVal} 
                fullWidth
                onChange={(evt) => setDiscountVal(evt.target.value)}/>
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
