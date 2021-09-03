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
import ChartHeader from './ChartHeader';
import ChartLoader from './ChartLoader';
import {useState} from 'react';

// ----------------------------------------------------------------------

export default function AppValuesPerMonth() {
  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();
  const [filterYear, setFilterYear] = useState((new Date()).getFullYear());

  const { 
    isLoading: list_isLoading,
    error: list_error,
    data: list_data ,
    refetch: list_refetch
  } = useQuery(['Bar', filterYear], (args) => {
        return axios.get(`${baseUrl}/dashboard/valuespermonths?year=${args.queryKey[1]}`, {
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

  const handleChangeYear = (value) => {
    setFilterYear(value);
    list_refetch();
  }

  const renderHeader = () => {
    return (<ChartHeader 
      year={filterYear}
      title="Valor gasto por mês em" 
      onChangeYear={handleChangeYear}
      showMonth={false}
      showDay={false}
    />)
  }

  return (
    <Card>
      <CardHeader title={renderHeader()} subheader="" />
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
