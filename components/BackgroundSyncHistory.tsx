'use client';
import React, { useState, useEffect } from 'react';
import { FaSync, FaClock, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { BackgroundSyncRepository } from '@/repositories/BackgroundSyncRepository';
import { BackgroundSync } from '@/database/entities';
import { useTranslation } from 'react-i18next';

const BackgroundSyncHistory: React.FC = () => {
  const { t } = useTranslation();
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

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const getTaskTypeColor = (triggerSource: string) => {
    switch (triggerSource) {
      case 'javascript': return 'bg-blue-100 text-blue-700';
      case 'java': return 'bg-green-100 text-green-700';
      case 'native': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAppStateColor = (appState: string) => {
    switch (appState) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'background': return 'bg-yellow-100 text-yellow-700';
      case 'closed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Statistics Card */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            📊 {t('sync.statistics')}
          </h2>
          <button
            onClick={loadSyncData}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaSync className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">{t('sync.totalRecords')}</span>{' '}
            <span className="text-gray-600">{syncHistory.length}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">{t('sync.uniqueTasks')}</span>{' '}
            <span className="text-gray-600">{syncStats.length}</span>
          </div>
        </div>
      </div>

      {/* Task Statistics */}
      {syncStats.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🎯 {t('sync.taskSummary')}</h2>
          <div className="space-y-3">
            {syncStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{stat.task_name}</h3>
                  <p className="text-sm text-gray-600">{t('sync.executions')} {stat.execution_count}</p>
                  <p className="text-sm text-gray-600">{t('sync.lastRun')} {formatTimestamp(new Date(stat.last_execution))}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTaskTypeColor(stat.trigger_source)}`}>
                    {stat.trigger_source}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getAppStateColor(stat.app_state)}`}>
                    {stat.app_state}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Executions */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📜 {t('sync.recentExecutions')}</h2>
        {syncHistory.length === 0 ? (
          <div className="text-center py-8">
            <FaClock className="w-8 h-8 text-gray-400 mx-auto" />
            <h3 className="mt-4 mb-2 text-lg font-semibold text-gray-900">{t('sync.noSyncRecords')}</h3>
            <p className="text-gray-500">{t('sync.backgroundTasksAppear')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {syncHistory.map((sync) => (
              <div key={sync.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="mt-1">
                  {sync.notes?.includes('failed') ? (
                    <FaExclamationTriangle className="w-4 h-4 text-red-500" />
                  ) : (
                    <FaCheck className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{sync.taskName}</h3>
                  <p className="text-sm text-gray-600">{formatTimestamp(sync.executionTime)}</p>
                  {sync.notes && (
                    <p className="text-sm text-gray-600 mt-1">{sync.notes}</p>
                  )}
                  {sync.userCount > 0 && (
                    <p className="text-xs text-gray-500 mt-1">{t('sync.users')} {sync.userCount}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTaskTypeColor(sync.triggerSource)}`}>
                    {sync.triggerSource}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getAppStateColor(sync.appState)}`}>
                    {sync.appState}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BackgroundSyncHistory;