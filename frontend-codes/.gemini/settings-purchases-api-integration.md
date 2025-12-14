# Settings & Purchases API Integration

## Overview
This document outlines the API integration implemented for user settings and purchase history in the student dashboard.

## Database Changes

### Prisma Schema Updates
Added new fields to the `User` model to support extended profile information:

```prisma
model User {
  // ... existing fields
  image          String?
  bio            String?
  website        String?
  // ... rest of fields
}
```

**Migration**: Run `npx prisma db push` to apply schema changes.

## API Endpoints Created

### 1. `/api/user/settings` (GET & PATCH)

**Purpose**: Manage user profile settings

**GET Response**:
```typescript
{
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    bio: string | null;
    website: string | null;
  }
}
```

**PATCH Request Body**:
```typescript
{
  name: string;
  email: string;
  bio?: string;
  website?: string;
  avatar?: string;
}
```

**Authentication**: Uses Better Auth session validation
**File**: `app/api/user/settings/route.ts`

### 2. `/api/user/purchases` (GET)

**Purpose**: Fetch user's completed course purchases

**GET Response**:
```typescript
{
  purchases: [
    {
      id: string;
      courseTitle: string;
      courseId: string;
      courseSlug: string;
      amount: number;
      currency: string;
      date: string;
      status: string;
      receiptUrl: string;
    }
  ]
}
```

**Authentication**: Uses Better Auth session validation
**File**: `app/api/user/purchases/route.ts`

## Frontend Integration

### Settings Page Updates (`app/(private routes)/(student)/settings/page.tsx`)

#### 1. Data Fetching
Added `useEffect` hook to fetch user settings and purchases on component mount:

```typescript
useEffect(() => {
  const fetchUserData = async () => {
    const response = await fetch('/api/user/settings');
    // ... populate profileData state
  };

  const fetchPurchases = async () => {
    const response = await fetch('/api/user/purchases');
    // ... populate purchases state
  };

  fetchUserData();
  fetchPurchases();
}, []);
```

#### 2. Profile Update
Replaced mock profile save with real API call:

```typescript
const handleSaveProfile = async () => {
  const response = await fetch('/api/user/settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `${profileData.firstName} ${profileData.lastName}`,
      email: profileData.email,
      bio: profileData.bio,
      website: profileData.website,
      avatar: profileData.avatar,
    }),
  });
  
  if (refetch) refetch(); // Update global context
};
```

#### 3. Purchase History Display
Updated the Billing tab to display real purchase data:

```typescript
{purchases.length === 0 ? (
  <p className="text-center text-gray-500 py-4">No purchase history found.</p>
) : (
  purchases.map((purchase) => (
    <div key={purchase.id}>
      <p className="font-medium">{purchase.courseTitle}</p>
      <p className="text-sm text-gray-500">
        {new Date(purchase.date).toLocaleDateString()}
      </p>
      <p className="font-medium">
        {purchase.currency} {purchase.amount.toLocaleString()}
      </p>
    </div>
  ))
)}
```

### Type Safety Updates

#### Student Context (`app/(private routes)/(student)/studentContext.tsx`)
Updated the `User` interface to make `avatar` required (non-optional):

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string; // Changed from avatar?: string
  enrolledCourses: string[];
  wishlist: string[];
  progress: CourseProgress[];
  achievements: string[];
  preferences: {
    language: string;
    autoplay: boolean;
    quality: string;
  };
}
```

Ensured default value when creating user object:
```typescript
const user: User = {
  // ... other fields
  avatar: authUser?.profile_picture || "",
  // ... rest of fields
};
```

## Security Considerations

1. **Authentication**: All endpoints use Better Auth's `getSession` to verify user identity
2. **Authorization**: Users can only access their own data (filtered by `session.user.id`)
3. **Validation**: Email validation on the backend before updates
4. **Data Filtering**: Only necessary fields are exposed in API responses

## Testing Checklist

- [ ] User can view their current profile information
- [ ] User can update their name, email, bio, and website
- [ ] Profile updates reflect in the global context (header, etc.)
- [ ] Purchase history displays correctly with real data
- [ ] Empty state shows when user has no purchases
- [ ] Unauthorized requests are rejected (401)
- [ ] Invalid email addresses are rejected (400)

## Future Enhancements

1. **Password Change API**: Currently mocked, needs backend implementation
2. **Profile Picture Upload**: Integrate with Cloudinary or similar service
3. **Receipt Generation**: Implement PDF receipt download functionality
4. **Notification Preferences**: Store and apply user notification settings
5. **Two-Factor Authentication**: Implement 2FA backend logic
6. **Session Management**: Real session revocation functionality

## Notes

- The `bio` and `website` fields are optional in the database
- Purchase history only shows completed payments (`status: 'Completed'`)
- The `refetch` function in the settings page updates the global user context
- TypeScript errors related to Prisma types may appear until `npx prisma generate` is run
