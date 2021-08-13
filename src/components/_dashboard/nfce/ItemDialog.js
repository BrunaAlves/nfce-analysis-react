import React from "react";
import { makeStyles } from "@material-ui/styles";
import config from "../../../config.json";
import axios from "axios";
import AuthService from "../../../services/auth.service";
import { filter } from "lodash";
import { useState, useEffect } from "react";
import { useQuery } from 'react-query'

// material
import {
  Card,
  Table,
  Box,
  Stack,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from "@material-ui/core";
// components
import Scrollbar from "../../Scrollbar";
import SearchNotFound from "../../SearchNotFound";
import {
  NfceListHead,
  NfceMoreMenu
} from ".";
import ItemMoreMenu from "./ItemMoreMenu";
import CategoryDialog from "./CategoryDialog";

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 1200
  },
  dialogPaper: {
     
      height : '800px',
      width : '10000px'
  },
}));

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "itemName", label: "Nome", alignRight: false },
  { id: "qtdItem", label: "Quantidade", alignRight: false },
  { id: "unItem", label: "Unidade", alignRight: false },
  { id: "itemValue", label: "Valor do item", alignRight: false },
  { id: "category.name", label: "Categoria", alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_nfce) => _nfce.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ItemDialog(props) {
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryModalPayload, setCategoryModalPayload] = useState(null);

  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();

  const [nfceInfo, setNfceInfo] = React.useState('');
  const [payload, setPayload] = React.useState(props.payload);

  const { 
    isLoading: list_isLoading,
    error: list_error,
    data: list_data ,
    refetch: list_refetch
  } = useQuery(['Item', props.payload], (key) => {
    let data = key.queryKey[1];
      if(data)
        return axios.get(`${baseUrl}/items/nfce/${data._id}`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }).then((r) => r.data);
    }
  )
  
  function handleOpenCategory(row) {
    setCategoryModalPayload(row);
    setIsCategoryModalOpen(true);
  }

  function handleCloseCategoryModal() {
    setCategoryModalPayload(null);
    setIsCategoryModalOpen(false);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = list_data; //.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  var emptyRows = false;
  if(list_data != null)
    emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - list_data.length) : 0;

  var filteredNfces = [];
  if(list_data != null)
  {
   // console.info(list_data)
    filteredNfces = applySortFilter(
      list_data,
      getComparator(order, orderBy),
      filterName
    );
  }

  const isNfceNotFound = filteredNfces.length === 0;

  const handleClose = () => {
    if (props.onClose) props.onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={props.open}
      className={classes.root}
      fullWidth={true}
      PaperProps={{
        style: {
          minWidth: 1200
        }
      }}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Lista de itens
      </DialogTitle>
      <DialogContent dividers>
        {list_isLoading && 
          <Box>Loading</Box>
        }
        {!list_isLoading && list_data != null && 

        
                <Table>
                  <NfceListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={list_data.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredNfces
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        const { itemName, qtdItem, unItem, itemValue, category } =
                          row;
                       

                        return (
                          <TableRow
                            key={row._id}
                          >
                            <TableCell >
                             
                            </TableCell>
                            
                            <TableCell align="left">{itemName}</TableCell>
                            <TableCell align="left">{qtdItem}</TableCell>
                            <TableCell align="left">{unItem}</TableCell>
                            <TableCell align="left">{itemValue}</TableCell>
                            <TableCell align="left">{category && category.name }</TableCell>

                            <TableCell align="right">
                            <ItemMoreMenu
                              onOpenCategory={() => handleOpenCategory(row)}
                            />
                          </TableCell>

                           
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  {isNfceNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
          }

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={list_data != null ? list_data.length : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          {/* </Card> */}
          <CategoryDialog
            open={isCategoryModalOpen}
            payload={categoryModalPayload}
            onClose={() => handleCloseCategoryModal()}
          />
    
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="secondary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
