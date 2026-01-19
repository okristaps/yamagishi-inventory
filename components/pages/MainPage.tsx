'use client';
import React, { useEffect, useState, useCallback } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import { add, cube, refresh } from 'ionicons/icons';
import { User } from '@/database/entities';
import { UserRepository } from '@/repositories/UserRepository';
import { triggerCron } from '@/src/services/TriggerBasedCronService';
import { Capacitor } from '@capacitor/core';
import BackgroundSyncHistory from '@/components/BackgroundSyncHistory';
import { useTranslation } from 'react-i18next';

const MainPage: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [triggerCronEnabled, setTriggerCronEnabled] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading users...');

      const allUsers = await UserRepository.find({ order: { id: 'ASC' } });

      console.log(`Loaded ${allUsers.length} users`);
      setUsers(allUsers);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError(err instanceof Error ? err.message : t('user.errorLoading'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const initializeTriggerCron = useCallback(async () => {
    try {
      await triggerCron.initialize();
      setTriggerCronEnabled(true);
      console.log('✅ Trigger-based cron initialized successfully');
      console.log('📝 Java service will send triggers every minute');
      console.log('🎯 Ionic app will decide which tasks to run based on timing');
    } catch (error) {
      console.error('Failed to initialize trigger cron:', error);
      setTriggerCronEnabled(false);
    }
  }, []);

  useEffect(() => {
    initializeTriggerCron();
    loadUsers();
  }, [initializeTriggerCron, loadUsers]);

  const handleRefresh = async (event: any) => {
    await loadUsers();
    event.detail.complete();
  };

  const handleAddUser = async () => {
    try {
      const name = prompt(t('user.name'));
      if (!name) return;

      const email = prompt(t('user.email'));
      const telephone = prompt(t('user.telephone'));

      await UserRepository.save({
        name,
        email: email || undefined,
        telephone: telephone || undefined
      });

      await loadUsers();
    } catch (error) {
      console.error('Failed to add user:', error);
      alert(t('user.failedToAdd'));
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle className='bg-green'>{t('app.users')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <IonSpinner name="crescent" />
              <p className="mt-4">{t('user.loadingUsers')}</p>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (error) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{t('app.users')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonCard color="danger">
            <IonCardContent>
              <h3>{t('user.errorLoading')}</h3>
              <p>{error}</p>
              <IonButton
                expand="block"
                fill="outline"
                className="mt-4"
                onClick={loadUsers}
              >
                <IonIcon icon={refresh} slot="start" />
                {t('user.retry')}
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <IonIcon icon={cube} className="mr-2" />
{t('app.users')} ({users.length})
              </div>
              <div className="flex items-center text-sm">
                <div className={`w-2 h-2 rounded-full mr-2 ${triggerCronEnabled ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                {Capacitor.isNativePlatform() ?
                  (triggerCronEnabled ? t('app.triggerCronActive') : t('app.triggerCronInactive')) :
                  t('app.webMode')
                }
              </div>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="p-4">
          <IonButton
            expand="block"
            className="mb-4"
            color="primary"
            onClick={handleAddUser}
          >
            <IonIcon icon={add} slot="start" />
{t('app.addUser')}
          </IonButton>

          {users.length === 0 ? (
            <IonCard>
              <IonCardContent className="text-center py-8">
                <IonIcon icon={cube} size="large" color="medium" />
                <h3 className="mt-4 mb-2">{t('user.noUsers')}</h3>
                <p className="text-gray-500">{t('user.databaseInitialized')}</p>
                <IonButton
                  fill="outline"
                  className="mt-4"
                  onClick={loadUsers}
                >
                  <IonIcon icon={refresh} slot="start" />
                  {t('user.refresh')}
                </IonButton>
              </IonCardContent>
            </IonCard>
          ) : (
            <IonList>
              {users.map((user) => (
                <IonCard key={user.id} className="mb-4">
                  <IonCardHeader>
                    <IonCardTitle className="text-lg">{user.name}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>{t('user.id')}</strong> {user.id}
                      </div>
                      <div>
                        <strong>Email:</strong> {user.email || 'N/A'}
                      </div>
                      <div>
                        <strong>Telephone:</strong> {user.telephone || 'N/A'}
                      </div>
                      <div>
                        <strong>{t('user.loginPin')}</strong> {user.appsLoginPin ? '****' : 'N/A'}
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </IonList>
          )}

          <div className="mt-6">
            <BackgroundSyncHistory />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MainPage;