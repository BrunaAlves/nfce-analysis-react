import React from "react";
import { filter } from "lodash";
import { useState} from "react";
import config from "../config.json";

// material
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from "@material-ui/core";
// components
import Page from "../components/Page";
import Label from "../components/Label";
import Scrollbar from "../components/Scrollbar";
import SearchNotFound from "../components/SearchNotFound";
import {
  NfceListHead,
  NfceListToolbar,
  NfceMoreMenu,
} from "../components/_dashboard/nfce";

import axios from "axios";
import AuthService from "../services/auth.service";

import ItemDialog from "../components/_dashboard/nfce/ItemDialog";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "issuanceDate", label: "Data da compra", alignRight: false },
  { id: "socialName", label: "Nome Social", alignRight: false },
  { id: "cnpj", label: "CNPJ", alignRight: false },
  { id: "uf", label: "Estado", alignRight: false },
  {
    id: "totalValueService",
    label: "Valor total da compra",
    alignRight: false,
  },
  { id: "totalItems", label: "Total de itens", alignRight: false },
  // { id: '' }
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

export default function NfcePage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [itemDialogPayload, setItemDialogPayload] = useState(null);

  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();

  const [nfceList, setNfceList] = React.useState([]);

  if (nfceList.length == 0) {
    axios
      .get(`${baseUrl}/nfce/all`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      })
      .then(function (response) {
        setNfceList(response.data);
        // handle success
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        return [];
      });
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = nfceList; //.map((n) => n.name);
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

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - nfceList.length) : 0;

  const filteredNfces = applySortFilter(
    nfceList,
    getComparator(order, orderBy),
    filterName
  );

  const isNfceNotFound = filteredNfces.length === 0;

  function handleOpenItem(row) {
    setItemDialogPayload(row);
    setIsItemDialogOpen(true);
  }

  function handleCloseItemDialog() {
    setItemDialogPayload(null);
    setIsItemDialogOpen(false);
  }

  return (
    <Page title="Nfce | NFC-e Análise">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Nfce
          </Typography>
          {/* <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
          >
            New Nfce
          </Button> */}
        </Stack>

        <Card>
          <NfceListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <NfceListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={nfceList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredNfces
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        issuanceDate,
                        socialName,
                        cnpj,
                        uf,
                        totalItems,
                        totalValueService,
                      } = row;

                      return (
                        <TableRow hover key={row.id}>
                          <TableCell></TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Typography variant="subtitle2" noWrap>
                                {issuanceDate}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{socialName}</TableCell>
                          <TableCell align="left">{cnpj}</TableCell>
                          <TableCell align="left">{uf}</TableCell>
                          <TableCell align="left">{totalItems}</TableCell>
                          <TableCell align="left">
                            {totalValueService}
                          </TableCell>

                          {/* <TableCell align="right">
                            <NfceMoreMenu
                              onOpenItem={() => handleOpenItem(row)}
                            />
                          </TableCell> */}
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
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={nfceList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <ItemDialog
            open={isItemDialogOpen}
            payload={itemDialogPayload}
            onClose={() => handleCloseItemDialog()}
          />
        </Card>
      </Container>
    </Page>
  );
}
