# Notification System Integration Plan

## Overview

This document outlines the comprehensive plan for integrating the notification system across all features of the SVP Platform. The goal is to keep users informed of important updates, deadlines, and activities in real-time.

## Current Implementation

### Notification Infrastructure

| Component | Location | Purpose |
|-----------|----------|---------|
| `notification-service.ts` | `/lib/notification-service.ts` | Core notification service with popup alerts, browser notifications, and calendar reminders |
| `notifications.ts` | `/lib/notifications.ts` | In-app toast notifications mirroring Mattermost |
| `use-notifications.ts` | `/lib/hooks/use-notifications.ts` | React hook for notification state management |
| Notifications Page | `/portal/notifications` | User-facing notification center with settings |

### Notification Types Supported

- **Calendar Reminders** - Alerts before calendar events (15 min, 5 min, at start)
- **Meeting Reminders** - Upcoming meeting notifications
- **Rock/Todo Due** - Task deadline alerts
- **Issue Tracking** - Bug/issue creation and resolution
- **Opportunity Updates** - Pipeline stage changes
- **Project Updates** - Project status changes
- **Deal Updates** - Deal progress notifications
- **Event Registrations** - New attendee registrations
- **Team Updates** - Team member activity
- **System Alerts** - Platform-wide announcements

### Delivery Channels

1. **In-App Toasts** - Sonner toast notifications within the app
2. **Browser Notifications** - Native browser push notifications (requires permission)
3. **Sound Alerts** - Optional audio notification sounds
4. **Notification Center** - Persistent list of all notifications

---

## Integration Plan by Feature

### Phase 1: Core Features (Immediate)

#### 1. Calendar Events ✅ IMPLEMENTED
- **Trigger**: Upcoming calendar events
- **Timing**: 15 minutes, 5 minutes, and at event start
- **Implementation**: `CalendarReminderService` in `notification-service.ts`
- **User Control**: Toggle in Notifications settings

#### 2. Meetings
- **Triggers**:
  - Meeting scheduled (to all attendees)
  - Meeting starting soon (15 min, 5 min)
  - Meeting cancelled
  - Meeting rescheduled
- **Implementation**:
  ```typescript
  // In meetings page after scheduling
  import { NotificationHelpers } from "@/lib/notification-service";
  
  NotificationHelpers.meetingReminder({
    title: meeting.title,
    startTime: meeting.startDate,
    attendees: meeting.attendees
  });
  ```

#### 3. Rocks & Todos
- **Triggers**:
  - Rock due date approaching (7 days, 3 days, 1 day)
  - Rock status changed (On Track → At Risk → Off Track)
  - Rock completed
  - Todo overdue
  - Todo completed
- **Implementation**:
  ```typescript
  NotificationHelpers.rockDue({ title: rock.title, dueDate: rock.dueDate });
  NotificationHelpers.rockStatusChange({ title: rock.title, status: rock.status });
  NotificationHelpers.todoOverdue({ title: todo.title });
  ```

### Phase 2: Business Features

#### 4. Opportunities
- **Triggers**:
  - New opportunity created
  - Opportunity stage changed
  - Opportunity won/lost
  - Follow-up reminder
- **Implementation**:
  ```typescript
  NotificationHelpers.opportunityUpdate({
    title: opportunity.title,
    stage: opportunity.stage
  });
  ```

#### 5. Projects
- **Triggers**:
  - Project created
  - Project status changed
  - Task assigned to user
  - Project milestone reached
  - Project deadline approaching
- **Implementation**:
  ```typescript
  NotificationHelpers.projectUpdate({
    title: project.title,
    update: "Status changed to In Progress"
  });
  ```

#### 6. Deals
- **Triggers**:
  - Deal created
  - Deal stage changed
  - Deal value updated
  - Deal closed (won/lost)
- **Implementation**:
  ```typescript
  NotificationHelpers.dealUpdate({
    title: deal.title,
    status: deal.status
  });
  ```

### Phase 3: Event Management

#### 7. Events (Ticketing)
- **Triggers**:
  - New event registration
  - Payment received
  - Event reminder (24 hours, 1 hour before)
  - Event cancelled
  - Ticket refunded
- **Implementation**:
  ```typescript
  NotificationHelpers.eventRegistration({
    title: event.title,
    attendeeName: registration.name
  });
  NotificationHelpers.eventReminder({
    title: event.title,
    startTime: event.startDate
  });
  ```

### Phase 4: Team & Communication

#### 8. Team Members
- **Triggers**:
  - New team member added
  - Team member role changed
  - Team member deactivated
- **Implementation**:
  ```typescript
  NotificationHelpers.teamMemberUpdate({
    memberName: member.name,
    action: "joined the team"
  });
  ```

