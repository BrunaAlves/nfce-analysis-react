import React from "react";
import Page from "../components/Page";
import AcquisitionList from '../components/_dashboard/acquisition/AcquisitionList';

export default function AcquisitionPage() {
  return (
    <Page title="Acquisitions | NFC-e Análise">
      <AcquisitionList />
    </Page>
  );
}
