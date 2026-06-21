# Phase 8 & 9 Setup & Usage Guide

## Phase 8: Admin Dashboard Setup

### Accessing Admin Panel
1. **URL**: `/admin` (only accessible to admin users)
2. **Role Check**: Implemented in layout - non-admins are redirected to `/dashboard`
3. **Admin Link**: Located in dashboard sidebar under "Admin Panel" (for admin users only)

### Admin Features Usage

#### Analytics Dashboard
- **Location**: `/admin`
- Shows real-time metrics:
  - Total users count
  - Total revenue from all payments
  - Number of active draws
  - Total charities in system
  - Platform growth chart
  - Revenue distribution pie chart

#### User Management
- **Location**: `/admin/users`
- **Features**:
  - Search users by email or name
  - View detailed user information
  - See subscription status
  - View user's scores and charities
  - View payment history
- **Usage**: Click "View Details" to open detailed dialog

#### Charity Management
- **Location**: `/admin/charities`
- **Features**:
  - Create new charities with "Add Charity" button
  - Edit existing charities
  - Delete charities (with confirmation)
  - Toggle featured/active status
  - Upload logo, banner, and website URLs
- **Usage**: Click "Edit" or "Delete" on any row, or click "Add Charity" to create

#### Draw Management
- **Location**: `/admin/draws`
- **Draw States**:
  1. **Draft** → `Simulate` → **Simulated** → `Publish` → **Published**
- **Features**:
  - Create draws (set date, month/year, mode, algorithm)
  - Simulate draws (generates random winning numbers)
  - Publish draws (makes results visible)
- **Usage**: 
  1. Click "Create Draw"
  2. Fill form with draw details
  3. Simulate when ready
  4. Publish when validated

#### Winner Management
- **Location**: `/admin/winners`
- **Features**:
  - View all winners with status
  - Filter/sort by status
  - Review winner details
  - Update winner status (pending → approved → paid)
  - Mark as paid
  - Add notes
- **Usage**: 
  1. Click "Review" to open status dialog
  2. Select new status
  3. Add notes if needed
  4. Click "Update Status"

### Admin Server Actions

```typescript
// Examples of using admin actions in components/pages:

import { getAllCharities, updateCharity } from '@/actions/admin.actions';

// Get all charities
const result = await getAllCharities();
if (result.success) {
  const charities = result.data;
}

// Update a charity
const updateResult = await updateCharity(charityId, {
  name: 'New Name',
  featured: true,
  // ... other fields
});
```

---

## Phase 9: Email System Setup

### Environment Configuration

#### 1. Resend Setup
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@greenswing.io
```

To get Resend API key:
1. Go to [Resend.com](https://resend.com)
2. Sign up or login
3. Create new API key
4. Add to `.env.local`

#### 2. Verify Email Domain (Optional but Recommended)
- In Resend dashboard, verify your domain
- This allows using `notifications@yourdomain.com` instead of default

### Email Templates Usage

#### How Templates Work
All templates are React components that accept props:

```typescript
// Example: Welcome Email
import { WelcomeEmail } from '@/lib/email/templates';

<WelcomeEmail 
  fullName="John Doe"
  verificationUrl="https://..."
/>
```

#### Available Templates
1. **WelcomeEmail** - Welcome new users
   - Props: `fullName`, `verificationUrl`

2. **VerificationEmail** - Email verification
   - Props: `fullName`, `verificationUrl`, `code`

3. **ScoreConfirmationEmail** - Score submitted
   - Props: `fullName`, `score`, `date`

4. **DrawResultsEmail** - Draw completed
   - Props: `fullName`, `drawDate`, `winningNumbers`, `userMatches`, `hasPrize`, `prizeAmount`

5. **WinnerNotificationEmail** - User won
   - Props: `fullName`, `drawType`, `prizeAmount`, `drawDate`

6. **PaymentReceiptEmail** - Payment confirmed
   - Props: `fullName`, `amount`, `type`, `date`, `transactionId`

7. **CharityUpdateEmail** - Impact update
   - Props: `fullName`, `charityName`, `amountRaised`

8. **PasswordResetEmail** - Password reset
   - Props: `fullName`, `resetUrl`, `expiresIn`

### Email Service Usage

#### Sending Individual Emails

```typescript
import {
  sendWelcomeEmail,
  sendScoreConfirmationEmail,
  sendDrawResultsEmail,
} from '@/lib/email/service';

// Send welcome email
await sendWelcomeEmail(
  'user@example.com',
  'John Doe',
  'https://app.com/verify'
);

// Send score confirmation
await sendScoreConfirmationEmail(
  'user@example.com',
  'John Doe',
  35,  // score
  '2026-06-21'  // date
);

// Send draw results
await sendDrawResultsEmail(
  'user@example.com',
  'John Doe',
  '2026-06-21',  // draw date
  [5, 12, 23, 31, 40],  // winning numbers
  4,  // matches
  true,  // hasPrize
  50000  // prizeAmount in cents
);
```

#### Sending Bulk Emails

```typescript
import { sendBulkDrawResultsEmails } from '@/lib/email/service';

