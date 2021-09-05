import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import config from "../../../config.json";
import { Card, Stack, Container, Typography, Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import AuthService from "../../../services/auth.service";
import CrudList from "../../_library/crudlist/CrudList";
import { useQuery } from "react-query";

const useStyles = makeStyles({
  table: {
    minWidth: 20,
  },
});


export default function ItemCategoryMatchTable(props) {
  const classes = useStyles();

  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();

  const {
    isLoading: categoryMatch_isLoading,
    error: categoryMatch_error,
    data: categoryMatch_data
  } = useQuery(["CategoryMatch", props.itemId], (args) => {
    if (props.itemId)
      return axios
        .get(`${baseUrl}/category/match/${props.itemId}`, {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        })
        .then((r) => {
          var list = [];
          for (const property in r.data) {
            list.push({
              name: property,
              value: r.data[property]
            });
          }
          return list;
        });
  });

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Categorias</TableCell>
            <TableCell align="right">Porcentagem de match</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categoryMatch_data && categoryMatch_data.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              
              <TableCell align="right">{row.value}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
