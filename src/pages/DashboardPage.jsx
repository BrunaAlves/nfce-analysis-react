import React from 'react';

// material
import { Box, Grid, Container, Typography } from '@material-ui/core';
// components
import Page from '../components/Page';
import {
  AppTasks,
  AppTotalSpentLastMonth,
  AppTotalSpentLastYear,
  TotalSpentCurrentYear,
  AppAcquisition,
  AppTotalSpentCurrentMonth,
  AppOrderTimeline,
  AppCurrentPurchases,
  AppPurchasesPerCategory,
  AppIcmsInfoGraph,
  AppTrafficBySite,
  AppCurrentSubject,
  AppValuesPerMonth,
} from '../components/_dashboard/app';

import ChartHeader from '../components/_dashboard/app/ChartHeader';

export default function DashboardPage() {
  const [filterYear, setFilterYear] = React.useState((new Date()).getFullYear());
  const [filterMonth, setFilterMonth] = React.useState(0);
  const [filterDay, setFilterDay] = React.useState(0);


  const handleChangeYear = (value) => {
    setFilterYear(value);
  }

  const handleChangeMonth = (value) => {
    setFilterMonth(value)
  }

  const handleChangeDay = (value) => {
    setFilterDay(value)
  }

  return (
    <Page title="Dashboard | NFC-e Análise">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Oi, bem-vindo(a) de volta</Typography>

          <Box sx={{display: 'flex',marginTop: 3,marginLeft: '50%'}}>
            <ChartHeader 
                year={filterYear}
                month={filterMonth}
                day={filterDay}
                inline={true}
                title="Filtrar por dia, mês, ano" 
                onChangeYear={handleChangeYear}
                onChangeMonth={handleChangeMonth}
                onChangeDay={handleChangeDay}
              />

          </Box>

        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppTotalSpentCurrentMonth />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppTotalSpentLastMonth />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TotalSpentCurrentYear />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppTotalSpentLastYear />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppValuesPerMonth 
            filterYear={filterYear}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentPurchases 
            filterYear={filterYear}
            filterMonth={filterMonth}
            filterDay={filterDay}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppPurchasesPerCategory
              filterYear={filterYear}
              filterMonth={filterMonth}
              filterDay={filterDay}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppAcquisition />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppIcmsInfoGraph 
            filterYear={filterYear}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline />
          </Grid>

        </Grid>
      </Container>
    </Page>
  );
}
