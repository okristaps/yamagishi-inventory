'use client';
import React, { useRef } from 'react';
import { usePageHeader } from '@/components/HeaderContext';
import { ThemeToggle, SimpleThemeToggle } from '@/components/ThemeToggle';
import {
  Button, IconButton, ButtonGroup, Input, Textarea, Card, CardHeader, CardTitle, CardContent, CardFooter, Badge, Page,
  ListGroup, ListItem, ListItemText, ListItemIcon,
  Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogActions,
  Checkbox, Switch, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  Separator, Autocomplete, Select, Tooltip, SimpleTooltip, Popover, PopoverTrigger, PopoverContent,
  ConfirmPopover, DatePicker, Chip, AvatarChip, Alert, SuccessAlert, InfoAlert, WarningAlert, ErrorAlert,
  Progress, CircularProgress
} from '@/components/ui';

// Import some icons for demo
import {
  PlusIcon,
  HeartIcon,
  Share1Icon as ShareIcon,
  DownloadIcon,
  TrashIcon,
  Pencil1Icon as PencilIcon,
  CheckIcon,
  Cross2Icon,
  ReloadIcon
} from '@radix-ui/react-icons';

export default function UILibraryPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = React.useState(false);

  usePageHeader({
    title: 'UI Library',
    subtitle: 'Component showcase (dev only)',
  });

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <Page>
      <div ref={containerRef} className="max-w-4xl mx-auto">

        {/* Reusable UI Components */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Reusable UI Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* All Button Variants */}
              <div>
                <h5 className="font-medium mb-3 text-gray-900 dark:text-gray-100">All Variants</h5>
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="warning">Warning</Button>
                  <Button variant="info">Info</Button>
                  <Button variant="text">Text</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>

              {/* All Button Sizes */}
              <div>
                <h5 className="font-medium mb-3 text-gray-900 dark:text-gray-100">All Sizes</h5>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="xs">Extra Small</Button>
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </div>

              {/* Buttons with Icons */}
              <div>
                <h5 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Buttons with Icons</h5>
                <div className="flex flex-wrap gap-2">
                  <Button leftIcon={<PlusIcon />}>Add Item</Button>
                  <Button variant="success" rightIcon={<CheckIcon />}>Complete</Button>
                  <Button variant="destructive" leftIcon={<TrashIcon />}>Delete</Button>
                  <Button variant="outline" leftIcon={<DownloadIcon />} rightIcon={<ShareIcon />}>Download & Share</Button>
                </div>
              </div>

              {/* Icon Buttons */}
              <div>
                <h5 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Icon Only Buttons</h5>
                <div className="flex flex-wrap gap-2">
                  <IconButton icon={<HeartIcon />} aria-label="Like" variant="ghost" />
                  <IconButton icon={<ShareIcon />} aria-label="Share" variant="outline" />
                  <IconButton icon={<PencilIcon />} aria-label="Edit" variant="primary" />
                  <IconButton icon={<TrashIcon />} aria-label="Delete" variant="destructive" />
                </div>
              </div>

              {/* Button States */}
              <div>
                <h5 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Button States</h5>
                <div className="flex flex-wrap gap-2">
                  <Button>Normal</Button>
                  <Button disabled>Disabled</Button>
                  <Button loading={loading} onClick={handleLoadingDemo}>
                    {loading ? 'Loading...' : 'Click to Load'}
                  </Button>
                  <Button loading leftIcon={<ReloadIcon />}>Processing</Button>
                </div>
              </div>

              {/* Button Groups */}
              <div>
                <h5 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Button Groups</h5>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Horizontal Group:</p>
                    <ButtonGroup>
                      <Button variant="outline" leftIcon={<PencilIcon />}>Edit</Button>
                      <Button variant="outline" leftIcon={<ShareIcon />}>Share</Button>
                      <Button variant="outline" leftIcon={<TrashIcon />}>Delete</Button>
                    </ButtonGroup>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Vertical Group:</p>
                    <ButtonGroup orientation="vertical">
                      <Button variant="ghost">First</Button>
                      <Button variant="ghost">Second</Button>
                      <Button variant="ghost">Third</Button>
                    </ButtonGroup>
                  </div>
                </div>
              </div>

              {/* Full Width Buttons */}
              <div>
                <h5 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Full Width</h5>
                <div className="space-y-2 max-w-md">
                  <Button fullWidth variant="primary" leftIcon={<CheckIcon />}>Submit Form</Button>
                  <Button fullWidth variant="outline">Cancel</Button>
                </div>
              </div>

              <Separator />

              {/* Inputs */}
              <div>
                <h5 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Form Controls</h5>
                <div className="space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="Enter your email..."
                    helperText="We'll never share your email with anyone."
                  />

                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter password..."
                    error="Password must be at least 8 characters"
                  />

                  <Textarea
                    label="Message"
                    placeholder="Enter your message here..."
                    rows={3}
                    helperText="Please be descriptive"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Examples */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
            </CardHeader>
            <CardContent>
              This is a default card with standard styling and border.
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="primary">Action</Button>
            </CardFooter>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
            </CardHeader>
            <CardContent>
              This card has a shadow for elevated appearance.
            </CardContent>
            <CardFooter>
              <Badge variant="success">Active</Badge>
            </CardFooter>
          </Card>

          <Card variant="outline">
            <CardHeader>
              <CardTitle>Outline Card</CardTitle>
            </CardHeader>
            <CardContent>
              This card has a thicker border and transparent background.
            </CardContent>
            <CardFooter>
              <Badge variant="warning">Pending</Badge>
            </CardFooter>
          </Card>
        </div>

        {/* Radix UI Components */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Advanced Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">

              {/* Dialog */}
              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Dialog</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="primary">Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription>
                      This is a sample dialog created with our wrapped Radix UI components.
                    </DialogDescription>
                    <DialogActions>
                      <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button variant="primary">Confirm</Button>
                      </DialogClose>
                    </DialogActions>
                  </DialogContent>
                </Dialog>
              </div>

              <Separator />

              {/* Checkbox and Switch */}
              <div className="space-y-4">
                <Checkbox
                  id="checkbox"
                  label="Accept terms and conditions"
                />

                <Switch
                  id="notifications"
                  label="Enable notifications"
                />
              </div>

              <Separator />

              {/* Dropdown Menu */}
              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Dropdown Menu</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary">Options</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* List Components */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>List Components</CardTitle>
          </CardHeader>
          <CardContent>
            <ListGroup>
              <ListItem>
                <ListItemText
                  primary="List Item 1"
                  secondary="Description for first item"
                />
                <Badge variant="primary">Primary</Badge>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="List Item 2"
                  secondary="Description for second item"
                />
                <Badge variant="success">Active</Badge>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="List Item 3"
                  secondary="Description for third item"
                />
                <Badge variant="error">Error</Badge>
              </ListItem>
              <ListItem onClick={() => console.log('Clicked!')}>
                <ListItemText
                  primary="Clickable Item"
                  secondary="This item responds to clicks"
                />
                <Badge variant="info">Info</Badge>
              </ListItem>
            </ListGroup>
          </CardContent>
        </Card>

        {/* Badge Examples */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Badge Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Default Badges</h4>
                <div className="space-x-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Small Badges</h4>
                <div className="space-x-2">
                  <Badge variant="primary" size="sm">Small</Badge>
                  <Badge variant="success" size="sm">Small</Badge>
                  <Badge variant="error" size="sm">Small</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Large Badges</h4>
                <div className="space-x-2">
                  <Badge variant="primary" size="lg">Large</Badge>
                  <Badge variant="warning" size="lg">Large</Badge>
                  <Badge variant="info" size="lg">Large</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Components */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Advanced Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Autocomplete */}
              <div>
                <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Autocomplete</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Autocomplete
                    label="Countries"
                    placeholder="Search countries..."
                    options={[
                      { value: 'us', label: 'United States' },
                      { value: 'uk', label: 'United Kingdom' },
                      { value: 'fr', label: 'France' },
                      { value: 'de', label: 'Germany' },
                      { value: 'es', label: 'Spain' },
                      { value: 'it', label: 'Italy' },
                      { value: 'jp', label: 'Japan' },
                      { value: 'cn', label: 'China' }
                    ]}
                    onSelectionChange={(option) => console.log('Selected:', option)}
                  />
                  <Autocomplete
                    label="Free Solo Mode"
                    placeholder="Type anything..."
                    options={[
                      { value: 'option1', label: 'Predefined Option 1' },
                      { value: 'option2', label: 'Predefined Option 2' }
                    ]}
                    freeSolo
                    onSelectionChange={(option) => console.log('Free solo:', option)}
                  />
                </div>
              </div>

              <Separator />

              {/* Select */}
              <div>
                <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Select</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Priority"
                    placeholder="Select priority..."
                    options={[
                      { value: 'low', label: 'Low Priority' },
                      { value: 'medium', label: 'Medium Priority' },
                      { value: 'high', label: 'High Priority' },
                      { value: 'urgent', label: 'Urgent' }
                    ]}
                    onValueChange={(value) => console.log('Priority:', value)}
                  />
                  <Select
                    label="Status"
                    placeholder="Select status..."
                    options={[
                      { value: 'draft', label: 'Draft' },
                      { value: 'review', label: 'In Review' },
                      { value: 'approved', label: 'Approved' },
                      { value: 'published', label: 'Published', disabled: true }
                    ]}
                    onValueChange={(value) => console.log('Status:', value)}
                  />
                </div>
              </div>

              <Separator />

              {/* Tooltips */}
              <div>
                <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Tooltips</h4>
                <div className="flex flex-wrap gap-4">
                  <SimpleTooltip text="This is a simple tooltip">
                    <Button variant="outline">Hover me</Button>
                  </SimpleTooltip>

                  <Tooltip content={
                    <div>
                      <strong>Rich Content</strong>
                      <p className="mt-1">You can put any React content in tooltips!</p>
                    </div>
                  }>
                    <Button variant="primary">Rich Tooltip</Button>
                  </Tooltip>

                  <Tooltip content="Left side tooltip" side="left">
                    <Button variant="secondary">Left</Button>
                  </Tooltip>

                  <Tooltip content="Right side tooltip" side="right">
                    <Button variant="ghost">Right</Button>
                  </Tooltip>
                </div>
              </div>

              <Separator />

              {/* Popovers */}
              <div>
                <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Popovers</h4>
                <div className="flex flex-wrap gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">Open Popover</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <h4 className="font-medium mb-2">Popover Title</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        This is a popover with some content. You can put forms, lists, or any other content here.
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm">Action</Button>
                        <Button size="sm" variant="outline">Cancel</Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <ConfirmPopover
                    title="Delete Item"
                    description="Are you sure you want to delete this item? This action cannot be undone."
                    variant="destructive"
                    onConfirm={() => console.log('Confirmed delete')}
                    onCancel={() => console.log('Cancelled')}
                  >
                    <Button variant="destructive">Delete Item</Button>
                  </ConfirmPopover>
                </div>
              </div>

              <Separator />

              {/* Date Picker */}
              <div>
                <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Date Picker</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DatePicker
                    label="Start Date"
                    placeholder="Select start date..."
                    onChange={(date) => console.log('Start date:', date)}
                  />
                  <DatePicker
                    label="End Date"
                    placeholder="Select end date..."
                    minDate={new Date()}
                    onChange={(date) => console.log('End date:', date)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Material-UI Style Components */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Material-UI Style Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Chips */}
              <div>
                <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Chips</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Filled Chips:</p>
                    <div className="flex flex-wrap gap-2">
                      <Chip label="Default" />
                      <Chip label="Primary" color="primary" />
                      <Chip label="Success" color="success" />
                      <Chip label="Warning" color="warning" />
                      <Chip label="Error" color="error" />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Outlined Chips:</p>
                    <div className="flex flex-wrap gap-2">
                      <Chip label="Default" variant="outlined" />
                      <Chip label="Primary" variant="outlined" color="primary" />
                      <Chip label="Success" variant="outlined" color="success" />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Interactive Chips:</p>
                    <div className="flex flex-wrap gap-2">
                      <Chip
                        label="Clickable"
                        clickable
                        onClick={() => console.log('Chip clicked')}
                      />
                      <Chip
                        label="Deletable"
                        deletable
                        onDelete={() => console.log('Chip deleted')}
                      />
                      <Chip
                        label="With Icon"
                        icon={<HeartIcon />}
                        color="error"
                      />
                      <AvatarChip
                        label="Avatar Chip"
                        avatarFallback="AC"
                        color="info"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Alerts */}
              <div>
                <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Alerts</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Standard Alerts:</p>
                    <div className="space-y-2">
                      <SuccessAlert onClose={() => console.log('Closed')}>
                        This is a success alert with a close button!
                      </SuccessAlert>
                      <InfoAlert title="Information">
                        This is an info alert with a title.
                      </InfoAlert>
                      <WarningAlert>
                        This is a warning alert - something needs attention.
                      </WarningAlert>
                      <ErrorAlert title="Error occurred">
                        This is an error alert indicating something went wrong.
                      </ErrorAlert>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Filled Alerts:</p>
                    <div className="space-y-2">
                      <Alert severity="success" variant="filled">
                        Filled success alert with white text
                      </Alert>
                      <Alert severity="info" variant="filled" title="Important">
                        Filled info alert with title
                      </Alert>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Outlined Alerts:</p>
                    <div className="space-y-2">
                      <Alert severity="warning" variant="outlined">
                        Outlined warning alert
                      </Alert>
                      <Alert severity="error" variant="outlined" title="Error">
                        Outlined error alert with title
                      </Alert>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Progress */}
              <div>
                <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Progress Indicators</h4>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Linear Progress:</p>
                    <div className="space-y-4">
                      <Progress value={25} showLabel label="Basic Progress" />
                      <Progress value={50} color="success" showLabel label="Success Progress" />
                      <Progress value={75} color="warning" size="lg" showLabel label="Large Warning" />
                      <Progress value={90} color="error" showLabel label="Almost Complete" />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Circular Progress:</p>
                    <div className="flex flex-wrap items-center gap-4">
                      <CircularProgress value={25} showLabel />
                      <CircularProgress value={50} color="success" size={50} showLabel />
                      <CircularProgress value={75} color="warning" size={60} thickness={6} showLabel />
                      <CircularProgress variant="indeterminate" color="primary" size={40} />
                      <CircularProgress variant="indeterminate" color="info" size={30} />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Indeterminate Progress:</p>
                    <div className="space-y-4">
                      <Progress variant="indeterminate" label="Loading..." />
                      <Progress variant="indeterminate" color="info" size="sm" label="Processing..." />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
