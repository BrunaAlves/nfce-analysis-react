import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Box, Card, CardHeader } from '@material-ui/core';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../charts';

import config from "../../../config.json";
import requester from "../../../utils/requester";
import AuthService from "../../../services/auth.service";
import { useQuery } from 'react-query';
import ChartHeader from './ChartHeader';
import ChartLoader from './ChartLoader';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

export default function AppValuesPerMonth(props) {
  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();
  const [filterYear, setFilterYear] = useState(props.filterYear);

  const { 
    isLoading: list_isLoading,
    error: list_error,
    data: list_data ,
    refetch: list_refetch
  } = useQuery(['Bar', filterYear], (args) => {
        return requester.get(`${baseUrl}/dashboard/valuespermonths?year=${args.queryKey[1]}`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }).then((r) => r.data);
        }
  )

  useEffect(() => {
    setFilterYear(props.filterYear);
  }, [props.filterYear])

  useEffect(() => {
    list_refetch();
  }, [filterYear])

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
      <CardHeader title="Valor gasto por mês " subheader="" />
      <Box sx={{ mx: 3 }} dir="ltr">
        <ChartLoader 
            loading={list_isLoading}
            error={list_error}
            data={list_data}
            dataAddress={"series"}
          > 
          <ReactApexChart type="bar" series={[{ data: list_data ? list_data.series : [] }]} options={chartOptions} height={364} />
        </ChartLoader>
      </Box>
    </Card>
  );
}
