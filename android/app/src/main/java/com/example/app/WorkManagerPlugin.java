package com.example.app;

import androidx.work.Constraints;
import androidx.work.Data;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;
import androidx.work.NetworkType;
import androidx.work.BackoffPolicy;
import androidx.work.WorkRequest;
import android.util.Log;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.concurrent.TimeUnit;

@CapacitorPlugin(name = "WorkManagerPlugin")
public class WorkManagerPlugin extends Plugin {
    private static final String TAG = "WorkManagerPlugin";

    @PluginMethod
    public void schedulePeriodicTasks(PluginCall call) {
        try {
            WorkManager workManager = WorkManager.getInstance(getContext());
            
            // Schedule all interval tasks
            scheduleTask(workManager, "1min", 1);
            scheduleTask(workManager, "5min", 5);
            scheduleTask(workManager, "15min", 15);
            scheduleTask(workManager, "30min", 30);
            scheduleTask(workManager, "60min", 60);
            
            Log.d(TAG, "✅ All periodic WorkManager tasks scheduled");
            
            JSObject result = new JSObject();
            result.put("success", true);
            result.put("message", "All periodic tasks scheduled successfully");
            call.resolve(result);
            
        } catch (Exception e) {
            Log.e(TAG, "❌ Failed to schedule periodic tasks", e);
            
            JSObject result = new JSObject();
            result.put("success", false);
            result.put("message", "Failed to schedule tasks: " + e.getMessage());
            call.reject("SCHEDULE_ERROR", "Failed to schedule periodic tasks", e);
        }
    }
    
    @PluginMethod
    public void cancelAllTasks(PluginCall call) {
        try {
            WorkManager workManager = WorkManager.getInstance(getContext());
            
            // Cancel all our periodic tasks
            workManager.cancelUniqueWork("cron_1min");
            workManager.cancelUniqueWork("cron_5min");
            workManager.cancelUniqueWork("cron_15min");
            workManager.cancelUniqueWork("cron_30min");
            workManager.cancelUniqueWork("cron_60min");
            
            Log.d(TAG, "✅ All periodic WorkManager tasks cancelled");
            
            JSObject result = new JSObject();
            result.put("success", true);
            result.put("message", "All periodic tasks cancelled successfully");
            call.resolve(result);
            
        } catch (Exception e) {
            Log.e(TAG, "❌ Failed to cancel periodic tasks", e);
            
            JSObject result = new JSObject();
            result.put("success", false);
            result.put("message", "Failed to cancel tasks: " + e.getMessage());
            call.reject("CANCEL_ERROR", "Failed to cancel periodic tasks", e);
        }
    }
    
    private void scheduleTask(WorkManager workManager, String interval, int intervalMinutes) {
        try {
            // Android requires minimum 15 minutes for WorkManager
            if (intervalMinutes < 15) {
                Log.w(TAG, "⚠️ Skipping " + interval + " - WorkManager requires minimum 15 minutes");
                return;
            }
            
            // Create input data
            Data inputData = new Data.Builder()
                    .putString("interval", interval)
                    .putInt("interval_count", 1)
                    .build();
            
            // Create constraints for background execution
            Constraints constraints = new Constraints.Builder()
                    .setRequiresBatteryNotLow(false)
                    .setRequiresCharging(false)
                    .setRequiresDeviceIdle(false)
                    .setRequiredNetworkType(NetworkType.NOT_REQUIRED)
                    .build();
            
            // Create periodic work request with flex interval for efficiency
            PeriodicWorkRequest workRequest = new PeriodicWorkRequest.Builder(
                    CronWorker.class, 
                    intervalMinutes, 
                    TimeUnit.MINUTES,
                    5, // 5-minute flex interval
                    TimeUnit.MINUTES
            )
                    .setInputData(inputData)
                    .setConstraints(constraints)
                    .setBackoffCriteria(
                        BackoffPolicy.EXPONENTIAL,
                        WorkRequest.MIN_BACKOFF_MILLIS,
                        TimeUnit.MILLISECONDS
                    )
                    .build();
            
            // Schedule with unique name (replaces existing)
            workManager.enqueueUniquePeriodicWork(
                    "cron_" + interval,
                    ExistingPeriodicWorkPolicy.REPLACE,
                    workRequest
            );
            
            Log.d(TAG, "📅 Scheduled " + interval + " WorkManager task (every " + intervalMinutes + " minutes, background-optimized)");
            
        } catch (Exception e) {
            Log.e(TAG, "❌ Failed to schedule " + interval + " task", e);
        }
    }
}