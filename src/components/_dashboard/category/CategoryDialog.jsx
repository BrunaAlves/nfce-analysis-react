import React from "react";
import { makeStyles } from "@material-ui/styles";
import config from "../../../config.json";
import axios from "axios";
import AuthService from "../../../services/auth.service";
import { useQuery, useMutation } from 'react-query';
import ClearIcon from '@material-ui/icons/Clear';

// material
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  TextField,
  Select,
  InputLabel,
  Autocomplete,
  Typography,
  Divider
} from "@material-ui/core";
import CrudList from "../../_library/crudlist/CrudList";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 400,
  },
  frequencyField: {
    marginTop: 20
  },
  itemsList: {
    marginTop: 20
  },
  autocompleteItem: {
    marginTop: 20
  }
}));


export default function CategoryDialog({onClose, onConfirm, title, payload, open}) {
  const classes = useStyles();
  const [fieldName, setFieldName] = React.useState(payload ? payload.name : "")
  const [fieldItems, setFieldItems] = React.useState([]);
  const [fieldItemCodes, setFieldItemCodes] = React.useState(null);
  const [autoCompleteValue, setAutoCompleteValue] = React.useState(null);
  const [autoCompleteInputValue, setAutoCompleteInputValue] = React.useState("");

  React.useEffect(() => {
    if(payload){
      setFieldName(payload.name ?? "")
    }
  }, [payload])

  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();

  const handleClose = () => {
    onClose?.();
  };

  const handleConfirm = () => {
    onConfirm?.({
        id: payload.id,
        name: fieldName,
        itemCodes: fieldItemCodes
    });
  }

  const { 
    isLoading: availableItems_isLoading,
    error: availableItems_error,
    data: availableItems_data ,
    refetch: availableItemsrefetch
  } = useQuery(['AcquisitionItemsList'], (key) => {
      return axios.get(`${baseUrl}/item/all?uniqueItemCode=true`, {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }).then((r) => r.data);
    }
  )

  React.useEffect(() => {
    if(payload && fieldItemCodes == null && availableItems_data){
      var seletedItems = [];
      var itemCodes = payload.itemCodes ? payload.itemCodes : [];
      itemCodes.forEach((itemCode) => {
        var item = availableItems_data.find((x) => x.itemCode === itemCode)
        if(item)
          seletedItems.push(item)
      })
      setFieldItems(seletedItems);
      setFieldItemCodes(itemCodes)
    }
  }, [payload, fieldItemCodes, availableItems_data])

  const handleAutoCompleteValue = (event, value, reason) => {
    if(value){
      var newItems = fieldItems.map((x) => x);
      newItems.push(value);
      setFieldItems(newItems);

      var itemCodes = newItems.map((x) => x.itemCode);
      setFieldItemCodes(itemCodes);

      setAutoCompleteValue(null)
    }
  }

  const handleRemoveItem = (row) => {
    var newItems = fieldItems.map((x) => x);
    var item = newItems.find((x) => x.id === row.id);
    newItems.splice(newItems.indexOf(item), 1);
    setFieldItems(newItems);

    var newitemCodes = fieldItemCodes.map((x) => x);
    newitemCodes.splice(newitemCodes.indexOf(item.itemCode), 1);
    setFieldItemCodes(newitemCodes)
  }

  const handleAutoCompleteInputValue = (event, value) => {
    setAutoCompleteValue("")
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
        <FormControl fullWidth>
            <TextField 
                id="name" 
                label="Categoria" 
                variant="outlined" 
                value={fieldName} 
                fullWidth
                onChange={(evt) => setFieldName(evt.target.value)}/>
        </FormControl>

        <Divider sx={{marginTop: 2, marginBottom: 2}} />

        <Typography>Adicione produtos a sua categoria</Typography>
        <Autocomplete className={classes.autocompleteItem}
          id="autoComplete-Item"
          options={availableItems_data}
          getOptionLabel={(option) => option.itemName}
          fullWidth
          loading={availableItems_isLoading}
          openOnFocus={false}
          renderInput={(params) => <TextField {...params} label="Pequise pelo produto para adicionar-lo" variant="outlined" />}
          onChange={handleAutoCompleteValue}
          value={autoCompleteValue}
        />

        <CrudList 
          className={classes.itemsList}
          data={fieldItems}
          isLoading={availableItems_isLoading}
          minWidth={300}
          headers={[
            { id: "id", label: "Id", alignRight: false, hidden: true },
            { id: "itemName", label: "Item", alignRight: false },
            { id: "", label: "Acao", onRender: (value, row) => <><ClearIcon sx={{cursor: "pointer"}} onClick={() => { handleRemoveItem(row)}} /></>}
          ]}
          pagination={true}
          paginationSize={5}
          searchBar={false}
        />
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
