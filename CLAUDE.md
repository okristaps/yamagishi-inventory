# Claude Development Guidelines

## UI Component Usage

**IMPORTANT**: Always prioritize using components from the `/components/ui` package.

### Component Hierarchy
1. **First Priority**: Use existing components from `/components/ui`
2. **Second Priority**: Extend existing UI components if needed
3. **Last Resort**: Create new components only if absolutely necessary

### Available UI Components
Import all UI components from the centralized index:
```jsx
import { Button, Card, Input, Badge, Dialog, Select, /* etc */ } from '@/components/ui';
```

### Available Components:
- **Basic**: Button, IconButton, ButtonGroup, Card, Input, Textarea, Badge
- **Layout**: Separator, List components (ListGroup, ListItem, etc.)
- **Form**: Checkbox, Switch, Select, Autocomplete, DatePicker
- **Feedback**: Alert, Progress, CircularProgress, Tooltip
- **Overlay**: Dialog, Popover, DropdownMenu
- **Data**: Chip, AvatarChip

### Dark Theme Colors
Use semantic color names from Tailwind config:
- `dark:bg-dark-bg` - Page background (#121212)
- `dark:bg-dark-card` - Card background (#1e1e1e)  
- `dark:bg-dark-input` - Input background (#2a2a2a)

### Guidelines
- All components support consistent props and theming
- Use gray focus colors instead of blue to match dark aesthetic
- Prefer semantic component variants over custom styling
- Follow existing patterns for props and component structure