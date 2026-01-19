package com.example.app;

import android.content.Intent;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "MinuteTrigger")
public class MinuteTriggerPlugin extends Plugin {

    @PluginMethod
    public void startTriggerService(PluginCall call) {
        try {
            Intent serviceIntent = new Intent(getContext(), MinuteTriggerService.class);
            getContext().startForegroundService(serviceIntent);
            
            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("message", "Trigger service started successfully");
            call.resolve(ret);
        } catch (Exception e) {
            JSObject ret = new JSObject();
            ret.put("success", false);
            ret.put("message", "Failed to start trigger service: " + e.getMessage());
            call.reject(ret.toString());
        }
    }

    @PluginMethod
    public void stopTriggerService(PluginCall call) {
        try {
            Intent serviceIntent = new Intent(getContext(), MinuteTriggerService.class);
            getContext().stopService(serviceIntent);
            
            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("message", "Trigger service stopped successfully");
            call.resolve(ret);
        } catch (Exception e) {
            JSObject ret = new JSObject();
            ret.put("success", false);
            ret.put("message", "Failed to stop trigger service: " + e.getMessage());
            call.reject(ret.toString());
        }
    }
}