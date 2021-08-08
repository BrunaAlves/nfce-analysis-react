import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box } from '@material-ui/core';
//
import { BaseOptionChart } from '../../charts';

import config from "../../../config.json";
import axios from "axios";
import AuthService from "../../../services/auth.service";
import { useQuery } from 'react-query';

// ----------------------------------------------------------------------



export default function AppIcmsInfoGraph() {
  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();

  const { 
    isLoading: list_isLoading,
    error: list_error,
    data: list_data ,
    refetch: list_refetch
  } = useQuery('Icms', () => {
        return axios.get(`${baseUrl}/dashboard/icms?userId=${currentUser.id}`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }).then((r) => r.data);
        }
  )

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [0, 2, 3] },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['solid', 'gradient', 'solid'] },
    labels: list_data ? list_data.labels : [],
    xaxis: { type: 'datetime' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y} reais`;
          }
          return y;
        }
      }
    }
  });

  return (
    <Card>
      <CardHeader title="ICMS" subheader="" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
      {!list_isLoading && list_data != null && 
        <ReactApexChart type="line" series={list_data.data} options={chartOptions} height={364} />}
      </Box>
    </Card>
  );
}
