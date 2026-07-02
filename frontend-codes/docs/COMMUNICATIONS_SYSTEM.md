# Communications System Overview

This document explains how the NextHive communications system is organized and how a new transaction email can be added.

## 1. Purpose

The communications subsystem turns domain events into user notifications. It currently supports:
- event logging
- email jobs
- email templates
- batch handling for high-volume events
- worker-based delivery via Resend

## 2. Core abstraction layers

### 2.1 Event Types

- File: `domains/communications/events/event-types.ts`
- Purpose: central registry of all communication event names.
- Example values:
  - `SUBMISSION_APPROVED`
  - `PROPOSAL_RAISED`
  - `SPARK_RECEIVED`
  - `ACTIVITY_JOINED`

This file is the source of truth for all publishable communication events.

### 2.2 Publisher / Event Bus

- File: `domains/communications/events/publisher.ts`
- Purpose: receives events from application code and routes them.
- Behavior:
  - logs every event to `EventLog` in the database
  - routes `SPARK_RECEIVED` events into an in-memory batch store
  - sends all other events into the rule engine
- Note: it intentionally does not block the caller on rule evaluation.

### 2.3 Rule engine

- File: `domains/communications/engine/rule-evaluator.ts`
- Purpose: compute which communication jobs should be created for an event.
- Behavior:
  - looks up active `EmailRule` records for `event.type`
  - creates `EmailJob` rows for each matched rule
  - supports delaying jobs via `rule.delay`

This is the main path used today for generating email/send jobs from events.

### 2.4 Batch handling

- Files:
  - `domains/communications/batching/store.ts`
  - `domains/communications/batching/processSparkBatch.ts`
- Purpose: aggregate high-frequency events before sending one summary notification.
- Example: `SPARK_RECEIVED` is buffered until a threshold and then flushed as a single `spark_batch` email job.

### 2.5 Templates

- Files:
  - `domains/communications/templates/index.ts`
  - `domains/communications/templates/*.ts`
- Purpose: build email subject/html from payload + user context.
- Pattern:
  - each template exports a function that returns `{ subject, html }`
  - templates use `baseEmailLayout`, `blocks`, and `renderEmailBlocks`
- Example templates in the repo:
  - `submission_approved.ts`
  - `activity_welcome.ts`
  - `proposal_raised.ts`
  - `proposal_outcome.ts`
  - `spark_batch.ts`

### 2.6 User context

- Files:
  - `domains/communications/utils/getUserContext.ts`
  - `domains/communications/types/user-context.ts`
- Purpose: load recipient data and safe name fields for template personalization.

### 2.7 Delivery worker

- File: `domains/communications/workers/sender.ts`
- Purpose: send pending `EmailJob` rows through the appropriate channel.
- Behavior:
  - loads pending jobs from `EmailJob`
  - locks each job by updating status to `processing`
  - resolves template function from `templates`
  - uses `Resend` to send email for `channel === "email"`
  - marks jobs as `sent`, retries on failure, and escalates after a max retry count
- Important: the worker currently sends email directly through `Resend` and bypasses the placeholder `domains/communications/channels/email.ts` stub.

### 2.8 Cron / scheduled execution

- File: `app/api/cron/process-emails/route.ts`
- Purpose: invoked by Upstash QStash to run `processPendingEmails()`.
- Behavior:
  - verifies Upstash signature in production
  - triggers the worker to process queued jobs

## 3. Database models supporting communications

- `EmailRule`
  - eventType
  - templateKey
  - channel
  - delay
  - isActive
- `EmailJob`
  - userId
  - templateKey
  - payload
  - status
  - channel
  - scheduledAt
  - attempts
- `EventLog`
  - records raw published events for audit and debugging
- `Notification`
  - stores in-app notifications
- `NotificationPreference`
  - supports per-user channel enablement

These models are defined in `prisma/schema.prisma`.

## 4. Typical runtime flow

1. Business code publishes an event via `eventBus.publish({...})`.
2. `domains/communications/events/publisher.ts` logs the event.
3. If event type is batched (`SPARK_RECEIVED`), it is added to the in-memory batch store.
4. Otherwise, the event is passed to `evaluateRulesForEvent()`.
5. Active `EmailRule` records are found for the event type.
6. `EmailJob` rows are created with the configured template and channel.
7. The scheduled worker picks jobs from `EmailJob` and dispatches them.
8. Email templates are rendered with user context and sent via Resend.