const drawResults = [
  {
    email: 'user1@example.com',
    fullName: 'User One',
    drawDate: '2026-06-21',
    winningNumbers: [5, 12, 23, 31, 40],
    userMatches: 3,
    hasPrize: true,
    prizeAmount: 25000,
  },
  // ... more users
];

const result = await sendBulkDrawResultsEmails(drawResults);
console.log(`Sent: ${result.successful}, Failed: ${result.failed}`);
```

### Automated Email Flows

#### 1. Authentication
```
User signs up
  ↓
`signUp()` action called
  ↓
Welcome email sent automatically
  ↓
Verification link in email
```

#### 2. Score Submission
```
User submits score
  ↓
`addScore()` action called
  ↓
Score confirmation email sent
  ↓
Email includes score & date
```

#### 3. Draw Results
```
Admin publishes draw
  ↓
`processDrawResults()` triggered
  ↓
Bulk emails sent to all participants
  ↓
Each gets personalized results
```

#### 4. Winner Notification
```
Winner approved in admin
  ↓
`notifyWinners()` called
  ↓
Winner notification emails sent
  ↓
Includes prize amount & type
```

#### 5. Payment Receipt
```
Stripe webhook: invoice.payment_succeeded
  ↓
Payment record created
  ↓
Payment receipt email sent
  ↓
Includes amount & transaction ID
```

### Testing Emails

#### Local Testing
Use Resend's test API key for local testing - emails won't actually send but will be logged.

#### Resend Dashboard
1. Log in to [Resend Dashboard](https://resend.com/emails)
2. See all sent emails
3. Check delivery status
4. View email content

#### Email Preview
Most email clients have preview:
- Gmail: Shows preview in list
- Outlook: Shows preview pane
- Apple Mail: Shows preview

### Common Patterns

#### In Server Actions
```typescript
'use server';

import { sendWelcomeEmail } from '@/lib/email/service';

export async function handleSignUp(data: SignUpInput) {
  // ... validation and DB logic ...
  
  // Send email (non-blocking, fire and forget)
  await sendWelcomeEmail(
    data.email,
    data.fullName,
    verificationUrl
  );
  
  return { success: true };
}
```

#### In Webhook Handlers
```typescript
// In Stripe webhook
case 'invoice.payment_succeeded': {
  // ... update subscription ...
  
  // Send receipt
  await sendPaymentReceiptEmail(
    userEmail,
    userName,
    amount,
    'Subscription',
    date,
    transactionId
  );
  break;
}
```

---

## Troubleshooting

### Email Not Sending
1. Check `RESEND_API_KEY` in `.env.local`
2. Check `EMAIL_FROM` is valid
3. Look for error logs in console
4. Verify recipient email format
5. Check Resend dashboard for failures

### Template Issues
1. Verify all required props passed
2. Check TypeScript types match
3. Use React.createElement for dynamic creation

### Bulk Email Issues
1. Check email addresses format
2. Resend has rate limits (~100/sec)
3. Failed emails are logged
4. Retry mechanism not built-in (add if needed)

---

## Performance Considerations

### Email Sending
- Emails are sent asynchronously (non-blocking)
- No need to await in user-facing flows
- Failures are logged but don't break main operation

### Database Queries
- Admin pages have proper pagination (50 items default)
- Search functionality is implemented client-side (optimize if >1000 users)
- Consider adding backend pagination search for scalability

### Email Rate Limits
- Resend: ~100 emails/second
- Bulk operations are spread across multiple requests
- Monitor usage in Resend dashboard

---

## Best Practices

### Admin Users
✅ Only users with `role: 'admin'` can access `/admin`
✅ All admin actions verify user authentication
✅ Use type-safe validation schemas
✅ Log sensitive operations

### Email System
✅ Always use `await` for email sends (in try-catch)
✅ Provide fallbacks if email fails
✅ Use personalization (fullName, specific details)
✅ Include unsubscribe options for marketing emails
✅ Test templates before major campaigns

---

## Quick Reference

### Admin Routes
- `/admin` - Analytics
- `/admin/users` - User management
- `/admin/charities` - Charity CRUD
- `/admin/draws` - Draw management
- `/admin/winners` - Winner management

### Email Functions
- `sendWelcomeEmail()`
- `sendVerificationEmail()`
- `sendScoreConfirmationEmail()`
- `sendDrawResultsEmail()`
- `sendWinnerNotificationEmail()`
- `sendPaymentReceiptEmail()`
- `sendCharityUpdateEmail()`
- `sendPasswordResetEmail()`
- `sendBulkDrawResultsEmails()`
- `sendBulkCharityUpdates()`

---

## Support & Debugging

Enable debug logging in `src/lib/email/service.ts`:

```typescript
// Add after each email send for logging:
console.log('Email sent:', result);
```

Check Resend webhooks in dashboard:
1. Go to [Resend Webhooks](https://resend.com/api-keys)
2. See delivery events
3. Track bounces and failures
