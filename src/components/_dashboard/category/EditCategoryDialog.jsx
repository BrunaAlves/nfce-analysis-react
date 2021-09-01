import React from "react";
import CategoryDialog from './CategoryDialog';
import axios from "axios";
import AuthService from "../../../services/auth.service";
import {useQuery} from 'react-query';
import config from "../../../config.json";

export default function EditCategoryDialog({onClose, categoryId, open}) {
  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();

  const { 
    isLoading: category_isLoading,
    data: category,
  } = useQuery(['Category', categoryId], (args) => {
      if(categoryId)
        return axios.get(`${baseUrl}/category/${categoryId}`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
            }).then((r) => r.data);
        }
   )

  const handleConfirm = (data) => {
    data.userId = currentUser.id;
    axios.put(`${baseUrl}/category/`, data, {
      headers: { Authorization: `Bearer ${currentUser.token}`, "Access-Control-Allow-Origin": "*"},
    }).then((r) => {
      onClose?.();
    });
  }

  return (
    <>{!category_isLoading && 
      <CategoryDialog
        title="Editar categoria"
        onClose={onClose}
        onConfirm={handleConfirm}
        open={open}
        payload={category}
      />
    }</>
  );
}
