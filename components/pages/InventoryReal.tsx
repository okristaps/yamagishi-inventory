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
import { User } from '../../src/database/entities';
import { DatabaseService } from '../../src/database/typeorm.config';
import { UserRepository } from '../../src/database/repositories/UserRepository';

const InventoryReal: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      console.log('Loading users...');

      const allUsers = await UserRepository.find({ order: { id: 'ASC' } });

      console.log(`Loaded ${allUsers.length} users`);
      setUsers(allUsers);
    } catch (err) {
      console.error('Failed to load users:', err);
      throw err;
    }
  }, []);

  const handleRefresh = async (event: any) => {
    await loadUsers();
    event.detail.complete();
  };

  const handleAddUser = async () => {
    try {
      const name = prompt('User name:');
      if (!name) return;

      const email = prompt('Email (optional):');
      const telephone = prompt('Telephone (optional):');

      await UserRepository.save({
        name,
        email: email || undefined,
        telephone: telephone || undefined
      });

      await loadUsers();
    } catch (error) {
      console.error('Failed to add user:', error);
      alert('Failed to add user');
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle className='bg-green'>Users</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <IonSpinner name="crescent" />
              <p className="mt-4">Initializing database and loading users...</p>
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
            <IonTitle>Users</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonCard color="danger">
            <IonCardContent>
              <h3>Error Loading Users</h3>
              <p>{error}</p>
              <IonButton
                expand="block"
                fill="outline"
                onClick={initializeAndLoadUsers}
                className="mt-4"
              >
                <IonIcon icon={refresh} slot="start" />
                Retry
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
            <div className="flex items-center">
              <IonIcon icon={cube} className="mr-2" />
              Users ({users.length})
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
            Add User
          </IonButton>

          {users.length === 0 ? (
            <IonCard>
              <IonCardContent className="text-center py-8">
                <IonIcon icon={cube} size="large" color="medium" />
                <h3 className="mt-4 mb-2">No Users Found</h3>
                <p className="text-gray-500">Database initialized successfully but no users found</p>
                <IonButton
                  fill="outline"
                  className="mt-4"
                >
                  <IonIcon icon={refresh} slot="start" />
                  Refresh
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
                        <strong>ID:</strong> {user.id}
                      </div>
                      <div>
                        <strong>Email:</strong> {user.email || 'N/A'}
                      </div>
                      <div>
                        <strong>Telephone:</strong> {user.telephone || 'N/A'}
                      </div>
                      <div>
                        <strong>Login PIN:</strong> {user.appsLoginPin ? '****' : 'N/A'}
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </IonList>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default InventoryReal;