import React from 'react';
// material
import { Box, Grid, Container, Typography } from "@material-ui/core";
// components
import Page from "../components/Page";
import { AppOrderTimeline, AppNewsUpdate } from "../components/_dashboard/app";
import ItemList from '../components/_dashboard/item/ItemList';

import ItemDialog from "../components/_dashboard/nfce/ItemDialog";

// ----------------------------------------------------------------------

export default function ItemsPage() {
  const [selectedNfceId, setSelectedNfecId] = React.useState(null);

  const onSelectNfceHandler = (nfceId) => {
    setSelectedNfecId(nfceId)
  }

  return (
    <Page title="Items | NFC-e Análise">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">
            Selecione a compra para acessar a lista de itens
          </Typography>
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline 
              onSelectNfce={onSelectNfceHandler}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
          <ItemList 
            nfceId={selectedNfceId}
          />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
