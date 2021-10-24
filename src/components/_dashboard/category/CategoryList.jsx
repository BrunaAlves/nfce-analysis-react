import React from "react";
import { useState} from "react";
import config from "../../../config.json";
import {
  Card,
  Stack,
  Container,
  Typography,
  Button,
  Box,
  TextField,
  IconButton
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import axios from "axios";
import AuthService from "../../../services/auth.service";
import CrudList from "../../_library/crudlist/CrudList";
import {useQuery} from 'react-query';
import AddCategoryDialog from "./AddCategoryDialog";
import EditCategoryDialog from "./EditCategoryDialog";
import DeleteCategoryDialog from './DeleteCategoryDialog';
import { format } from 'date-fns';

export default function CategoriesList() {
  const [state, setState] = useState(null);

  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();

  const { 
    isLoading: categories_isLoading,
    error: categories_error,
    data: categories_data ,
    refetch: categories_refetch
  } = useQuery(['Categories'], (args) => {
        return axios.get(`${baseUrl}/category/all`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }).then((r) => r.data);
        }
  )

  const { 
    isLoading: triggerlogs_isLoading,
    error: triggerlogs_error,
    data: triggerlogs_data,
    refetch: triggerlogs_refetch
  } = useQuery(['TriggerlogsCategory'], (args) => {
        return axios.get(`${baseUrl}/category/triggerlog`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }).then((r) => r.data);
        }
  )

  const updateItems = (data) => {
    axios.post(`${baseUrl}/category/triggerlog`, data,{
      headers: { Authorization: `Bearer ${currentUser.token}` },
    }).then((r) => {
      triggerlogs_refetch();
    });
  }

  function addHandler() {
    setState({action:"add", categoryId: null})
  }

  function editHandler(categoryId) {
    setState({action:"edit", categoryId: categoryId})
  }

  function deleteHandler(categoryId) {
    setState({action:"delete", categoryId: categoryId})
  }

  function handleCloseDialog(){
    categories_refetch();
    setState(null);
  }

  function renderMenuHandle(category) {
    return [{
      title: "Editar",
      icon: "trash-2-fill",
      onClick: () => {
        editHandler(category.id)
      }
    },{
      title: "Deletar",
      icon: "trash-2-fill",
      onClick: () => {
        deleteHandler(category.id)
      }
    }]
  }

  return (
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Categorias
          </Typography>
          
          <Box sx={{display: 'flex'}}>
            <Typography sx={{     
              marginTop: 1,
              marginRight: 1
             }}>Última atualização dos itens: {triggerlogs_data && format(new Date(triggerlogs_data.updateAt), 'dd/MM/yyyy HH:mm')}</Typography>
            <Button
              startIcon={<AutorenewIcon />}
              onClick={() => updateItems()}
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => addHandler()}
          >
            Adicionar
          </Button>
        </Stack>

        <Card>
          <CrudList 
            data={categories_data}
            headers={[
              { id: "id", label: "Id", alignRight: false, hidden: true },
              { id: "name", label: "Categoria", alignRight: false },
            ]}
            onRenderMenu={renderMenuHandle}
            pagination={true}
          />

          <AddCategoryDialog 
            open={state && state.action === "add"}
            onClose={handleCloseDialog}
          />

          <EditCategoryDialog 
            open={state && state.action === "edit"}
            categoryId={state ? state.categoryId : null}
            onClose={handleCloseDialog}
          />

          <DeleteCategoryDialog
            open={state && state.action === "delete"}
            categoryId={state ? state.categoryId : null}
            onClose={handleCloseDialog}
          />
        </Card>
      </Container>
  );
}
