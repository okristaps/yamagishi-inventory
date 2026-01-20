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

## UI Components

This project includes a comprehensive set of custom UI components built with Tailwind CSS and Radix UI primitives:

### Custom Components (`/components/ui`)
- **Button**: Multiple variants (primary, secondary, outline, destructive, ghost, success, warning, info, text, link) with icon support
- **Card**: Flexible card layouts with header, content, and footer sections  
- **Input/Textarea**: Form controls with labels, validation states, and helper text
- **Badge**: Status indicators with various colors and sizes
- **List**: Material-UI style list components with icons and secondary text

### Radix UI Components
- **Dialog**: Modal dialogs with trigger, content, and actions
- **Select**: Dropdown selection with custom styling
- **Checkbox/Switch**: Toggle controls with labels
- **Dropdown Menu**: Context menus with separators and variants
- **Tooltip**: Hover tooltips with rich content support
- **Popover**: Click-triggered overlays with confirmation variants
- **Progress**: Linear and circular progress indicators
- **Autocomplete**: Search-enabled selection with free solo mode
- **Alert**: Status alerts with multiple severities and variants
- **Chip**: Material-UI style chips with icons and deletion

### Dark Theme Support
All components support dark mode with custom color scheme:
- Page background: `#121212`
- Card background: `#1e1e1e`  
- Input background: `#2a2a2a`

Colors are defined in `tailwind.config.js` as `dark.bg`, `dark.card`, and `dark.input`.

### Usage
```jsx
import { Button, Card, Input, Badge } from '@/components/ui';

// All components support consistent props and styling
<Card>
  <Input label="Email" placeholder="Enter email..." />
  <Button variant="primary">Submit</Button>
  <Badge variant="success">Active</Badge>
</Card>
```

## Background Tasks

Multi-interval cron system with 1, 5, 15, 30, 60 minute intervals. Tasks execute via JavaScript when app is active using MinuteTriggerService foreground service.