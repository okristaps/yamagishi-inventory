'use client';
import React, { useEffect, useState } from 'react';
import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import TabsClean from './pages/TabsClean';

// Initialize Ionic
setupIonicReact({
  mode: 'ios', // or 'md' for Material Design
});

const AppShellClean: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only render router on client side
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <IonApp>
        <div>Loading...</div>
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <TabsClean />
      </IonReactRouter>
    </IonApp>
  );
};

export default AppShellClean;