import axios from "axios";
import React from "react";
import config from "../../../config.json";
import AuthService from "../../../services/auth.service";
import ConfirmDialog from "../../_library/confirmDialog/ConfirmDialog";


export default function DeleteCategoryDialog({onClose, open, categoryId}) {
  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();

  const handleConfirm = () => {
    axios.delete(`${baseUrl}/category/${categoryId}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      }).then((r) => {
        onClose?.();
      });
   }

  return (
    <ConfirmDialog
      title="Remover categoria"
      onClose={onClose}
      onConfirm={handleConfirm}
      open={open}
      message="Deseja remover a categoria?"
    />
  );
}
