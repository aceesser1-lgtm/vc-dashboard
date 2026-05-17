# Quick Start Guide - VC Office Manager Dashboard

## Setup (5 minutes)

### 1. Environment Variables
Copy your Supabase credentials into `.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**How to find your keys:**
- Go to [Supabase Dashboard](https://app.supabase.com)
- Select your project
- Settings → API → Copy Project URL and Anon Key

### 2. Start Development Server
```bash
cd vc-dashboard
npm run dev
```

The app will open at `http://localhost:5173`

### 3. Sign Up
- Click "Sign up" on the login page
- Use any email and password (e.g., `test@example.com` / `password123`)
- You'll see the dashboard with sample data

## Sample Data Overview

The database includes realistic VC office data:

### Dashboard Tab
- **Quick stats**: 7 team members in office, 10 open tasks, 6 upcoming events
- **Today's schedule**: View today's events with times and venues
- **Next 7 days**: Upcoming events preview

### Events Tab (6 events)
- **LP Annual Meeting** (Jun 10) - $45k budget, 80 attendees
- **Portfolio CEO Summit** (Jun 18) - $8.5k, quarterly roundtable
- **Founders Dinner** (May 28) - $3.5k, venue dining
- **Tech Demo Day** (Jul 8) - $6k, 150 guests
- **New Hire Welcome** (May 22) - $400, completed
- **Board Offsite** (Jul 22-23) - $22k, 2-day strategy planning

**Try it:** Create a new event, edit budget, change status → see real-time updates

### Team Tab (10 members)
- **In Office** (7): Sarah Chen, Priya Patel, Nina Goldberg, Emily Torres, Ryan Murphy, Tom Nakamura
- **Remote** (2): Marcus Williams, David Kim
- **Traveling** (1): James Okonkwo
- **OOO** (1): Aisha Johnson

**Try it:** Click "In Office" / "Remote" buttons to quick-update status. Filter by location. Add a new team member.

### Office Tab (14 items)
- **Supplies** (7): Coffee beans (LOW STOCK), printer paper, sparkling water, hand sanitizer, whiteboard markers (OUT OF STOCK)
- **Vendors** (4): HVAC (scheduled Jun 1), office cleaning (active), IT support (active), pest control (scheduled Jul 15)
- **Maintenance** (3): Elevator inspection (scheduled Jun 20), fire extinguishers (OVERDUE), plant watering (active)

**Try it:** See alerts for low stock and overdue items. Edit supply quantities, update vendor next-service dates.

### Onboarding Tab (2 new hires)
- **Alex Rivera** (Senior Associate, starts May 19)
  - 8 tasks: 3 completed (setup, building access), 5 in progress
  - HR paperwork due May 23, 30-day check-in Jun 18
  
- **Jordan Park** (Marketing Coordinator, starts Jun 2)
  - 8 tasks: 2 completed (offer, setup)
  - Key deliverables: brand guidelines walkthrough (Jun 9)

**Try it:** Expand a hire card, toggle task completion, set deadlines.

### Email Tab
- **5 mock emails** from your team (Sarah, Marcus, Priya, James, Emily)
- Emails about LP updates, portfolio check-ins, board prep, onboarding

**Try it:** Click an email to read, click "Create Task" to convert it to a dashboard task.

### Dashboard Summary
- **Real-time sync**: All changes appear instantly across tabs (via Supabase subscriptions)
- **Live indicator**: Green "Live" badge in header shows connection status
- **Dark mode**: Toggle with moon/sun icon in header

## Core Features

### Real-time Updates
Every action instantly syncs across the app:
- Add an event → appears in Dashboard, Events, and Chat context
- Update team member status → appears in Team tab and occupancy counter
- Mark task complete → progress bars update everywhere

### Quick Actions
- **Events**: View/edit/delete, budget tracking, status badges
- **Team**: One-click status updates, location filter, occupancy bar
- **Office**: Low stock alerts, overdue alerts, vendor scheduling
- **Onboarding**: Task completion toggle, deadline tracking
- **Email**: Convert emails to tasks with custom details

### Error Handling
- Form validation (required fields highlighted)
- Loading spinners during saves
- Error messages if something fails
- Empty states when no data exists

## Next Steps

### To Use with Real Data
1. Delete the seed data: Go to Supabase Dashboard → SQL Editor → run:
   ```sql
   DELETE FROM events;
   DELETE FROM team_members;
   DELETE FROM office_operations;
   DELETE FROM onboarding_checklist;
   DELETE FROM tasks;
   ```

2. Start fresh with your own data using the "+" buttons in each tab

### To Integrate with Google Calendar & Gmail
1. Set up Google OAuth in Supabase: https://supabase.com/docs/guides/auth/social-login/auth-google
2. Update `src/hooks/useAuth.js` with your Google Client ID
3. Implement Gmail API sync in `/api/gmail/list.js`
4. Implement Google Calendar sync in `/api/calendar/sync.js`

### To Add Claude AI Chat
1. Get Claude API key from https://console.anthropic.com
2. Add to `.env.local`: `VITE_CLAUDE_API_KEY=your-key`
3. Implement `/api/chat.js` endpoint
4. Update `ChatSidebar.jsx` to call real API instead of mock

### To Deploy to Vercel
```bash
vercel deploy
```

Set environment variables in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`

## Architecture

```
Frontend (React + Vite + Tailwind)
    ↓ (WebSocket subscriptions)
Supabase
    ├─ PostgreSQL (7 tables + auth)
    ├─ Realtime (pub/sub for live updates)
    └─ Auth (email/password + Google OAuth)
    
Backend (Vercel Serverless)
    ├─ /api/calendar/* (Google Calendar sync)
    ├─ /api/gmail/* (Gmail integration)
    └─ /api/chat.js (Claude AI)
```

## Troubleshooting

### "Connection failed" error
- Check that `.env.local` has correct Supabase URL and key
- Restart the dev server: `npm run dev`

### Data not syncing across tabs
- Check the "Live" indicator in header (should be green)
- Refresh the page to reconnect

### Form submission fails
- Check browser console for error details
- Verify all required fields are filled
- Check that Supabase connection is working

### 404 on API endpoints
- API routes only work in production (Vercel)
- Locally, mock data is used for Gmail/Calendar

## Support

For issues or questions:
1. Check browser console (F12 → Console) for errors
2. Check Supabase logs: Dashboard → Logs
3. Verify `.env.local` has correct credentials
4. Restart dev server

---

**Built with:** React, Vite, Tailwind CSS, Supabase, Vercel
**Last updated:** May 16, 2026