#### 9. Affiliates
- **Triggers**:
  - New affiliate joined
  - Referral submitted
  - Commission earned
  - Payout processed

#### 10. Bug Tracker
- **Triggers**:
  - Bug assigned to user
  - Bug status changed
  - Bug priority escalated
  - Bug resolved
- **Implementation**:
  ```typescript
  NotificationHelpers.issueCreated({
    title: bug.title,
    priority: bug.priority
  });
  NotificationHelpers.issueResolved({ title: bug.title });
  ```

### Phase 5: Documents & Content

#### 11. Documents
- **Triggers**:
  - Document shared with user
  - Document requires signature
  - Document signed
  - Document expired

#### 12. Proposals
- **Triggers**:
  - Proposal created
  - Proposal sent to client
  - Proposal viewed by client
  - Proposal accepted/rejected

---

## Implementation Guide

### Adding Notifications to a Feature

1. **Import the notification helpers**:
   ```typescript
   import { 
     showPopupNotification, 
     NotificationHelpers,
     createNotification 
   } from "@/lib/notification-service";
   ```

2. **Trigger notification at the appropriate action**:
   ```typescript
   // After saving/updating data
   const handleSave = async () => {
     await saveToFirestore(data);
     
     // Show immediate popup
     showPopupNotification(
       "opportunity_update",
       "Opportunity Updated",
       `${data.title} moved to ${data.stage}`,
       { priority: "medium" }
     );
     
     // Or use helper
     NotificationHelpers.opportunityUpdate({
       title: data.title,
       stage: data.stage
     });
     
     // Optionally persist to Firestore for notification history
     await createNotification({
       type: "opportunity_update",
       title: "Opportunity Updated",
       message: `${data.title} moved to ${data.stage}`,
       priority: "medium",
       sourceType: "opportunity",
       sourceId: data.id,
       sourceUrl: `/portal/opportunities/${data.id}`
     });
   };
   ```

3. **For scheduled notifications (reminders)**:
   ```typescript
   // Use the CalendarReminderService pattern
   // or create a similar service for the feature
   ```

### User Preferences

Users can control notifications via:
- **Notifications Page** (`/portal/notifications`) - Settings tab
- **Settings Page** (`/portal/settings`) - Notifications tab

Preferences are stored in `localStorage` under `svp_notification_settings`.

---

## Database Schema

### Notifications Collection
```
COLLECTIONS.PLATFORM_SETTINGS/global/notifications
```

```typescript
interface PlatformNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: "low" | "medium" | "high" | "urgent";
  read: boolean;
  dismissed: boolean;
  createdAt: Timestamp;
  scheduledFor?: Timestamp;
  expiresAt?: Timestamp;
  sourceType?: string;
  sourceId?: string;
  sourceUrl?: string;
  userId?: string;
  teamId?: string;
  actions?: { label: string; action: string; url?: string }[];
  metadata?: Record<string, unknown>;
}
```

---

## Future Enhancements

### Email Notifications
- Daily digest of unread notifications
- Critical alerts via email
- Configurable email preferences

### Mobile Push Notifications
- PWA push notification support
- Mobile app integration (if developed)

### Slack/Teams Integration
- Forward notifications to Slack channels
- Microsoft Teams webhook integration

### Smart Notifications
- AI-powered notification batching
- Priority inference based on user behavior
- Quiet hours / Do Not Disturb mode

### Notification Analytics
- Track notification engagement
- A/B test notification content
- Optimize delivery timing

---

## Testing Checklist

- [ ] Calendar event reminders trigger at correct times
- [ ] Browser notification permission flow works
- [ ] Sound notifications play correctly
- [ ] Notification settings persist across sessions
- [ ] Mark as read functionality works
- [ ] Clear all notifications works
- [ ] Notification types can be toggled individually
- [ ] Notifications appear in notification center
- [ ] Links in notifications navigate correctly
- [ ] Notifications don't duplicate

---

## Rollout Plan

| Phase | Features | Timeline |
|-------|----------|----------|
| 1 | Calendar, Meetings, Rocks/Todos | Week 1 |
| 2 | Opportunities, Projects, Deals | Week 2 |
| 3 | Events, Registrations | Week 3 |
| 4 | Team, Affiliates, Bug Tracker | Week 4 |
| 5 | Documents, Proposals | Week 5 |

---

## Related Files

- `/lib/notification-service.ts` - Core notification service
- `/lib/notifications.ts` - Toast notification utilities
- `/lib/hooks/use-notifications.ts` - React notification hook
- `/lib/mattermost.ts` - Mattermost webhook integration
- `/app/(portal)/portal/notifications/page.tsx` - Notification center UI
- `/app/(portal)/portal/settings/page.tsx` - Global settings (notifications tab)
