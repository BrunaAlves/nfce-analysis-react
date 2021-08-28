import { Box, Grid, Container, Typography } from "@material-ui/core";
import Page from "../components/Page";
import { AppOrderTimeline, AppNewsUpdate } from "../components/_dashboard/app";

export default function CaregoriesPage() {
  return (
    <Page title="Items | Minimal-UI">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">
            Selecione a compra para acessar a lista de itens
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
