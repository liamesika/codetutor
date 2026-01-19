# CodeTutor AI Mentor Feature Documentation

## Overview

The AI Mentor is an intelligent tutoring assistant that helps students debug their code and understand programming concepts without directly providing solutions. It uses OpenAI's GPT models combined with deterministic error classification to provide targeted, pedagogically-sound guidance.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Error Classification](#error-classification)
5. [OpenAI Integration](#openai-integration)
6. [Rate Limiting](#rate-limiting)
7. [UI Components](#ui-components)
8. [Admin Configuration](#admin-configuration)
9. [Security & Guardrails](#security--guardrails)
10. [Testing](#testing)

---

## Architecture Overview

### System Flow

```
Student Code Execution Fails
           ↓
   "Ask AI Mentor" Button
           ↓
   Pre-AI Classification (Deterministic)
           ↓
   OpenAI API Call (if needed)
           ↓
   Response Generation
           ↓
   Progressive Hints UI
```

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Error Classifier | `src/lib/mentor/error-classifier.ts` | Deterministic pre-AI analysis |
| Mentor Service | `src/lib/mentor/mentor-service.ts` | OpenAI integration & response generation |
| API Endpoint | `src/app/api/mentor/analyze/route.ts` | REST API for mentor requests |
| Mentor Panel | `src/components/mentor/mentor-panel.tsx` | UI component |
| Admin Config API | `src/app/api/admin/mentor/config/route.ts` | Admin configuration |
| Admin Stats API | `src/app/api/admin/mentor/stats/route.ts` | Usage analytics |

---

## Database Schema

### MentorMessage Model

Stores all mentor interactions for analytics and improvement.

```prisma
model MentorMessage {
  id              String   @id @default(cuid())
  userId          String
  questionId      String?
  weekId          String?
  inputSnapshot   Json     // Code, errors, test results
  output          Json     // AI response
  errorCategory   MentorErrorCategory?
  confidence      Float?
  preClassification Json?  // Deterministic classifier output
  responseTimeMs  Int?
  modelUsed       String?
  tokensUsed      Int?
  createdAt       DateTime @default(now())

  user     User      @relation(fields: [userId], references: [id])
  question Question? @relation(fields: [questionId], references: [id])
  week     Week?     @relation(fields: [weekId], references: [id])
}
```

### MentorConfig Model

Global configuration for the mentor feature.

```prisma
model MentorConfig {
  id                   String   @id @default(cuid())
  mentorEnabled        Boolean  @default(true)
  maxCallsPerDay       Int      @default(50)
  systemPromptOverride String?  @db.Text
  allowedModels        String[] @default(["gpt-4o-mini"])
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}
```

### MentorErrorCategory Enum

```prisma
enum MentorErrorCategory {
  SYNTAX
  LOGIC
  EDGE_CASE
  TIMEOUT
  OUTPUT_FORMAT
  NULL_HANDLING
  OFF_BY_ONE
  TYPE_ERROR
  RUNTIME_ERROR
  OTHER
}
```

---

## API Endpoints

### POST /api/mentor/analyze

Analyzes student code and returns guidance.

**Request Body:**

```typescript
{
  questionId: string;      // Required
  code: string;            // Required - student's code
  status: string;          // Required - execution status
  compileError?: string;   // Compilation error if any
  runtimeError?: string;   // Runtime error if any
  stderr?: string;         // Standard error output
  testResults?: Array<{
    input: string;
    expected: string;
    actual: string | null;
    passed: boolean;
  }>;
  executionMs?: number;
}
```

**Response:**

```typescript
{
  errorCategory: string;
  shortDiagnosis: string;
  reasoningHint: string;
  guidingQuestions: string[]; // Exactly 2
  progressiveHints: string[]; // Exactly 3
  nextActions: string[];      // Max 3
  confidence: number;         // 0-1
  preClassification?: object; // Deterministic analysis
}
```

**Error Responses:**

| Status | Reason |
|--------|--------|
| 401 | Unauthorized - not logged in |
| 400 | Validation error |
| 429 | Rate limit exceeded |
| 500 | Server error |

### GET /api/mentor/analyze

Retrieves mentor history for the current user.

**Query Parameters:**

- `questionId` (optional): Filter by question
- `limit` (optional): Max results (default: 10)

### GET /api/admin/mentor/config

Returns current mentor configuration. Admin only.

### PUT /api/admin/mentor/config

Updates mentor configuration. Admin only.

**Request Body:**

```typescript
{
  mentorEnabled?: boolean;
  maxCallsPerDay?: number;   // 1-500
  systemPromptOverride?: string | null;
  allowedModels?: string[];
}
```

### GET /api/admin/mentor/stats

Returns mentor usage statistics. Admin only.

**Response:**

```typescript
{
  totalMessages: number;
  todayMessages: number;
  weekMessages: number;
  uniqueUsers: number;
  averageResponseTimeMs: number;
  totalTokensUsed: number;
  averageConfidence: number | null;
  categoryDistribution: Array<{
    category: string;
    count: number;
  }>;
  topQuestions: Array<{
    questionId: string;
    count: number;
    title: string;
  }>;
}
```

---

## Error Classification

The pre-AI classifier analyzes errors deterministically before calling OpenAI, reducing latency and cost.

### Classification Categories

| Category | Detection Signals |
|----------|-------------------|
| SYNTAX | Missing semicolons, brackets, keywords |
| TYPE_ERROR | Type mismatch, incompatible types |
| NULL_HANDLING | NullPointerException |
| OFF_BY_ONE | ArrayIndexOutOfBounds, off-by-one in tests |
| OUTPUT_FORMAT | Whitespace, case, newline differences |
| TIMEOUT | Execution time limit exceeded |
| RUNTIME_ERROR | Generic runtime exceptions |
| LOGIC | Incorrect output with correct format |
| EDGE_CASE | Boundary condition failures |
| OTHER | Unclassified errors |

### Classification Output

```typescript
interface ClassificationOutput {
  category: MentorErrorCategory;
  severity: "low" | "medium" | "high";
  keySignals: string[];
  patternMatches: string[];
  suggestedFocus: string;
  testAnalysis?: {
    passedCount: number;
    failedCount: number;
    firstFailure?: object;
  };
}
```

---

## OpenAI Integration

### Model Selection

Default: `gpt-4o-mini` (cost-effective, fast)
Alternative: `gpt-4o` (higher accuracy)

### System Prompt

The system prompt includes:

1. **Role definition**: Socratic tutor that guides without giving answers
2. **Topic constraints**: Only reference concepts from current week
3. **Response format**: Structured JSON with required fields
4. **Guardrails**: Never provide full solutions

### Token Management

- Input tokens: ~1000-2000 (code + context)
- Output tokens: ~300-500 (structured response)
- Temperature: 0.3 (consistent, focused)

---

## Rate Limiting

### Per-User Limits

- **Per minute**: 10 requests (Redis-based)
- **Per day**: Configurable via admin (default: 50)

### Implementation

Uses Redis/Upstash for distributed rate limiting:

```typescript
export async function checkMentorRateLimit(userId: string): Promise<RateLimitResult> {
  return checkRateLimit(`ratelimit:mentor:${userId}`, {
    windowMs: 60000,
    maxRequests: 10
  })
}
```

---

## UI Components

### MentorPanel

Full-featured panel with:

- Error category badge
- Short diagnosis
- Reasoning hint
- Guiding questions (expandable)
- Progressive hints (reveal one at a time)
- Next actions
- Confidence indicator

### MentorButton

Compact button variant for triggering mentor.

### Integration Points

- `src/components/practice/results-panel.tsx`: Shows "Ask AI Mentor" button after failures
- `src/app/(dashboard)/practice/[questionId]/page.tsx`: Passes required props

---

## Admin Configuration

### Settings Location

Admin Dashboard → Settings → AI Mentor Configuration

### Configurable Options

| Setting | Default | Description |
|---------|---------|-------------|
| Enable AI Mentor | true | Toggle mentor feature on/off |
| Max Calls Per Day | 50 | Per-user daily limit |
| AI Model | gpt-4o-mini | OpenAI model selection |

### Usage Statistics Dashboard

- Today's messages
- This week's messages
- Unique users
- Average response time
- Total tokens used
- Error category distribution
- Top questions triggering mentor

---

## Security & Guardrails

### Solution Protection

The system prevents providing full solutions through:

1. **System prompt instructions**: Explicit prohibition
2. **Response validation**: Pattern matching for code blocks
3. **Topic restrictions**: Only current week concepts

### Anti-Pattern Detection

```typescript
function containsFullSolution(text: string): boolean {
  const patterns = [
    /public\s+static\s+void\s+main/,
    /for\s*\([^)]+\)\s*\{[\s\S]{50,}\}/,
    /class\s+\w+\s*\{[\s\S]{100,}\}/,
  ];
  return patterns.some(p => p.test(text));
}
```

### Hidden Test Protection

Hidden test inputs/outputs are never sent to the AI.

---

## Testing

### Unit Tests

Located in `src/lib/mentor/__tests__/` and `src/app/api/mentor/__tests__/`

**Test Coverage:**

- Error classifier accuracy
- API authentication
- Input validation
- Rate limiting
- Response schema validation
- Guardrail enforcement

### E2E Tests

Located in `e2e/mentor.spec.ts`

**Test Scenarios:**

- Mentor button visibility after failures
- Mentor panel display
- Admin configuration UI
- Rate limiting behavior

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| OPENAI_API_KEY | Yes | OpenAI API key (server-side only) |

---

## File Reference

### Core Files

```
src/
├── lib/
│   └── mentor/
│       ├── error-classifier.ts      # Pre-AI classification
│       ├── mentor-service.ts        # OpenAI integration
│       └── __tests__/
│           └── error-classifier.test.ts
├── app/
│   └── api/
│       └── mentor/
│           ├── analyze/
│           │   └── route.ts         # Main API endpoint
│           └── __tests__/
│               └── analyze.test.ts
├── components/
│   └── mentor/
│       └── mentor-panel.tsx         # UI component
└── app/
    └── (admin)/
        └── admin/
            └── settings/
                └── page.tsx         # Admin config UI
```

### Database

```
prisma/
└── schema.prisma                    # MentorMessage, MentorConfig models
```

---

## Changelog

### v1.0.0 (Initial Release)

- Deterministic error classification
- OpenAI GPT-4o-mini integration
- Progressive hints UI
- Admin configuration panel
- Rate limiting
- Usage analytics
- Comprehensive test suite

---

*Document Version: 1.0.0*
*Last Updated: January 2026*
*Generated for CodeTutor Platform*
