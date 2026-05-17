# Implementation Plan - Office Manager Dashboard

## Tech Stack (All Free)

### Database & Real-time
- **Supabase** (PostgreSQL + real-time pubsub)
  - Free tier: 500 MB database, unlimited real-time connections
  - Built-in auth, real-time subscriptions

### Frontend
- **React** (Vite for fast dev)
- **Tailwind CSS** (clean, minimal UI)
- **Supabase JS client** (handles real-time subscriptions)
- **Deployed on Vercel** (free tier)

### Backend
- **Node.js + Express**
- **Supabase client** (PostgreSQL queries)
- **Deployed on Vercel** (serverless functions or Node.js runtime)
- **Google OAuth + Supabase Auth**
- **Gmail & Google Calendar APIs**
- **Claude API** (Anthropic - paid by query)

### Integrations
- **Google OAuth** (free)
- **Google Calendar API** (free)
- **Gmail API** (free)
- **Claude API** (minimal usage, paid per token)

---

## Project Structure (Monorepo)

```
vc-dashboard/
├── apps/
│   ├── backend/          # Express API
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── services/
│   │   └── server.js
│   │
│   └── frontend/         # React app
│       ├── src/
│       │   ├── pages/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── services/
│       │   └── App.jsx
│       └── vite.config.js
│
├── packages/
│   └── shared/           # Shared types, utils
│
├── .env.example
└── package.json (root)
```

---

## Implementation Phases (3-4 Days)

### Phase 1: Setup (Day 1 morning - 2 hours)
- [ ] Initialize monorepo structure
- [ ] Set up Supabase project (free tier)
- [ ] Create PostgreSQL schema (7 tables)
- [ ] Set up Express server + routes skeleton
- [ ] Set up React + Vite frontend
- [ ] Configure environment variables
- [ ] Set up basic auth (email/password + Google OAuth)

### Phase 2: Core Backend (Day 1 afternoon - 4 hours)
- [ ] User authentication endpoints
- [ ] CRUD endpoints for all 7 data models
- [ ] Supabase real-time subscriptions setup
- [ ] Error handling & validation
- [ ] Environment setup for local dev

### Phase 3: Core Frontend (Day 2 - 6 hours)
- [ ] Login/auth flow
- [ ] Main layout + navigation
- [ ] Dashboard tab (schedule, stats)
- [ ] Email tab (Gmail integration)
- [ ] Events tab (calendar + list view)
- [ ] Office tab (supplies, vendors)
- [ ] Team tab (member list, status)
- [ ] Onboarding tab (checklist)
- [ ] AI chat sidebar

### Phase 4: Integrations & Features (Day 3 - 6 hours)
- [ ] Google Calendar sync (read two-way)
- [ ] Gmail API integration (email list, parsing)
- [ ] Claude AI chat with context
- [ ] Real-time updates (Supabase subscriptions)
- [ ] Budget tracking & basic reports
- [ ] Theme toggle (dark/light)
- [ ] Mobile responsive design

### Phase 5: Sample Data & Polish (Day 4 - 3 hours)
- [ ] Create seed data (10-11 portfolio companies, events, team, etc.)
- [ ] Error states, loading states, form validation
- [ ] Testing core flows manually
- [ ] Documentation & setup guide

### Phase 6: Deployment (Day 4 - 1 hour)
- [ ] Deploy Supabase
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Vercel
- [ ] Test production environment
- [ ] Create `.env.example` for setup

---

## Database Schema

```sql
-- Users (managed by Supabase Auth)
-- Plus custom fields in public.profiles table

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME,
  attendees TEXT[],
  venue TEXT,
  catering TEXT,
  budget DECIMAL,
  status TEXT,
  notes TEXT,
  run_of_show TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Office Operations
CREATE TABLE office_operations (
  id UUID PRIMARY KEY,
  type TEXT,
  item TEXT,
  status TEXT,
  vendor TEXT,
  next_service DATE,
  priority TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Team Members
CREATE TABLE team_members (
  id UUID PRIMARY KEY,
  name TEXT,
  role TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  status TEXT,
  last_updated TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Onboarding Checklist
CREATE TABLE onboarding_checklist (
  id UUID PRIMARY KEY,
  hire_id UUID,
  task TEXT,
  assigned_to UUID,
  completed BOOLEAN,
  deadline DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  title TEXT,
  description TEXT,
  status TEXT,
  priority TEXT,
  due_date DATE,
  assigned_to UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Email Mapping
CREATE TABLE email_mapping (
  id UUID PRIMARY KEY,
  email_id TEXT,
  event_id UUID,
  office_id UUID,
  task_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS and real-time
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE office_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- ... etc for all tables
```

---

## Key Implementation Decisions

### Why This Stack?
- **Supabase**: Zero-setup PostgreSQL + built-in real-time (saves time)
- **Vercel**: Serverless + Node.js support, free tier, instant deploy
- **React + Vite**: Fast dev experience, clean UI with Tailwind
- **Supabase Auth**: Google OAuth + email/password built-in
- **Real-time**: Supabase pubsub (free, built-in)

### Simplifications for 3-4 Day Timeline
- ❌ No unit tests (manual testing only)
- ❌ No complex state management (React Context)
- ❌ No animations/fancy transitions
- ✅ Lean component structure
- ✅ Direct SQL queries (no ORM)
- ✅ Minimal error handling (just failures + user feedback)
- ✅ Clean UI without heavy component libraries

---

## Ready to Build?

Next steps:
1. Create directory structure
2. Initialize both frontend and backend
3. Set up Supabase project (you'll need to sign up free)
4. Begin Phase 1 (setup & schema)

Should I proceed?
