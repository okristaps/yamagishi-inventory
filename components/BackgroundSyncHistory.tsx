'use client';
import React, { useState, useEffect } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent
} from '@ionic/react';
import { refresh, time, checkmark, alert } from 'ionicons/icons';
import { BackgroundSyncRepository } from '@/repositories/BackgroundSyncRepository';
import { BackgroundSync } from '@/database/entities';

const BackgroundSyncHistory: React.FC = () => {
  const [syncHistory, setSyncHistory] = useState<BackgroundSync[]>([]);
  const [syncStats, setSyncStats] = useState<any[]>([]);

  const loadSyncData = async () => {
    try {

      const history = await BackgroundSyncRepository.getRecentSyncHistory(30);
      setSyncHistory(history);

      const stats = await BackgroundSyncRepository.getSyncStatsByTask();
      setSyncStats(stats);

      console.log('📊 Sync history loaded:', history.length, 'records');
    } catch (error) {
      console.error('Failed to load sync data:', error);
    }
  };

  useEffect(() => {
    loadSyncData();
  }, []);

  const handleRefresh = async (event: any) => {
    await loadSyncData();
    event.detail.complete();
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const getTaskTypeColor = (triggerSource: string) => {
    switch (triggerSource) {
      case 'javascript': return 'primary';
      case 'java': return 'success';
      case 'native': return 'warning';
      default: return 'medium';
    }
  };

  const getAppStateColor = (appState: string) => {
    switch (appState) {
      case 'active': return 'success';
      case 'background': return 'warning';
      case 'closed': return 'danger';
      default: return 'medium';
    }
  };

  return (
    <div>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>

      {/* Statistics Card */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            <div className="flex items-center justify-between">
              <span>📊 Sync Statistics</span>
              <IonButton fill="clear" onClick={loadSyncData}>
                <IonIcon icon={refresh} />
              </IonButton>
            </div>
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Total Records:</strong> {syncHistory.length}
            </div>
            <div>
              <strong>Unique Tasks:</strong> {syncStats.length}
            </div>
          </div>
        </IonCardContent>
      </IonCard>

      {/* Task Statistics */}
      {syncStats.length > 0 && (
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>🎯 Task Summary</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {syncStats.map((stat, index) => (
                <IonItem key={index}>
                  <IonLabel>
                    <h3>{stat.task_name}</h3>
                    <p>Executions: {stat.execution_count}</p>
                    <p>Last run: {formatTimestamp(new Date(stat.last_execution))}</p>
                  </IonLabel>
                  <div slot="end" className="flex gap-2">
                    <IonBadge color={getTaskTypeColor(stat.trigger_source)}>
                      {stat.trigger_source}
                    </IonBadge>
                    <IonBadge color={getAppStateColor(stat.app_state)}>
                      {stat.app_state}
                    </IonBadge>
                  </div>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>
      )}

      {/* Recent Executions */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>📜 Recent Executions</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {syncHistory.length === 0 ? (
            <div className="text-center py-8">
              <IonIcon icon={time} size="large" color="medium" />
              <h3 className="mt-4 mb-2">No sync records yet</h3>
              <p className="text-gray-500">Background tasks will appear here when executed</p>
            </div>
          ) : (
            <IonList>
              {syncHistory.map((sync) => (
                <IonItem key={sync.id}>
                  <IonIcon
                    icon={sync.notes?.includes('failed') ? alert : checkmark}
                    color={sync.notes?.includes('failed') ? 'danger' : 'success'}
                    slot="start"
                  />
                  <IonLabel>
                    <h3>{sync.taskName}</h3>
                    <p>{formatTimestamp(sync.executionTime)}</p>
                    {sync.notes && (
                      <p className="text-sm text-gray-600">{sync.notes}</p>
                    )}
                    {sync.userCount > 0 && (
                      <p className="text-xs">Users: {sync.userCount}</p>
                    )}
                  </IonLabel>
                  <div slot="end" className="flex flex-col gap-1">
                    <IonBadge
                      color={getTaskTypeColor(sync.triggerSource)}
                    >
                      {sync.triggerSource}
                    </IonBadge>
                    <IonBadge
                      color={getAppStateColor(sync.appState)}
                    >
                      {sync.appState}
                    </IonBadge>
                  </div>
                </IonItem>
              ))}
            </IonList>
          )}
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default BackgroundSyncHistory;