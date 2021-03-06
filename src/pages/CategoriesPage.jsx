import React from "react";
import Page from "../components/Page";
import CategoryList from '../components/_dashboard/category/CategoryList';

export default function CategoriesPage() {
  return (
    <Page title="Categories | NFC-e Análise">
      <CategoryList />
    </Page>
  );
}
