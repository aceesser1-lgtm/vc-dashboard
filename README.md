# VC Office Manager Dashboard

A production-ready Office Manager Dashboard for VC firms. Real-time event management, team coordination, office operations, email integration, and onboarding workflows—all in one clean, modern interface.

## Features

### 📊 Dashboard
- Quick stats (team in office, open tasks, upcoming events)
- Today's schedule with times and venues
- Next 7 days event preview
- Real-time updates

### 📅 Events
- List and card views
- Create/edit/delete events
- Budget tracking (total, spent, remaining)
- Status badges (Planning, Confirmed, In Progress, Completed, Cancelled)
- Two-way Google Calendar sync (ready for implementation)

### 👥 Team
- Team member directory with roles and contact info
- Location status (In Office, Remote, Traveling, OOO)
- Office occupancy bar
- Quick status update buttons
- Location filtering
- Add/edit/remove members

### 🏢 Office
- Supplies inventory with low-stock alerts
- Vendor management with next-service dates
- Maintenance tracking with overdue alerts
- Priority levels (Low, Medium, High)
- Add/edit/remove items

### ✅ Onboarding
- New hire checklists
- Task assignment and deadline tracking
- Progress tracking (X of Y tasks complete)
- Expandable hire cards
- Task completion toggle

### 📧 Email
- Email list with search
- Email reader with full body
- Quick actions (mark read, archive, create task)
- Create dashboard tasks from emails
- Gmail API integration ready

### 🤖 AI Chat Sidebar
- Always-visible assistant
- Context-aware responses (shows active tab context)
- Stubbed for Claude API integration

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime (WebSocket)
- **Auth**: Supabase Auth (email/password + Google OAuth)
- **Hosting**: Vercel (frontend + serverless backend)
- **Icons**: Lucide React
- **Dates**: date-fns

## Quick Start

See [QUICKSTART.md](./vc-dashboard/QUICKSTART.md) for setup instructions.

```bash
cd vc-dashboard
npm install
npm run dev
```

Visit `http://localhost:5173` and sign up with any email/password.

## Project Structure

```
vc-dashboard/
├── src/
│   ├── components/
│   │   ├── layout/        # Header, Navigation, ChatSidebar
│   │   ├── tabs/          # Dashboard, Events, Team, Office, Onboarding, Email
│   │   └── ui/            # Reusable UI components
│   ├── hooks/             # useAuth, useRealtime, useToast
│   ├── lib/               # Supabase client
│   ├── pages/             # Login, Dashboard
│   └── App.jsx
├── api/                   # Vercel serverless functions (optional)
│   ├── calendar/
│   ├── gmail/
│   └── chat.js
├── supabase/
│   ├── schema.sql         # Database schema
│   └── seed.sql           # Sample data
├── QUICKSTART.md
└── package.json
```

## Database Schema

### Tables
- **profiles** - User info (extends Supabase auth)
- **events** - Office events with budget tracking
- **team_members** - Staff directory with location status
- **office_operations** - Supplies, vendors, maintenance
- **onboarding_checklist** - New hire tasks
- **tasks** - General task management
- **email_mapping** - Link emails to dashboard items

All tables have Row Level Security (RLS) enabled and real-time subscriptions.

## Key Features

### Real-time Sync
Every change syncs instantly across tabs via Supabase subscriptions.

### Dark/Light Theme
Toggle with sun/moon icon in header. Preference saved to localStorage.

### Error Handling
- Form validation with error messages
- Loading spinners during saves
- Error alerts with dismissal
- Empty states when no data exists

### Responsive Design
Works on desktop, tablet, and mobile. Optimized layouts for each breakpoint.

## Sample Data

The app comes with realistic VC office data:
- 6 events (LP meetings, portfolio CEO summit, etc.)
- 10 team members across 4 locations
- 14 office operations (supplies, vendors, maintenance)
- 2 onboarding hires with 16 tasks
- 10 general tasks

See [QUICKSTART.md](./vc-dashboard/QUICKSTART.md) for details.

## Deployment

### Vercel

```bash
vercel deploy
```

Environment variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

### Google OAuth Setup

1. Create OAuth credentials at [Google Cloud Console](https://console.cloud.google.com)
2. Add redirect URI: `https://your-domain.vercel.app/auth/callback`
3. Set credentials in Supabase Dashboard → Auth → Google

### Gmail & Google Calendar Sync

Implement serverless functions in `/api` to handle:
- `GET /api/gmail/list` - Fetch emails
- `POST /api/calendar/sync` - Two-way calendar sync
- `POST /api/chat` - Claude API chat

## Development

### Add a New Tab

1. Create component in `src/components/tabs/NewTab.jsx`
2. Import in `src/pages/Dashboard.jsx`
3. Add to `TAB_COMPONENTS` object
4. Add navigation entry in `src/components/layout/Navigation.jsx`

### Add Real-time Features

Use the `useRealtime` hook:

```javascript
const { data, loading } = useRealtime('table_name')
```

Automatically subscribes to PostgreSQL changes and updates state.

### Styling

Uses Tailwind CSS. Dark mode classes available:
- `dark:bg-gray-800` - Dark background
- `dark:text-white` - Dark text
- `dark:border-gray-700` - Dark borders

## Testing

Currently no automated tests. Manual testing checklist:

- [ ] Sign up and login with email/password
- [ ] View all 6 tabs with sample data
- [ ] Create/edit/delete an event
- [ ] Update team member status
- [ ] Toggle task completion
- [ ] Search emails
- [ ] Convert email to task
- [ ] Toggle dark mode
- [ ] Check real-time sync across tabs
- [ ] Test on mobile

## Future Enhancements

- [ ] Google OAuth login
- [ ] Gmail API integration (real emails, not mock)
- [ ] Google Calendar two-way sync
- [ ] Claude AI chat with real API
- [ ] Email parsing and auto-categorization
- [ ] Budget forecasting and analytics
- [ ] Role-based access control
- [ ] Audit logs
- [ ] Webhooks for external integrations
- [ ] Mobile app (React Native)

## License

Private project. Built for VC firms.

## Support

See [QUICKSTART.md](./vc-dashboard/QUICKSTART.md) Troubleshooting section.

---

**Built with ❤️ in 3 days**  
React • Vite • Tailwind • Supabase • Vercel

**Deploy to production:** `cd vc-dashboard && vercel deploy`
