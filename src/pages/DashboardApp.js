// material
import { Box, Grid, Container, Typography } from '@material-ui/core';
// components
import Page from '../components/Page';
import {
  AppTasks,
  AppTotalSpentLastMonth,
  AppTotalSpentLastYear,
  TotalSpentCurrentYear,
  AppNewsUpdate,
  AppTotalSpentCurrentMonth,
  AppOrderTimeline,
  AppCurrentPurchases,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppCurrentSubject,
  AppValuesPerMonth
} from '../components/_dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {

  return (
    <Page title="Dashboard | Minimal-UI">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Oi, bem-vindo(a) de volta</Typography>
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
            <AppWebsiteVisits />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentPurchases />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppValuesPerMonth />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
