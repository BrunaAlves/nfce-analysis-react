import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme, styled } from '@material-ui/core/styles';
import { Card, CardHeader, Box, CircularProgress } from '@material-ui/core';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../charts';

import config from "../../../config.json";
import axios from "axios";
import AuthService from "../../../services/auth.service";
import { useQuery } from 'react-query';
import ChartHeader from './ChartHeader.jsx';
import { useState } from 'react';
import ChartLoader from './ChartLoader';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

// ----------------------------------------------------------------------

export default function AppCurrentPurchases() {

  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();
  const [filterYear, setFilterYear] = useState((new Date()).getFullYear());
  const [filterMonth, setFilterMonth] = useState(0);
  const [filterDay, setFilterDay] = useState(0);

  const { 
    isLoading: list_isLoading,
    error: list_error,
    data: list_data ,
    refetch: list_refetch
  } = useQuery(['Pie', filterYear, filterMonth, filterDay], (args) => {
        return axios.get(`${baseUrl}/dashboard/piechart/perlocation?userId=${currentUser.id}&year=${args.queryKey[1]}&month=${args.queryKey[2]}&day=${args.queryKey[3]}`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }).then((r) => r.data);
        }
  )

  const theme = useTheme();
  var chartOptions = merge(BaseOptionChart(), {
    colors: [
      theme.palette.primary.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.error.main
    ],
    labels: list_data ? list_data.label : [],
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `#${seriesName}`
        }
      }
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } }
    }
  });

  const handleChangeYear = (value) => {
    setFilterYear(value);
    list_refetch();
  }

  const handleChangeMonth = (value) => {
    setFilterMonth(value)
    list_refetch();
  }

  const handleChangeDay = (value) => {
    setFilterDay(value)
    list_refetch();
  }

  const renderHeader = () => {
    return (<ChartHeader 
      year={filterYear}
      month={filterMonth}
      day={filterDay}
      inline={false}
      title="Porcentagem de compras por local em" 
      onChangeYear={handleChangeYear}
      onChangeMonth={handleChangeMonth}
      onChangeDay={handleChangeDay}
    />)
  }
  
  return (
    <Card>
      <CardHeader title={renderHeader()} />
      <ChartWrapperStyle dir="ltr">
        <ChartLoader 
          loading={list_isLoading}
          error={list_error}
          data={list_data}
          dataAddress={"series"}
        > 
          <ReactApexChart type="pie" series={list_data ? list_data.series : []} options={chartOptions} height={280} />
        </ChartLoader>
      </ChartWrapperStyle>
    </Card>
  );
}
