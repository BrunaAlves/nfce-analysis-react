import axios from "axios";
import React from "react";
import CategoryDialog from './AcquisitionDialog';
import config from "../../../config.json";
import AuthService from "../../../services/auth.service";


export default function AddAcquisitionDialog({onClose, open}) {
  const acquisition = {
      id: "",
      name: "",
      frequency: "diario",
      itemCodes: []
  }

  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();

  const handleConfirm = (data) => {
    data.userId = currentUser.id;
    axios.post(`${baseUrl}/acquisition/`, data, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      }).then((r) => {
        onClose?.();
      });
   }

  return (
    <CategoryDialog
      title="Adicionar sugestao de compra"
      onClose={onClose}
      onConfirm={handleConfirm}
      open={open}
      payload={acquisition}
    />
  );
}
