# Trips Feature

This feature manages trip groups and group chat functionality. The structure follows the forum feature pattern with organized components, services, and models.

## Structure

```
trips/
├── components/           # UI Components
│   ├── group-chat-list.tsx      # Enhanced group list with search, create, join
│   ├── create-group-dialog.tsx  # Dialog for creating new groups
│   ├── join-group-dialog.tsx    # Dialog for joining groups via QR
│   ├── group-search-bar.tsx     # Advanced search with filters
│   └── index.ts                 # Component exports
├── models/              # Type definitions
│   └── trip-group.model.ts     # TripGroup, CreateTripGroupData, etc.
├── services/            # API services
│   └── trip-group.service.ts   # API calls for group operations
├── TripChatLayout.tsx   # Main layout component
└── README.md           # This file
```

## Key Features

### 1. Enhanced Group List
- **Search functionality**: Search by group name and location
- **Create new group**: Button to open create group dialog
- **Join group**: QR code scanning and manual code entry
- **Group information**: Shows member count, location, privacy status, and plan status

### 2. Create Group Dialog
- **Basic information**: Title, description, location
- **Date range**: Start and end dates with calendar picker
- **Member settings**: Maximum member count
- **Privacy settings**: Public or private group toggle
- **Form validation**: Required fields and proper data handling

### 3. Join Group Dialog
- **Manual entry**: Input field for QR codes or invite links
- **QR scanning**: Camera-based QR code scanning (placeholder implementation)
- **Tabbed interface**: Switch between manual and scan modes

### 4. Advanced Search
- **Text search**: Search by group name and location
- **Filters**: Location, privacy status, plan status, member count
- **Sorting**: By newest, oldest, member count, or name
- **Active filter display**: Shows applied filters with remove options

## Usage

### Main Trips Page
The main trips page (`/trips`) now uses the chat interface as the primary view instead of the card grid. Users can:
- Browse all available groups in the left sidebar
- Search and filter groups
- Create new groups
- Join existing groups
- Chat with group members

### Individual Trip Page
Individual trip pages (`/trips/[id]`) load the chat interface with the specific group pre-selected.

## Components

### GroupChatList
Enhanced version of the original component with:
- Always-visible search bar
- Create and join group buttons in header
- Better group information display
- Responsive design

### CreateGroupDialog
Modal dialog for creating new groups with:
- Form validation
- Date pickers for trip dates
- Privacy settings
- Member count configuration

### JoinGroupDialog
Modal dialog for joining groups with:
- Manual code entry
- QR code scanning (placeholder)
- Tabbed interface

### GroupSearchBar
Advanced search component with:
- Text search input
- Filter popover with multiple options
- Active filter display
- Clear filters functionality

## API Integration

The `trip-group.service.ts` provides methods for:
- `getAllGroups()`: Fetch all available groups
- `createGroup(data)`: Create a new group
- `joinGroup(data)`: Join a group via QR/code
- `searchGroups(query)`: Search groups
- `getUserGroups(userId)`: Get user's groups

## Models

### TripGroup
Main group interface with:
- Basic info (id, title, description, image)
- Location and date information
- Member management
- Privacy and plan status

### CreateTripGroupData
Data structure for creating new groups

### JoinTripGroupData
Data structure for joining groups

## Notes

- The old card-based trips list view has been replaced
- The chat interface is now the primary view for trips
- All unused code has been removed
- The structure follows the forum feature pattern for consistency
- Mock data is still used but can be easily replaced with real API calls
