# Yamagishi Inventory

A React Native/Capacitor inventory management application with advanced background cron functionality and local database management.

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Mobile**: Capacitor (iOS/Android)
- **Database**: SQLite with TypeORM
- **Background Tasks**: Android WorkManager + MinuteTriggerService
- **Build**: Gradle (Android), npm scripts

## Quick Start

### Development Server
```bash
npm install
npm run dev
```

### Android Development
```bash
# Build and run on Android device
npm run build:apk
adb install -r app/build/outputs/apk/debug/app-debug.apk

# Or use Capacitor sync for development
npx cap sync android
npx cap run android
```

## TypeORM Setup

The app uses SQLite with TypeORM for local data persistence:

- **Connection**: `src/database/DatabaseService.ts`
- **Entities**: Background sync logs, user data
- **Migrations**: Auto-generated in `src/database/migrations/`
- **Repository Pattern**: `src/repositories/BackgroundSyncRepository.ts`

Database initializes automatically on app startup with proper connection management and migration handling.

## Cron System

Advanced multi-interval background task system with hybrid execution:

### Architecture
- **MinuteTriggerService**: Java foreground service (1, 5, 15, 30, 60 min intervals)
- **WorkManager**: Android background tasks (15, 30, 60 min when app closed)
- **Pending Task System**: Stores background tasks, executes via JavaScript when app resumes

### Task Types
- **1 Minute Task**: App heartbeat and status checks
- **5 Minute Task**: Local data backup and cache cleanup  
- **15 Minute Task**: Inventory synchronization
- **30 Minute Task**: System health and analytics
- **60 Minute Task**: Database maintenance

### How It Works
1. **App Active**: All tasks execute immediately via JavaScript with database operations
2. **App Inactive**: WorkManager stores pending tasks, executes when app becomes active
3. **Foreground Service**: Continues running even when app is backgrounded
4. **JavaScript Integration**: All database operations handled by TypeORM, not native Java

### Key Files
- `src/services/TriggerBasedCronService.ts` - Main cron coordination
- `android/app/src/main/java/com/example/app/MinuteTriggerService.java` - Foreground service
- `android/app/src/main/java/com/example/app/CronWorker.java` - WorkManager tasks
- `android/app/src/main/java/com/example/app/MainActivity.java` - Pending task execution

The system ensures reliable task execution whether the app is active or completely closed, with all data operations performed safely through JavaScript/TypeORM.