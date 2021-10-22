import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import config from "../../../config.json";
import axios from "axios";
import AuthService from "../../../services/auth.service";
import { useQuery, useMutation } from 'react-query';
import ItemCategoryMatchTable from './ItemCategoryMatchTable'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    marginLeft: 90,
    margin: 20,
    minWidth: 350,
  },
}));

export default function ItemCategoryDialog(props) {
  const classes = useStyles();
  const [category, setCategory] = React.useState('');

  React.useEffect(() => {
    if(props.payload){
      setCategory(props.payload.categoryId)
    }
  }, [props])

  const handleChange = (event) => {
    setCategory(event.target.value || '');
  };
  
  const handleClose = () => {
    if (props.onClose) props.onClose();
  };

  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();

  const { 
    isLoading: list_isLoading,
    error: list_error,
    data: list_category ,
    refetch: list_refetch
  } = useQuery(['CategoriesList', props.payload], (key) => {
    let data = key.queryKey[1];
      if(data)
        return axios.get(`${baseUrl}/category/all`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }).then((r) => r.data);
    }
  )

  const patchByItemCode = () => {  
    let currentCategory = list_category.find(x => x.id === category);
    let currentItem = props.payload;
    currentItem.categoryId = currentCategory.id;

    axios.put(`${baseUrl}/item/byitemcode`, currentItem, {
      headers: { Authorization: `Bearer ${currentUser.token}` }
    }).then(() => {
      handleClose();
    });
  };

  return (
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            minWidth: 700
          }
        }}
      >
         <DialogTitle>Selecione a categoria</DialogTitle>
        <DialogContent>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-dialog-select-label">Categoria</InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={category}
                onChange={handleChange}
                input={<Input />}
              >
                {list_category &&
                  list_category.map(el => 
                    <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>
                  )

                }
              </Select>
            </FormControl>
            <ItemCategoryMatchTable itemId={props.payload ? props.payload.id : null}/>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={patchByItemCode} color="primary">
            Categorizar itens relacionados
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
  );
}
