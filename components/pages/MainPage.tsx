'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { FaPlus, FaCube, FaSync } from 'react-icons/fa';
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
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="px-4 py-4">
            <h1 className="text-xl font-semibold text-gray-900">{t('app.users')}</h1>
          </div>
        </header>
        <main className="p-4">
          <div className="flex justify-center items-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">{t('user.loadingUsers')}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="px-4 py-4">
            <h1 className="text-xl font-semibold text-gray-900">{t('app.users')}</h1>
          </div>
        </header>
        <main className="p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-800">{t('user.errorLoading')}</h3>
            <p className="text-red-600 mt-2">{error}</p>
            <button
              onClick={loadUsers}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
            >
              <FaSync className="w-4 h-4" />
              {t('user.retry')}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaCube className="w-5 h-5 text-blue-600 mr-2" />
              <h1 className="text-xl font-semibold text-gray-900">
                {t('app.users')} ({users.length})
              </h1>
            </div>
            <div className="flex items-center text-sm">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                triggerCronEnabled ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              <span className="text-gray-600">
                {Capacitor.isNativePlatform() ?
                  (triggerCronEnabled ? t('app.triggerCronActive') : t('app.triggerCronInactive')) :
                  t('app.webMode')
                }
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4">
        <button
          onClick={handleAddUser}
          className="w-full mb-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <FaPlus className="w-4 h-4" />
          {t('app.addUser')}
        </button>

        {users.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FaCube className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="mt-4 mb-2 text-lg font-semibold text-gray-900">{t('user.noUsers')}</h3>
            <p className="text-gray-500 mb-4">{t('user.databaseInitialized')}</p>
            <button
              onClick={loadUsers}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 mx-auto"
            >
              <FaSync className="w-4 h-4" />
              {t('user.refresh')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{user.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">{t('user.id')}</span>{' '}
                    <span className="text-gray-600">{user.id}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>{' '}
                    <span className="text-gray-600">{user.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Telephone:</span>{' '}
                    <span className="text-gray-600">{user.telephone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">{t('user.loginPin')}</span>{' '}
                    <span className="text-gray-600">{user.appsLoginPin ? '****' : 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <BackgroundSyncHistory />
        </div>
      </main>
    </div>
  );
};

export default MainPage;