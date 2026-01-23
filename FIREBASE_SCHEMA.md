# Firebase Firestore Schema Setup

## Collections

### 1. topics
```javascript
// Collection: topics
// Document ID: auto-generated UUID

{
  userId: string,           // User ID from auth
  title: string,            // Topic title
  content: string,          // Full content (no limits)
  images: array<string>,    // Array of Cloudinary URLs
  linkedTaskIds: array<string>, // Array of task IDs
  createdAt: number,        // Timestamp
  updatedAt: number         // Timestamp
}
```

**Indexes needed:**
- `userId` (ascending) + `updatedAt` (descending)

**Security Rules:**
```javascript
match /topics/{topicId} {
  allow read, write: if request.auth != null && 
                        request.auth.uid == resource.data.userId;
  allow create: if request.auth != null && 
                   request.auth.uid == request.resource.data.userId;
}
```

### 2. tasks (existing)
```javascript
// Collection: tasks
// Document ID: auto-generated

{
  userId: string,
  title: string,
  description: string,
  status: string,           // "todo" | "in_progress" | "blocked" | "done"
  linkedTopicId: string,    // NEW: Reference to topic
  createdAt: number,
  updatedAt: number,
  completedAt: number,
  blockedReason: string
}
```

**Indexes needed:**
- `userId` (ascending) + `status` (ascending)
- `userId` (ascending) + `completedAt` (descending)

**Security Rules:**
```javascript
match /tasks/{taskId} {
  allow read, write: if request.auth != null && 
                        request.auth.uid == resource.data.userId;
  allow create: if request.auth != null && 
                   request.auth.uid == request.resource.data.userId;
}
```

## How to Set Up

### Option 1: Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `kanbanboard-3ee63`
3. Navigate to **Firestore Database**
4. Collections will be created automatically when you create your first topic/task
5. Set up security rules in the **Rules** tab

### Option 2: Using Firebase CLI

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize Firestore
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

## Firestore Rules (Complete)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Tasks collection
    match /tasks/{taskId} {
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null && 
                               request.auth.uid == resource.data.userId;
    }
    
    // Topics collection (NEW)
    match /topics/{topicId} {
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null && 
                               request.auth.uid == resource.data.userId;
    }
  }
}
```

## Indexes

Create these composite indexes in Firebase Console:

1. **topics collection:**
   - Collection ID: `topics`
   - Fields: `userId` (Ascending), `updatedAt` (Descending)
   - Query scope: Collection

2. **tasks collection:**
   - Collection ID: `tasks`
   - Fields: `userId` (Ascending), `status` (Ascending)
   - Query scope: Collection

Firebase will prompt you to create these indexes when you first run queries. Just click the link in the console error message.

## Migration (If you have existing tasks)

If you already have tasks in your database, you don't need to migrate them. The `linkedTopicId` field is optional and will be added when you link a topic to a task.

## Testing

After setup, test by:

1. Creating a new topic
2. Checking Firestore console to see the document
3. Creating a task
4. Linking them together
5. Verifying both documents have the correct references
