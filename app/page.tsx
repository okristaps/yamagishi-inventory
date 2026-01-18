'use client';
import React, { useEffect, useState } from 'react';
import { IonApp, setupIonicReact } from '@ionic/react';
import MainPage from '../components/pages/MainPage';

// Initialize Ionic
setupIonicReact({
  mode: 'ios', // or 'md' for Material Design
});

export default function Page() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only render on client side
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
      <MainPage />
    </IonApp>
  );
}
