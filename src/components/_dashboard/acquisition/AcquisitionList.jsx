import React from "react";
import { useState} from "react";
import config from "../../../config.json";
import {
  Card,
  Stack,
  Container,
  Typography,
  Button,
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import axios from "axios";
import AuthService from "../../../services/auth.service";
import CrudList from "../../_library/crudlist/CrudList";
import {useQuery} from 'react-query';
import AddAcquisitionDialog from "./AddAcquisitionDialog";
import EditAcquisitionDialog from "./EditAcquisitionDialog";
import DeleteAcquisitionDialog from './DeleteAcquisitionDialog';
import { fDateTime } from '../../../utils/formatTime';
import moment from 'moment'

export default function AcquisitionList() {
  const [state, setState] = useState(null);

  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();

  const { 
    isLoading: acquisition_isLoading,
    error: acquisition_error,
    data: acquisition_data ,
    refetch: acquisition_refetch
  } = useQuery(['Acquisition'], (args) => {
        return axios.get(`${baseUrl}/acquisition/all`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }).then((r) => r.data);
        }
  )

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
    acquisition_refetch();
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

  function renderDateTime(value, row) {
    return moment(new Date(value)).format("DD/MM/YYYY")
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
            Sugestões de compras
          </Typography>
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
            data={acquisition_data}
            headers={[
              { id: "id", label: "Id", alignRight: false, hidden: true },
              { id: "name", label: "Nome", alignRight: false },
              { id: "frequency", label: "Frequência", alignRight: false },
              { id: "lastPurchase", label: "Última compra", alignRight: false, onRender: renderDateTime },
              { id: "nextPurchase", label: "Próxima compra", alignRight: false, onRender: renderDateTime },
            ]}
            onRenderMenu={renderMenuHandle}
            pagination={true}
          />

          <AddAcquisitionDialog 
            open={state && state.action === "add"}
            onClose={handleCloseDialog}
          />

          <EditAcquisitionDialog 
            open={state && state.action === "edit"}
            categoryId={state ? state.categoryId : null}
            onClose={handleCloseDialog}
          />

          <DeleteAcquisitionDialog
            open={state && state.action === "delete"}
            categoryId={state ? state.categoryId : null}
            onClose={handleCloseDialog}
          />
        </Card>
      </Container>
  );
}
