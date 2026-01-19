# Yamagishi Inventory

A React Native/Capacitor inventory management application.

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Mobile**: Capacitor (Android)
- **Database**: SQLite with TypeORM
- **Background Tasks**: MinuteTriggerService (foreground service)

## Development

```bash
npm install
npm run dev
```

## Android Development

```bash
# Build and run on Android device
npm run build:apk
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## Database

Uses SQLite with TypeORM for local data persistence. Database initializes automatically on app startup.

## Background Tasks

Multi-interval cron system with 1, 5, 15, 30, 60 minute intervals. Tasks execute via JavaScript when app is active using MinuteTriggerService foreground service.