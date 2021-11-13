import React from "react";
import AcquisitionDialog from './AcquisitionDialog';
import axios from "axios";
import AuthService from "../../../services/auth.service";
import {useQuery} from 'react-query';
import config from "../../../config.json";
import requester from "../../../utils/requester";

export default function EditAcquisitionDialog({onClose, acquisitionId, open}) {
  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();
 console.info(acquisitionId)
  const { 
    isLoading: acquisition_isLoading,
    data: acquisition,
  } = useQuery(['acquisition', acquisitionId], (args) => {
      if(acquisitionId)
        return requester.get(`${baseUrl}/acquisition/${acquisitionId}`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
            }).then((r) => r.data);
        }
   )

  const handleConfirm = (data) => {
    data.userId = currentUser.id;
    axios.put(`${baseUrl}/acquisition/`, data, {
      headers: { Authorization: `Bearer ${currentUser.token}`, "Access-Control-Allow-Origin": "*"},
    }).then((r) => {
      onClose?.();
    });
  }

  return (
    <>{!acquisition_isLoading && 
      <AcquisitionDialog
        title="Editar sugestao de compra"
        onClose={onClose}
        onConfirm={handleConfirm}
        open={open}
        payload={acquisition}
      />
    }</>
  );
}
