import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Box, Card, CardHeader } from '@material-ui/core';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../charts';

import config from "../../../config.json";
import axios from "axios";
import AuthService from "../../../services/auth.service";
import { useQuery } from 'react-query';

// ----------------------------------------------------------------------

//const CHART_DATA = [{ data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380] }];

export default function AppValuesPerMonth() {
  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();

  const { 
    isLoading: list_isLoading,
    error: list_error,
    data: list_data ,
    refetch: list_refetch
  } = useQuery('Bar', () => {
        return axios.get(`${baseUrl}/dashboard/valuespermonths?userId=${currentUser.id}&year=2021`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }).then((r) => r.data);
        }
  )

  const chartOptions = merge(BaseOptionChart(), {
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `#${seriesName}`
        }
      }
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '28%', borderRadius: 2 }
    },
    xaxis: {
      categories: list_data ? list_data.label : []
    }
  });

  return (
    <Card>
      <CardHeader title="Valor gasto por mês" subheader="" />
      <Box sx={{ mx: 3 }} dir="ltr">
      {!list_isLoading && list_data != null && 
        <ReactApexChart type="bar" series={[{ data: list_data.series }]} options={chartOptions} height={364} />}
      </Box>
    </Card>
  );
}
