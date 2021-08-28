import { Box, CircularProgress } from '@material-ui/core';
import { useState } from 'react';

export default function ChartHeader(props) {
  return (
    <>
      {props.error && (
        <Box>Ops! Ocorreu um erro</Box>
      )}
      {props.loading && (
        <Box>
          <CircularProgress />
        </Box>
      )}
      {!props.loading && props.data != null && props.data[props.dataAddress].length === 0 && (
        <Box>Sem dados</Box>
      )}
      {!props.loading && props.data != null && props.data[props.dataAddress].length > 0 && (
        <>{props.children}</>
      )}
    </>
  );
}