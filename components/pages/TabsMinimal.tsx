'use client';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/react';
import { cube, flash, list, cog } from 'ionicons/icons';

const TestPage: React.FC<{ title: string }> = ({ title }) => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div className="p-4">
        <h1>Test {title} Page</h1>
        <p>This is a minimal test page to isolate the null error.</p>
      </div>
    </IonContent>
  </IonPage>
);

const TabsMinimal = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Switch>
          <Route path="/inventory" render={() => <TestPage title="Inventory" />} exact={true} />
          <Route path="/feed" render={() => <TestPage title="Feed" />} exact={true} />
          <Route path="/lists" render={() => <TestPage title="Lists" />} exact={true} />
          <Route path="/settings" render={() => <TestPage title="Settings" />} exact={true} />
          <Route path="" render={() => <Redirect to="/inventory" />} exact={true} />
        </Switch>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="inventory" href="/inventory">
          <IonIcon icon={cube} />
          <IonLabel>Inventory</IonLabel>
        </IonTabButton>
        <IonTabButton tab="feed" href="/feed">
          <IonIcon icon={flash} />
          <IonLabel>Feed</IonLabel>
        </IonTabButton>
        <IonTabButton tab="lists" href="/lists">
          <IonIcon icon={list} />
          <IonLabel>Lists</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href="/settings">
          <IonIcon icon={cog} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabsMinimal;