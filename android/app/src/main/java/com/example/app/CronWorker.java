package com.example.app;

import android.content.Context;
import android.util.Log;
import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import androidx.work.Data;
import com.getcapacitor.Bridge;
import com.getcapacitor.JSObject;

public class CronWorker extends Worker {
    private static final String TAG = "CronWorker";

    public CronWorker(@NonNull Context context, @NonNull WorkerParameters params) {
        super(context, params);
    }

    @NonNull
    @Override
    public Result doWork() {
        long startTime = System.currentTimeMillis();
        
        try {
            String interval = getInputData().getString("interval");
            int intervalCount = getInputData().getInt("interval_count", 0);
            long currentTime = System.currentTimeMillis();
            
            Log.d(TAG, "🔄 WorkManager executing " + interval + " task (background mode) - PID: " + android.os.Process.myPid());
            
            // Execute task natively - keep within 30-second limit per Capgo recommendations
            executeNativeTask(interval, intervalCount, currentTime);
            
            // ALWAYS try to notify JavaScript - either now if active, or store for later
            boolean jsNotified = notifyJavaScriptIfPossible(interval, intervalCount, currentTime);
            
            if (!jsNotified) {
                // Store pending task for when app becomes active
                storePendingTask(interval, intervalCount, currentTime);
            }
            
            long duration = System.currentTimeMillis() - startTime;
            Log.d(TAG, "✅ WorkManager " + interval + " task completed in " + duration + "ms");
            
            // Always return success to prevent unnecessary retries
            return Result.success();
            
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            Log.e(TAG, "❌ WorkManager task failed after " + duration + "ms", e);
            
            // Return retry for temporary failures, failure for permanent issues
            if (e instanceof SecurityException || e instanceof IllegalStateException) {
                return Result.failure(); // Don't retry security/state errors
            }
            return Result.retry(); // Retry for network/database errors
        }
    }
    
    private void executeNativeTask(String interval, int intervalCount, long currentTime) {
        try {
            // Execute native background task logic if needed
            switch (interval) {
                case "15min":
                    Log.d(TAG, "📦 BACKGROUND: 15-minute WorkManager task executing");
                    break;
                    
                case "30min":
                    Log.d(TAG, "🔍 BACKGROUND: 30-minute WorkManager task executing");
                    break;
                    
                case "60min":
                    Log.d(TAG, "🗄️ BACKGROUND: 60-minute WorkManager task executing");
                    break;
                    
                default:
                    Log.w(TAG, "⚠️ WorkManager - Unknown or unsupported interval: " + interval);
            }
            
            Log.d(TAG, "✅ WorkManager " + interval + " native task completed");
            
        } catch (Exception e) {
            Log.e(TAG, "❌ Failed to execute WorkManager " + interval + " native task", e);
        }
    }
    
    private boolean notifyJavaScriptIfPossible(String interval, int intervalCount, long currentTime) {
        try {
            MainActivity mainActivity = MainActivity.getInstance();
            if (mainActivity != null) {
                Bridge bridge = mainActivity.getBridge();
                if (bridge != null) {
                    // App is active, send event to JavaScript with proper JSON formatting
                    String jsonData = String.format(
                        "{\"timestamp\":%d,\"interval\":\"%s\",\"interval_count\":%d,\"total_minutes\":%d,\"current_time\":%d,\"source\":\"workmanager\"}",
                        currentTime, interval, intervalCount, intervalCount * getIntervalMinutes(interval), currentTime
                    );
                    
                    bridge.getWebView().post(() ->
                        bridge.eval("window.dispatchEvent(new CustomEvent('cronTrigger', { detail: '" + jsonData + "' }));", null)
                    );
                    
                    Log.d(TAG, "📨 Sent " + interval + " WorkManager trigger to JavaScript: " + jsonData);
                    return true;
                } else {
                    Log.d(TAG, "ℹ️ Bridge not available for " + interval + " notification");
                    return false;
                }
            } else {
                Log.d(TAG, "ℹ️ MainActivity not available for " + interval + " notification (app backgrounded)");
                return false;
            }
        } catch (Exception e) {
            Log.d(TAG, "ℹ️ Failed to notify JavaScript for " + interval + " (app likely backgrounded): " + e.getMessage());
            return false;
        }
    }
    
    private void storePendingTask(String interval, int intervalCount, long currentTime) {
        try {
            // Store pending task in SharedPreferences for later execution
            String jsonData = String.format(
                "{\"timestamp\":%d,\"interval\":\"%s\",\"interval_count\":%d,\"total_minutes\":%d,\"current_time\":%d,\"source\":\"workmanager\",\"stored_at\":%d}",
                currentTime, interval, intervalCount, intervalCount * getIntervalMinutes(interval), currentTime, System.currentTimeMillis()
            );
            
            android.content.SharedPreferences prefs = getApplicationContext().getSharedPreferences("pending_tasks", android.content.Context.MODE_PRIVATE);
            
            // Store individual task with unique key
            String taskKey = "task_" + System.currentTimeMillis() + "_" + interval;
            prefs.edit().putString(taskKey, jsonData).apply();
            
            Log.d(TAG, "💾 Stored pending " + interval + " task for later execution: " + jsonData);
        } catch (Exception e) {
            Log.e(TAG, "❌ Failed to store pending task", e);
        }
    }
    
    private int getIntervalMinutes(String interval) {
        switch (interval) {
            case "1min": return 1;
            case "5min": return 5;
            case "15min": return 15;
            case "30min": return 30;
            case "60min": return 60;
            default: return 1;
        }
    }
}