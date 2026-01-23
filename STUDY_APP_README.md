# Study App - Personal Knowledge Management

A personal study app built on top of a React + Firebase Kanban board. This app helps you manage deep study notes with unlimited text, images, and links to your tasks.

## Features

### 📚 Study Topics (Deep Notes)
- Create unlimited study topics with no text length restrictions
- Rich text content for detailed notes
- Upload and embed images (via Cloudinary)
- Link topics to Kanban tasks for better organization
- Auto-save detection

### 📋 Topics List
- View all your study topics in one place
- Full-text search across titles and content
- Sort by last updated
- Quick navigation to any topic

### 🎯 Kanban Board (Existing Feature)
- Todo, In Progress, Blocked, Done columns
- Task management with drag-and-drop
- Bulk operations (select all, delete multiple)
- Date filtering
- View linked topics from tasks

### 🔗 Linking System
- Soft links between topics and tasks
- Bidirectional references (topic ↔ task)
- Visual indicators showing linked items
- Easy attach/detach functionality

## Tech Stack

- **Frontend**: React.js (functional components, hooks)
- **Backend**: Firebase (Firestore + Auth)
- **Media Storage**: Cloudinary SDK (`@cloudinary/url-gen` + `@cloudinary/react`)
- **UI**: Radix UI components + Tailwind CSS
- **State Management**: React hooks

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Cloudinary

The app uses the Cloudinary React SDK for image uploads and optimization.

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Go to Settings → Upload → Add upload preset
3. Create an **unsigned** upload preset named `study_notes`
4. Copy your Cloud Name from the dashboard
5. Update `.env.local`:
   ```
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   ```

### 3. Firebase Setup

Firebase is already configured in `src/lib/firebase.ts`. The app uses:
- **Firestore Collections**:
  - `topics` - Study notes
  - `tasks` - Kanban tasks
  - `users` - User data

### 4. Run the App
```bash
npm run dev
```

## Data Model

### Topic
```typescript
{
  id: string;
  userId: string;
  title: string;
  content: string;  // No length limit
  images: string[]; // Cloudinary URLs
  linkedTaskIds: string[]; // References to tasks
  createdAt: number;
  updatedAt: number;
}
```

### Kanban Task
```typescript
{
  _id: string;
  userId: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "blocked" | "done";
  linkedTopicId?: string; // Reference to topic
  createdAt: number;
  completedAt?: number;
  blockedReason?: string;
}
```

## Usage Guide

### Creating a Study Topic

1. Click on the **Topics List** tab
2. Click **New Topic**
3. Enter a title (e.g., "CAP Theorem")
4. Write your notes in the content area (unlimited length)
5. Add images using the **Add Image** button
6. Link related Kanban tasks
7. Click **Save**

### Searching Topics

1. Go to **Topics List** tab
2. Use the search bar to find topics by title or content
3. Click any topic to open and edit it

### Linking Topics and Tasks

**From a Topic:**
1. Open a topic in the editor
2. Scroll to "Linked Kanban Tasks"
3. Click **Link Task**
4. Select tasks from the list

**From a Task:**
- Linked topics appear as a blue badge on the task card
- Click the topic badge to navigate to it

### Mobile Responsive

The app is fully responsive:
- Tab navigation adapts to mobile screens
- Touch-friendly interfaces
- Optimized layouts for small screens

## Architecture Decisions

### Why Client-Side Search?
For personal use with a reasonable number of topics, client-side filtering is fast and simple. No need for complex Firestore queries or Algolia integration.

### Why Cloudinary?
- Free tier is generous for personal use
- Simple unsigned upload for quick implementation
- Automatic image optimization
- CDN delivery for fast loading

### Why Soft Links?
- Keeps data model simple and flat
- No data duplication
- Easy to maintain referential integrity
- Flexible - can link/unlink anytime

## File Structure

```
src/
├── components/
│   ├── study/
│   │   ├── TabNavigation.tsx      # Tab switcher
│   │   ├── TopicEditor.tsx        # Main editor
│   │   ├── TopicsList.tsx         # List view with search
│   │   ├── LinkedTasksPanel.tsx   # Task linking UI
│   │   └── ImageUploader.tsx      # Cloudinary integration
│   └── kanban/
│       ├── Board.tsx              # Kanban board
│       └── TaskCard.tsx           # Task card (updated)
├── lib/
│   ├── firebase.ts                # Firebase config
│   └── cloudinary.ts              # Upload utility
├── types/
│   └── topic.ts                   # TypeScript interfaces
└── pages/
    └── Dashboard.tsx              # Main app (updated)
```

## Future Enhancements (Optional)

If you want to extend this app:

- [ ] Markdown support in content editor
- [ ] Code syntax highlighting
- [ ] Export topics as PDF/Markdown
- [ ] Tags/categories for topics
- [ ] Favorites/pinned topics
- [ ] Dark mode optimizations
- [ ] Offline support with service workers
- [ ] Backup/restore functionality

## Notes

- This is a **personal use** app - no collaboration features
- No text length limits on notes
- Simple, hackable codebase
- Function over aesthetics (as requested)
- Mobile responsive

## Troubleshooting

### Images not uploading?
- Check your Cloudinary cloud name in `.env.local`
- Ensure you created an unsigned upload preset named `study_notes`
- Check browser console for errors

### Topics not saving?
- Check Firebase console for Firestore rules
- Ensure user is authenticated
- Check browser console for errors

### Search not working?
- Search is case-insensitive and searches both title and content
- Try refreshing the page if topics don't appear

## License

Personal use only.
