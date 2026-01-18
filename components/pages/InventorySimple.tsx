'use client';
import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonIcon,
} from '@ionic/react';
import { cube } from 'ionicons/icons';

const InventorySimple: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <div className="flex items-center">
              <IonIcon icon={cube} className="mr-2" />
              Inventory (Test)
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="p-4">
          <IonCard>
            <IonCardContent>
              <h2>Test Inventory Page</h2>
              <p>This is a simplified version to test if the component rendering works.</p>
              <p>If you can see this, the basic Ionic components are working!</p>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default InventorySimple;