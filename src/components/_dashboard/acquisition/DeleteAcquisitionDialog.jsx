import axios from "axios";
import React from "react";
import config from "../../../config.json";
import AuthService from "../../../services/auth.service";
import ConfirmDialog from "../../_library/confirmDialog/ConfirmDialog";


export default function DeleteAcquisitionDialog({onClose, open, acquisitionId}) {
  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();

  const handleConfirm = () => {
    axios.delete(`${baseUrl}/acquisition/${acquisitionId}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      }).then((r) => {
        onClose?.();
      });
   }

  return (
    <ConfirmDialog
      title="Remover sugestao de compra"
      onClose={onClose}
      onConfirm={handleConfirm}
      open={open}
      message="Deseja remover a sugestao de compra?"
    />
  );
}
