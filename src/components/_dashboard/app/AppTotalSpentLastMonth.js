import { Icon } from '@iconify/react';
import scheduleFilled from '@iconify/icons-ant-design/schedule-filled';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';

import config from "../../../config.json";
import axios from "axios";
import AuthService from "../../../services/auth.service";
import { useQuery } from 'react-query';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.info.darker,
  backgroundColor: theme.palette.info.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.info.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.info.dark, 0)} 0%, ${alpha(
    theme.palette.info.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

//const TOTAL = 1352831;

export default function AppTotalSpentLastMonth() {
  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();

  const { 
    isLoading: list_isLoading,
    error: list_error,
    data: total_value ,
    refetch: list_refetch
  } = useQuery('LastMonth', () => {
        return axios.get(`${baseUrl}/dashboard/totallastmonth?userId=${currentUser.id}&year=2021`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }).then((r) => r.data);
        }
  )

  return (
    <RootStyle>
      <IconWrapperStyle>
        <Icon icon={scheduleFilled} width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(total_value)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
      Total gasto no mês anterior
      </Typography>
    </RootStyle>
  );
}
