import {
  Admin, AdminContext, 
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
  DataProvider,
  defaultI18nProvider,
} from "react-admin";
import { Layout } from "./Layout";
import { HashRouter } from "react-router-dom";
import { DbListe, DbCreate, DbEdit } from "./components/db_liste";
import { WerteListen } from "./components/werte_listen";

import * as React from "react";
import localForageDataProvider from 'ra-data-local-forage';

import { useState } from "react";


export const App = () => {
  const [dataProvider, setDataProvider] = React.useState<DataProvider | null>(null);

  const [dbData, setDbData] = useState(Array.of());

  React.useEffect(() => {
    async function startDataProvider() {
      const localForageProvider = await localForageDataProvider();
      setDataProvider(localForageProvider);
    }

    if (dataProvider === null) {
      startDataProvider();
    }
  }, [dataProvider]);

  // hide the admin until the data provider is ready
  if (!dataProvider) return <p>Loading...</p>;
  
  return (
    <AdminContext dataProvider={dataProvider} i18nProvider={defaultI18nProvider}>
      <WerteListen />
   </AdminContext>
  );
};

