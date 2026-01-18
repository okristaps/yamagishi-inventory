package com.example.app;

import android.content.Intent;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Register the custom plugin
        registerPlugin(MinuteTriggerPlugin.class);
        
        // Start the trigger service immediately
        Intent serviceIntent = new Intent(this, MinuteTriggerService.class);
        startForegroundService(serviceIntent);
    }
}
