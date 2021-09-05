import React from "react";
import { useState } from "react";
import config from "../../../config.json";
import { Card, Stack, Container, Typography, Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import AuthService from "../../../services/auth.service";
import CrudList from "../../_library/crudlist/CrudList";
import { useQuery } from "react-query";
 import ItemCategoryDialog from "./ItemCategoryDialog";
// import EditCategoryDialog from "./EditCategoryDialog";
// import DeleteCategoryDialog from './DeleteCategoryDialog';

export default function ItemsList(props) {
  const [state, setState] = useState(null);

  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();
  const [nfceList, setNfceList] = React.useState([]);

  const {
    isLoading: categories_isLoading,
    error: categories_error,
    data: categories_data,
  } = useQuery(["Categories"], (args) => {
    return axios
      .get(`${baseUrl}/category/all`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      })
      .then((r) => r.data);
  });

  const {
    isLoading: discounts_isLoading,
    error: discounts_error,
    data: discounts_data,
  } = useQuery(["Discounts"], (args) => {
    return axios
      .get(`${baseUrl}/discount/all`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      })
      .then((r) => r.data);
  });

  const {
    isLoading: items_isLoading,
    error: items_error,
    data: items_data,
    refetch: item_refetch
  } = useQuery(["Items", props.nfceId], (args) => {
    if (props.nfceId)
      return axios
        .get(`${baseUrl}/item/nfce/${props.nfceId}`, {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        })
        .then((r) => r.data);
  });

  React.useEffect(() => {
    if (items_data && categories_data && discounts_data) {
      const getCategoryNameById = (id) => {
        var category = categories_data.filter((x) => x.id === id);
        return category.length > 0 ? category[0].name : null;
      };

      const getDiscountValueById = (id) => {
        var discount = discounts_data.filter((x) => x.itemId === id);
        return discount.length > 0 ? discount[0].discountValue : null;
      };

      var newNfce = [];
      items_data.forEach((item) => {
        newNfce.push({
          ...item,
          ...{ categoryName: getCategoryNameById(item.categoryId) },
          ...{ discountValue: getDiscountValueById(item._id) },
        });
      });
      setNfceList(newNfce);
    }
  }, [props.nfceId, items_data, categories_data, discounts_data]);

  if (!props.nfceId) return <>Selecione um nfce</>;

  //   function addHandler() {
  //     setState({action:"add", categoryId: null})
  //   }

    function categoryHandler(item) {
      setState({action:"edit", payload: item})
    }

  //   function deleteHandler(categoryId) {
  //     setState({action:"delete", categoryId: categoryId})
  //   }

    function handleCloseDialog(){
      item_refetch();
      setState(null);
    }

  function renderMenuHandle(item) {
    return [
      {
        title: "Categorizar",
        icon: "trash-2-fill",
        onClick: () => {
            categoryHandler(item)
        },
      },
      {
        title: "Adicionar desconto",
        icon: "trash-2-fill",
        onClick: () => {
          //   deleteHandler(category.id)
        },
      },
      {
        title: "Mais informações",
        icon: "trash-2-fill",
        onClick: () => {
          //   deleteHandler(category.id)
        },
      },
    ];
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {/* <Typography variant="h4" gutterBottom>
            Itens
          </Typography> */}
        {/* <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => addHandler()}
          >
            Adicionar
          </Button> */}
      </Stack>

      <Card>
        <CrudList
          data={nfceList}
          headers={[
            { id: "id", label: "Id", alignRight: false, hidden: true },
            {
              id: "itemCode",
              label: "Código",
              alignRight: false,
              hidden: false,
            },
            { id: "itemName", label: "Nome", alignRight: false },
            { id: "qtdItem", label: "Quantidade", alignRight: false },
            { id: "unItem", label: "Unidade", alignRight: false },
            { id: "itemValue", label: "Valor do item", alignRight: false },
            { id: "categoryName", label: "Categoria", alignRight: false },
            { id: "discountValue", label: "Desconto", alignRight: false },
          ]}
          onRenderMenu={renderMenuHandle}
          pagination={true}
        />

        <ItemCategoryDialog 
            open={state && state.action === "edit"}
            payload={state ? state.payload : null}
            onClose={handleCloseDialog}
          />

        {/* 
          
           CATEGORIZAR / ADICIONAR DESCONTO / ADICIONAR A SUGESTAO DE COMPRAS / MAIS INFORMACOES        
          <AddCategoryDialog 
            open={state && state.action === "add"}
            onClose={handleCloseDialog}
          />

         

          <DeleteCategoryDialog
            open={state && state.action === "delete"}
            categoryId={state ? state.categoryId : null}
            onClose={handleCloseDialog}
          /> */}
      </Card>
    </Container>
  );
}
