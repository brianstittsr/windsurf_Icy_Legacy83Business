# Platform Features Documentation

## Table of Contents
- [Academy / LMS](#academy--lms)
- [Course Shopping Cart](#course-shopping-cart)
- [AI Content Builder](#ai-content-builder)
- [Hero Carousel Management](#hero-carousel-management)
- [Meetings & Availability](#meetings--availability)
- [Event Management](#event-management)
- [Admin Settings](#admin-settings)

---

## Related Documentation

| Document | Description |
|----------|-------------|
| [Getting Started Guide](./workflows/GETTING_STARTED.md) | Initial setup and onboarding |
| [Academy Workflows](./workflows/ACADEMY_WORKFLOWS.md) | Step-by-step course management |
| [AI Content Workflows](./workflows/AI_CONTENT_WORKFLOWS.md) | AI generation tutorials |
| [Admin Workflows](./workflows/ADMIN_WORKFLOWS.md) | Administrative tasks |
| [Meetings & Availability](./workflows/MEETINGS_AVAILABILITY_WORKFLOWS.md) | Scheduling workflows |
| [Troubleshooting & FAQ](./workflows/TROUBLESHOOTING_FAQ.md) | Common issues and solutions |

---

## Academy / LMS

### Overview
A full-featured Learning Management System for creating, managing, and selling online courses.

### Location
- **Public:** `/academy` - Course catalog and enrollment
- **Admin:** `/portal/admin/academy` - Course management

### Features

#### Course Management
- Create courses with title, description, instructor info
- Set difficulty level (beginner, intermediate, advanced)
- Add learning outcomes and prerequisites
- Upload thumbnail images
- Publish/unpublish courses
- Feature courses on homepage

#### Course Pricing
- **Free courses** - Toggle for free enrollment
- **Paid courses** - Set price in USD (stored as cents)
- **Compare-at price** - Show original price with discount
- **Stripe integration** - Automatic product/price creation

#### Course Structure
- **Modules/Sections** - Organize content into logical groups
- **Lessons** - Individual content pieces within modules
- **Reordering** - Drag or arrow buttons to reorder

#### Lesson Content Types
| Type | Description |
|------|-------------|
| Video | Embed from YouTube, Vimeo, Loom, or direct URL |
| Text | Rich markdown content |
| Quiz | Interactive assessments |
| Assignment | Homework with submission |
| Download | PDF, worksheets, resources |
| Live | Scheduled live sessions |

#### Video Embedding
Supported platforms with live preview:
- YouTube (`youtube.com/watch?v=...` or `youtu.be/...`)
- Vimeo (`vimeo.com/...`)
- Loom (`loom.com/share/...`)

---

## Course Shopping Cart

### Overview
A persistent shopping cart for purchasing multiple courses with Stripe checkout.

### Location
- **Cart Page:** `/academy/cart`
- **Success Page:** `/academy/checkout/success`

### Features

#### Cart Functionality
- Add/remove courses
- View cart summary with pricing
- Persistent storage (localStorage)
- Cart badge showing item count

#### Checkout Flow
1. Browse courses → Add to cart
2. Review cart → Enter customer info
3. **Free courses:** Instant enrollment
4. **Paid courses:** Redirect to Stripe Checkout
5. Success page with confirmation

#### Purchase Records
- Stored in `lms_course_purchases` collection
- Tracks payment status (pending, paid, failed, refunded)
- Links to Stripe session/payment intent
- Creates enrollment on successful payment

### Admin Dashboard
Location: `/portal/admin/academy/purchases`

- Total revenue tracking
- Purchase history table
- Filter by status
- Search by customer/course
- Export to CSV

---

## AI Content Builder

### Overview
AI-powered tools for rapidly generating course content including syllabi, lessons, quizzes, and exams.

### Location
`/portal/admin/academy/courses/[id]/content`

### AI Tools

#### 1. Syllabus Generator
Generate a complete course outline from a topic description.

**Inputs:**
- Course topic
- Target audience
- Difficulty level
- Number of modules (3-10)
- Desired learning outcomes
- Additional context

**Outputs:**
- Course title and description
- Learning outcomes
- Prerequisites
- Module structure with lessons
- Estimated durations

**Usage:** Click "Generate Syllabus" → Configure → Preview → Apply

#### 2. Lesson Content Generator
Generate content for individual lessons.

**Supports:**
- Video scripts with `[VISUAL]` and `[B-ROLL]` cues
- Text articles with markdown formatting
- Assignment instructions with rubrics

**Inputs:**
- Lesson title and description
- Content type
- Key points to cover

**Outputs:**
- Main content
- Video script (for video lessons)
- Key takeaways
- Discussion questions

#### 3. Quiz Generator
Generate quiz questions for assessments.

**Question Types:**
- Multiple choice (4 options)
- True/False

**Features:**
- Configurable number of questions
- Difficulty mix (easy/medium/hard)
- Explanations for each answer
- Passing score and time limit

#### 4. Exam Generator
Generate comprehensive exams covering multiple modules.

**Exam Types:**
- Midterm
- Final
- Certification

**Features:**
- Questions distributed across modules
- Section-based organization
- Configurable total questions and time limit

#### 5. Content Enhancement
Quick AI enhancement for existing content.

**Available on:**
- Lesson descriptions
- Text content fields

**Usage:** Click the ✨ Enhance button next to any supported field.

### AI Configuration
The AI features use OpenAI GPT-4o by default. Configure in:
- Environment: `OPENAI_API_KEY`
- Alternative: Set `USE_OLLAMA=true` for local Ollama

---

## Hero Carousel Management

### Overview
Manage the homepage hero carousel slides with full CRUD functionality.

### Location
- **Admin:** `/portal/admin/hero`
- **Frontend:** Homepage (`/`)

### Slide Properties
| Field | Description |
|-------|-------------|
| Badge | Small label above headline |
| Headline | Main title text |
| Highlighted Text | Emphasized portion of headline |
| Subheadline | Supporting description |
| Benefits | List of key points (bullet points) |
| Primary CTA | Main call-to-action button |
| Secondary CTA | Alternative action button |
| Published | Toggle visibility |
| Order | Display sequence |

### Features
- Create new slides via wizard dialog
- Edit existing slides
- Delete with confirmation
- Reorder slides (up/down arrows)
- Publish/unpublish individual slides
- Real-time sync with Firestore

---

## Meetings & Availability

### Meetings Management
Location: `/portal/meetings`

**Features:**
- Create meetings with title, date, time, location
- Virtual meeting support with video links
- Attendee management
- Status tracking (scheduled, completed, cancelled)
- QR code generation for check-in
- Full CRUD operations

### Availability System
Location: `/portal/availability`

**Calendly-style booking system:**
- Weekly availability schedule
- Meeting type definitions
- Buffer time between meetings
- Advance booking limits
- Date overrides/blocked dates
- Booking management with status updates

---

## Event Management

### Overview
Create and manage events with Stripe ticketing.

### Location
- **Public:** `/events` - Event listings
- **Admin:** Event management in portal

### Features
- Multiple ticket types per event
- Stripe payment processing
- Registration tracking
- Attendee management
- Refund support via Stripe

---

## Admin Settings

### Location
`/portal/settings`

### Integration Settings

#### Stripe
- Secret Key
- Publishable Key
- Webhook Secret
- Connection testing

#### OpenAI / LLM
- API Key
- Model selection
- Ollama fallback option

#### Other Integrations
- Mattermost
- Zoom
- DocuSeal
- Apollo
- Go High Level
- LinkedIn

### Feature Visibility
Control which features are visible in the sidebar navigation.

---

## API Endpoints

### AI Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai/course-generate` | POST | Generate course content |
| `/api/ai/enhance-text` | POST | Enhance text with AI |
| `/api/ai/chat` | POST | AI chat interface |

### Stripe Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stripe/course-checkout` | POST | Create course checkout session |
| `/api/stripe/create-checkout` | POST | Create event checkout session |
| `/api/stripe/webhook` | POST | Handle Stripe webhooks |

### Admin Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/backups` | GET/POST | Backup management |
| `/api/admin/backups/[id]` | GET/DELETE | Single backup operations |
| `/api/admin/backups/schedules` | GET/POST | Backup schedules |

---

## Firebase Schema

### LMS Collections

```typescript
// Course
interface CourseDoc {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  instructorName: string;
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  isPublished: boolean;
  isFeatured: boolean;
  priceInCents: number;
  compareAtPriceInCents: number | null;
  isFree: boolean;
  stripePriceId: string | null;
  stripeProductId: string | null;
  // ... more fields
}

// Module
interface CourseModuleDoc {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  sortOrder: number;
}

// Lesson
interface LessonDoc {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  contentType: "video" | "text" | "quiz" | "assignment" | "download" | "live";
  videoUrl: string | null;
  textContent: string | null;
  isPreview: boolean;
  sortOrder: number;
}

// Purchase
interface CoursePurchaseDoc {
  id: string;
  odUserId: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  priceInCents: number;
  totalInCents: number;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  stripeSessionId: string | null;
}
```

### Other Collections
- `hero_slides` - Homepage carousel
- `calendar_events` - Meetings
- `bookings` - Availability bookings
- `team_member_availability` - Booking settings
- `platform_settings` - Global configuration
