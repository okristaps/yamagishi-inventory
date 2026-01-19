package com.example.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;
import androidx.core.app.NotificationCompat;
import com.getcapacitor.Bridge;
import com.getcapacitor.JSObject;

public class MinuteTriggerService extends Service {
    private static final String TAG = "MinuteTriggerService";
    private static final String CHANNEL_ID = "minute_trigger_channel";
    private static final int NOTIFICATION_ID = 1001;
    
    private Handler handler;
    private Runnable minuteRunnable;
    private int minuteCount = 0;
    private long startTime;
    
    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "MinuteTriggerService created");
        createNotificationChannel();
        
        handler = new Handler(Looper.getMainLooper());
        startTime = System.currentTimeMillis();
        
        minuteRunnable = new Runnable() {
            @Override
            public void run() {
                minuteCount++;
                sendMultipleIntervalTriggers();
                handler.postDelayed(this, 60000); // 1 minute
            }
        };
    }
    
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "MinuteTriggerService starting");
        
        // Create and start foreground notification
        Notification notification = createNotification();
        startForeground(NOTIFICATION_ID, notification);
        
        // Start the minute timer
        handler.post(minuteRunnable);
        
        return START_STICKY; // Restart if killed
    }
    
    @Override
    public void onDestroy() {
        Log.d(TAG, "MinuteTriggerService destroyed");
        if (handler != null) {
            handler.removeCallbacks(minuteRunnable);
        }
        super.onDestroy();
    }
    
    @Override
    public IBinder onBind(Intent intent) {
        return null; // Not a bound service
    }
    
    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Minute Trigger Service",
                NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Background service for minute-based task triggers");
            
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }
    
    private Notification createNotification() {
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            this, 0, notificationIntent, 
            PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT
        );
        
        return new NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Background Tasks Active")
            .setContentText("Yamagishi Inventory is running background tasks")
            .setSmallIcon(android.R.drawable.ic_dialog_info) // Default system icon
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build();
    }
    
    private void sendMultipleIntervalTriggers() {
        try {
            Log.d(TAG, "Checking triggers at minute #" + minuteCount);
            
            // Get the bridge from MainActivity
            MainActivity mainActivity = MainActivity.getInstance();
            if (mainActivity != null) {
                Bridge bridge = mainActivity.getBridge();
                if (bridge != null) {
                    long currentTime = System.currentTimeMillis();
                    
                    // Always send 1-minute trigger
                    sendTriggerEvent(bridge, "1min", minuteCount, currentTime);
                    
                    // Send 5-minute trigger every 5 minutes
                    if (minuteCount % 5 == 0) {
                        sendTriggerEvent(bridge, "5min", minuteCount / 5, currentTime);
                    }
                    
                    // Send 15-minute trigger every 15 minutes
                    if (minuteCount % 15 == 0) {
                        sendTriggerEvent(bridge, "15min", minuteCount / 15, currentTime);
                    }
                    
                    // Send 30-minute trigger every 30 minutes
                    if (minuteCount % 30 == 0) {
                        sendTriggerEvent(bridge, "30min", minuteCount / 30, currentTime);
                    }
                    
                    // Send 60-minute trigger every 60 minutes
                    if (minuteCount % 60 == 0) {
                        sendTriggerEvent(bridge, "60min", minuteCount / 60, currentTime);
                    }
                } else {
                    Log.w(TAG, "Bridge is null, cannot send triggers");
                }
            } else {
                Log.w(TAG, "MainActivity is null, cannot send triggers");
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to send triggers", e);
        }
    }
    
    private void sendTriggerEvent(Bridge bridge, String interval, int intervalCount, long currentTime) {
        try {
            // Create trigger event data as properly formatted JSON string
            String jsonData = String.format(
                "{\"timestamp\":%d,\"interval\":\"%s\",\"interval_count\":%d,\"total_minutes\":%d,\"current_time\":%d}",
                currentTime, interval, intervalCount, minuteCount, currentTime
            );
            
            // Send event to JavaScript using Capacitor's event system
            bridge.getWebView().post(() -> {
                bridge.eval("window.dispatchEvent(new CustomEvent('cronTrigger', { detail: '" + jsonData + "' }));", null);
            });
            
            Log.d(TAG, interval + " trigger sent successfully: " + jsonData);
        } catch (Exception e) {
            Log.e(TAG, "Failed to send " + interval + " trigger", e);
        }
    }
}