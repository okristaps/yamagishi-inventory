package com.example.app;

import android.content.Intent;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static MainActivity instance;
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        instance = this;
        
        // Register the custom plugins
        registerPlugin(MinuteTriggerPlugin.class);
        
        // Start the trigger service immediately
        Intent serviceIntent = new Intent(this, MinuteTriggerService.class);
        startForegroundService(serviceIntent);
    }
    
    @Override
    public void onResume() {
        super.onResume();
        // Execute any pending background tasks when app becomes active
        executePendingTasks();
    }
    
    private void executePendingTasks() {
        try {
            android.content.SharedPreferences prefs = getSharedPreferences("pending_tasks", android.content.Context.MODE_PRIVATE);
            java.util.Map<String, ?> allTasks = prefs.getAll();
            
            if (!allTasks.isEmpty()) {
                android.util.Log.d("MainActivity", "🔄 Found " + allTasks.size() + " pending background tasks to execute");
                
                for (java.util.Map.Entry<String, ?> entry : allTasks.entrySet()) {
                    String taskKey = entry.getKey();
                    String taskData = (String) entry.getValue();
                    
                    if (taskData != null && !taskData.isEmpty()) {
                        // Execute the pending task via JavaScript
                        if (getBridge() != null) {
                            getBridge().getWebView().post(() ->
                                getBridge().eval("window.dispatchEvent(new CustomEvent('cronTrigger', { detail: '" + taskData + "' }));", null)
                            );
                            android.util.Log.d("MainActivity", "📨 Executed pending task: " + taskData);
                        }
                    }
                }
                
                // Clear all pending tasks after execution
                prefs.edit().clear().apply();
                android.util.Log.d("MainActivity", "✅ Cleared all pending tasks");
            }
        } catch (Exception e) {
            android.util.Log.e("MainActivity", "❌ Failed to execute pending tasks", e);
        }
    }
    
    public static MainActivity getInstance() {
        return instance;
    }
    
    @Override
    public void onDestroy() {
        instance = null;
        super.onDestroy();
    }
}
