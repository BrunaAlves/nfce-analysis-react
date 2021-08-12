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
import { useQuery } from 'react-query'

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

export default function CategoryDialog(props) {
  const classes = useStyles();
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(Number(event.target.value) || '');
  };
  
  const handleClose = () => {
    if (props.onClose) props.onClose();
  };

  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();

  const { 
    isLoading: list_isLoading,
    error: list_error,
    data: list_categorie ,
    refetch: list_refetch
  } = useQuery(['Categoria', props.payload], (key) => {
    let data = key.queryKey[1];
      if(data)
        return axios.get(`${baseUrl}/categories/all`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }).then((r) => r.data);
    }
  )

  return (
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            minWidth: 600
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
                value={age}
                onChange={handleChange}
                input={<Input />}
              >
                {list_categorie &&
                  list_categorie.map(el => 
                    <MenuItem value={el.name}>{el.name}</MenuItem>
                  )

                }
                
                {/* <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Tedasdsadan</MenuItem>
                <MenuItem value={20}>TwedasdasdasntyTwedasdasdasnty</MenuItem>
                <MenuItem value={30}>Thirdasdadaty</MenuItem> */}
              </Select>
            </FormControl>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Categorizar itens relacionados
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Categorizar este item
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
  );
}
