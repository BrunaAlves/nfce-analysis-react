import { Box, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  emptyData: {
    width: '100%',
    textAlign: 'center',
    lineHeight: '300px',
    color: '#868686'
  },
  loading: {
    width: '100%',
    textAlign: 'center',
    lineHeight: '300px',
  },
  error: {
    width: '100%',
    textAlign: 'center',
    lineHeight: '300px',
    color: '#ca0202a8'
  }
}));

export default function ChartLoader(props) {
  const classes = useStyles();

  const loading = props.loading;

  return (
    <>
      {props.error && (
        <Box className={classes.error}>Ops! Ocorreu um erro ao carregar os dados</Box>
      )}
      {loading  && (
        <Box className={classes.loading}>
          <CircularProgress />
        </Box>
      )}
      {!loading && props.data != null && props.data[props.dataAddress].length === 0 && (
        <Box className={classes.emptyData}>Sem dados</Box>
      )}
      {!loading && props.data != null && props.data[props.dataAddress].length > 0 && (
        <>{props.children}</>
      )}
    </>
  );
}