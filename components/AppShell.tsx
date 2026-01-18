'use client';
import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import TabsClean from './pages/TabsClean';

setupIonicReact({});

const AppShell = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <TabsClean />
      </IonReactRouter>
    </IonApp>
  );
};

export default AppShell;
