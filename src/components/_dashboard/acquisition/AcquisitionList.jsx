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
import moment from 'moment';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { format } from 'date-fns';
import requester from "../../../utils/requester";

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
        return requester.get(`${baseUrl}/acquisition/all`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }).then((r) => r.data);
        }
  )

  const { 
    isLoading: triggerlogs_isLoading,
    error: triggerlogs_error,
    data: triggerlogs_data,
    refetch: triggerlogs_refetch
  } = useQuery(['TriggerlogsAcquisition'], (args) => {
        return requester.get(`${baseUrl}/acquisition/triggerlog`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }).then((r) => r.data);
        }
  )

  const updateItems = (data) => {
    axios.post(`${baseUrl}/acquisition/triggerlog`, data,{
      headers: { Authorization: `Bearer ${currentUser.token}` },
    }).then((r) => {
      triggerlogs_refetch();
    });
  }


  function addHandler() {
    setState({action:"add", acquisitionId: null})
  }

  function editHandler(acquisitionId) {
    setState({action:"edit", acquisitionId: acquisitionId})
  }

  function deleteHandler(acquisitionId) {
    setState({action:"delete", acquisitionId: acquisitionId})
  }

  function handleCloseDialog(){
    acquisition_refetch();
    setState(null);
  }

  function renderMenuHandle(acquisition) {
    return [{
      title: "Editar",
      icon: "trash-2-fill",
      onClick: () => {
        console.info(acquisition)
        editHandler(acquisition.id)
      }
    },{
      title: "Deletar",
      icon: "trash-2-fill",
      onClick: () => {
        deleteHandler(acquisition.id)
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
            Sugest??es de compras
          </Typography>

          <Box sx={{display: 'flex'}}>
            <Typography sx={{     
              marginTop: 1,
              marginRight: 1
             }}>??ltima atualiza????o dos itens: {triggerlogs_data && format(new Date(triggerlogs_data.updateAt), 'dd/MM/yyyy HH:mm')}</Typography>
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
            data={acquisition_data}
            headers={[
              { id: "id", label: "Id", alignRight: false, hidden: true },
              { id: "name", label: "Nome", alignRight: false },
              { id: "frequency", label: "Frequ??ncia", alignRight: false },
              { id: "lastPurchase", label: "??ltima compra", alignRight: false, onRender: renderDateTime },
              { id: "nextPurchase", label: "Pr??xima compra", alignRight: false, onRender: renderDateTime },
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
            acquisitionId={state ? state.acquisitionId : null}
            onClose={handleCloseDialog}
          />

          <DeleteAcquisitionDialog
            open={state && state.action === "delete"}
            acquisitionId={state ? state.acquisitionId : null}
            onClose={handleCloseDialog}
          />
        </Card>
      </Container>
  );
}
