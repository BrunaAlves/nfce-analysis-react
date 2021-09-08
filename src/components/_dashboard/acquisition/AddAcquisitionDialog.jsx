import axios from "axios";
import React from "react";
import CategoryDialog from './AcquisitionDialog';
import config from "../../../config.json";
import AuthService from "../../../services/auth.service";


export default function AddAcquisitionDialog({onClose, open}) {
  const category = {
      id: "",
      name: ""
  }

  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();

  const handleConfirm = (data) => {
    data.userId = currentUser.id;
    axios.post(`${baseUrl}/category/`, data, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      }).then((r) => {
        onClose?.();
      });
   }

  return (
    <CategoryDialog
      title="Adicionar categoria"
      onClose={onClose}
      onConfirm={handleConfirm}
      open={open}
      payload={category}
    />
  );
}
