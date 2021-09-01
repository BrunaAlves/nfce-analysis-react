import React from "react";
import { filter } from "lodash";
import { useState} from "react";
// material
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  Box, 
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import Scrollbar from "../../Scrollbar";
import SearchNotFound from "../../SearchNotFound";
import CrudListToolbar from './CrudListToolbar';
import CrudListHeader from './CrudListHeader';
import CrudListMenu from './CrudListMenu';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  loading: {
    width: '100%',
    textAlign: 'center',
    lineHeight: '300px',
    position: "sticky",
    left: "50%",
  },
}));

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

/*
  data: any[]
  headers: {

  },
  pagination: boolean, default true
  onRenderMenu: (rowData) => menu 
*/
export default function CrudList({data, headers, pagination, onRenderMenu}) {
  data = data ?? [];
  headers = headers ?? [];
  pagination = pagination === false ? false : true;

  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data;
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const filteredData = applySortFilter(
    data,
    getComparator(order, orderBy),
    filterName
  );

  const isEmpty = filteredData.length === 0;

  return (
      <>
        <CrudListToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <CrudListHeader
                  order={order}
                  orderBy={orderBy}
                  headLabel={headers}
                  rowCount={data.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, rowIndex) => {
                      return (
                        <TableRow hover key={rowIndex}>
                            <TableCell></TableCell>
                            {headers.map((header) => {
                                if(header.hidden)
                                    return <></>
                                return (
                                    <TableCell align="left">{row[header.id]}</TableCell>
                                )
                            })}
                          <TableCell align="right">
                            <CrudListMenu
                              items={onRenderMenu?.(row)}
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
                {isEmpty && filterName && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
                {isEmpty && !filterName && (
                  <Box className={classes.loading}>
                     <CircularProgress />
                  </Box>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

        {pagination && 
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        }
    </>
  );
}