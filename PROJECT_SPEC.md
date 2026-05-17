# Office Manager Dashboard - Project Specification

## Project Overview
A production-ready Office Manager Dashboard for VC firms with integrated email, calendar, and AI-powered task management.

---

## Architecture

### Backend Stack
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL
- **Authentication**: [TBD]
- **APIs**: Google Calendar, Gmail, Claude AI

### Frontend Stack
- **Framework**: React
- **Styling**: [TBD - CSS, Tailwind, styled-components?]
- **State Management**: [TBD - Context, Redux?]
- **Build Tool**: Vite/Create React App?

---

## Database Schema

### Tables
1. **events** - Office events, meetings, client events
2. **office_operations** - Supplies, maintenance, vendors
3. **team_members** - Staff directory and status
4. **onboarding_checklist** - New hire tasks
5. **tasks** - General task management
6. **email_mapping** - Links emails to dashboard items
7. **users** - Authentication and preferences

---

## Key Features
- [ ] User authentication (Google OAuth or email/password?)
- [ ] Real-time updates via WebSocket
- [ ] Google Calendar two-way sync
- [ ] Gmail integration with email parsing
- [ ] Claude AI chat with context awareness
- [ ] Role-based access control
- [ ] Dark/light theme
- [ ] Mobile responsive design

---

## Clarifying Questions

### Project Scope & Timeline
1. **What's your timeline?** (days, weeks, months?)
2. **What's the priority order of features?** (MVP vs. full feature set)
3. **How many concurrent users expected?** (affects real-time architecture)
4. **Budget for this project?** (affects complexity)

### Authentication
5. **Preferred auth method?**
   - Google OAuth only?
   - Email/password login?
   - Both?
   - Multi-team support (different VC firms)?

### Frontend Preferences
6. **UI Framework preference?**
   - Tailwind CSS + shadcn/ui?
   - Material-UI?
   - Plain CSS?
   - Other?

7. **State management?**
   - React Context?
   - Redux?
   - TanStack Query?
   - Something else?

### Backend & Database
8. **Existing database?** Or start fresh?
9. **Real-time features** - is WebSocket essential or nice-to-have?
10. **File storage needed?** (documents, attachments)

### Integrations
11. **Google Calendar sync frequency?** (real-time, hourly, manual?)
12. **Gmail sync scope?** (read-only or create tasks/filter?)
13. **Claude AI context size limit?** (how much dashboard data in each prompt?)
14. **Need email parsing AI?** (auto-categorize, extract info?)

### Deployment
15. **Hosting platform?** (Vercel, Heroku, AWS, custom?)
16. **Environment setup?** (Docker, .env, manual?)
17. **Database hosting?** (self-managed, cloud provider?)

### Features Deep Dive
18. **Event management** - need vendor quotes/RFP workflows?
19. **Office operations** - barcode scanning for supplies?
20. **Team status** - auto-location via IP or manual?
21. **Onboarding** - email notifications, dependencies between tasks?
22. **Analytics/Reporting** - budgets, utilization, trends?

### Data & Testing
23. **Sample data volume?** (100 events, 50 team members, etc?)
24. **Need automated tests?** (unit, integration, E2E?)

---

## Next Steps
Once you answer these questions, I'll:
1. Create the complete project structure
2. Set up backend with API routes
3. Build React frontend with all tabs
4. Integrate Google Calendar & Gmail
5. Set up Claude AI chat
6. Add sample data
7. Document API and deployment

---

## Start Date
**May 16, 2026**
