'use client';
import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';


setupIonicReact({});

const AppShell = () => {
  return (
    <IonApp>
      <IonReactRouter>
      </IonReactRouter>
    </IonApp>
  );
};

export default AppShell;