## 5. Example event publisher

A real example from the app:

- File: `app/(social)/community/actions.activity.ts`
- Event published on activity join:

```ts
await eventBus.publish({
  type: EVENT_TYPES.ACTIVITY_JOINED,
  userId,
  payload: {
    activityType: activity.type || "Activity",
    activityTitle: activity.title,
    description: activity.description || null,
    startDate: activity.startDate || null,
    deadline: activity.deadline || null,
    points: activity.points || 0,
    isMandatory: activity.isMandatory || false,
    actionUrl: `${baseUrl}/dashboard/activities/${activity.id}`,
  },
});
```

This event is then matched to a rule and turned into a job that renders `activity_welcome`.

## 6. How to add a new transaction email

### Step 1: Add the new event type

In `domains/communications/events/event-types.ts`:

```ts
const EVENT_TYPES = {
  ...
  COURSE_COMPLETED: "Course_Completed",
} as const;
```

### Step 2: Create the email template

Add `domains/communications/templates/course_completed.ts`:

```ts
import { baseEmailLayout } from "../base";
import { blocks } from "../blocks";
import { renderEmailBlocks } from "../renderers/email";

export function courseCompleted(payload: any, user: any) {
  const firstName = user.firstName || user.name?.split(" ")[0] || "Builder";
  const preheader = `You completed ${payload.courseTitle}!`;

  const contentBlocks = [
    blocks.text(`Hey ${firstName},`),
    blocks.heading("Course complete!"),
    blocks.text(`Congratulations on finishing <strong>${payload.courseTitle}</strong>.`),
    blocks.cta("View certificate", payload.certificateUrl),
    blocks.spacer(24),
    blocks.text("Keep building,"),
    blocks.text("<strong>The NextHive Team</strong>"),
  ];

  return {
    subject: `Course completed: ${payload.courseTitle}`,
    html: baseEmailLayout(renderEmailBlocks(contentBlocks), preheader),
  };
}
```

### Step 3: Register the template

Update `domains/communications/templates/index.ts`:

```ts
import { courseCompleted } from "./course_completed";

export const templates = {
  ...
  course_completed: courseCompleted,
};
```

### Step 4: Add or seed an `EmailRule`

Create a rule that maps the event type to the template and email channel. For example, add one in `prisma/seed.ts` or insert a row:

```ts
{
  id: "rule-course-completed",
  eventType: "Course_Completed",
  templateKey: "course_completed",
  delay: 0,
  channel: "email",
  isActive: true,
}
```

### Step 5: Publish the event

Emit the event where the transaction completes:

```ts
await eventBus.publish({
  type: EVENT_TYPES.COURSE_COMPLETED,
  userId: studentId,
  payload: {
    courseTitle: course.title,
    certificateUrl: `${baseUrl}/dashboard/courses/${course.id}/certificate`,
    completedAt: new Date().toISOString(),
  },
});
```

### Step 6: Worker delivery

When the job becomes due, `processPendingEmails()` will:
- load the `EmailJob`
- resolve the template from `templates`
- render the email
- send it through `Resend`
- update the job status to `sent`

## 7. Notes and current behavior

- `domains/communications/channels/email.ts` currently contains a stubbed `sendEmail()` function and is not the main worker path.
- The active email delivery pipeline is implemented in `domains/communications/workers/sender.ts`.
- `app/api/cron/process-emails/route.ts` is the secure endpoint used by Upstash QStash for scheduled dispatch.
- `domains/communications/orchestrator.ts` and `domains/communications/handlers/*` exist as additional routing/handler infrastructure, but the current event bus flow is rule-engine-driven.

## 8. Recommended next improvements

- standardize the event routing path so either rules or immediate handlers are the canonical flow
- wire `domains/communications/channels/email.ts` into the worker if directional channel abstraction is desired
- expose `NotificationPreference` filtering before `EmailJob` creation
- add schema-backed admin tooling for `EmailRule` management
