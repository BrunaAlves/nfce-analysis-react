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
import ChartLoader from './ChartLoader';
import ChartHeader from './ChartHeader';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function AppIcmsInfoGraph() {
  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();
  const [filterYear, setFilterYear] = useState((new Date()).getFullYear());

  const { 
    isLoading: list_isLoading,
    error: list_error,
    data: list_data ,
    refetch: list_refetch
  } = useQuery(['Icms', filterYear], (args) => {
        return axios.get(`${baseUrl}/dashboard/icms?year=${args.queryKey[1]}`, {
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

  const handleChangeYear = (value) => {
    setFilterYear(value);
    list_refetch();
  }

  const renderHeader = () => {
    return (<ChartHeader 
      year={filterYear}
      title="ICMS em" 
      onChangeYear={handleChangeYear}
      showMonth={false}
      showDay={false}
    />)
  }

  return (
    <Card>
      <CardHeader title={renderHeader(0)} subheader="" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ChartLoader 
            loading={list_isLoading}
            error={list_error}
            data={list_data}
            dataAddress={"data"}
          > 
          <ReactApexChart type="line" series={list_data ? list_data.data : []} options={chartOptions} height={364} />
        </ChartLoader>
      </Box>
    </Card>
  );
}
