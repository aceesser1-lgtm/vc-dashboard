# Deployment Checklist - VC Office Manager Dashboard

## Pre-Deployment Testing

### Local Testing (30 min)

- [ ] **Dev server running**: `npm run dev` at http://localhost:5173
- [ ] **Login/signup works**: Create account with test email, verify redirect to dashboard
- [ ] **Dashboard tab**: Quick stats load, today's schedule shows, upcoming events visible
- [ ] **Events tab**: 
  - [ ] All 6 seed events load
  - [ ] Budget totals correct ($85.9k total budget)
  - [ ] Create new event works
  - [ ] Edit event works
  - [ ] Delete event with confirmation works
  - [ ] List and card views toggle
- [ ] **Team tab**:
  - [ ] All 10 team members load
  - [ ] Location filter works (All, In Office, Remote, Traveling, OOO)
  - [ ] Office occupancy bar shows 7/10
  - [ ] Quick status update buttons work
  - [ ] Add new member works
- [ ] **Office tab**:
  - [ ] 14 items load (7 supplies, 4 vendors, 3 maintenance)
  - [ ] Low stock alert shows (coffee, whiteboard markers)
  - [ ] Overdue alert shows (fire extinguishers)
  - [ ] Type filter works
  - [ ] Add/edit/delete items works
- [ ] **Onboarding tab**:
  - [ ] 2 hires with checklists load (Alex Rivera, Jordan Park)
  - [ ] Progress bars show correct completion %
  - [ ] Expanding/collapsing hire cards works
  - [ ] Toggle task completion works
  - [ ] Add new onboarding task works
- [ ] **Email tab**:
  - [ ] 5 mock emails load
  - [ ] Search filter works
  - [ ] Click email to read body works
  - [ ] Quick actions buttons visible
  - [ ] Create task from email modal works
- [ ] **Chat sidebar**: Opens/closes, shows context of active tab
- [ ] **Dark mode**: Toggle works, persists on refresh
- [ ] **Real-time indicator**: Shows "Live" with green dot in header
- [ ] **Real-time sync**: Make changes in one tab, see updates in others instantly
- [ ] **Mobile responsive**: Test on mobile/tablet view (DevTools)
- [ ] **Error handling**: 
  - [ ] Try submitting empty form → validation error shows
  - [ ] Error dismissal works

### Build Testing (5 min)

```bash
npm run build
# Check: dist/ folder created, no build errors
ls -lh dist/
```

- [ ] Build completes successfully
- [ ] Bundle size reasonable (~500KB gzipped)
- [ ] No console errors in build output

## Deployment Steps

### 1. Prepare Supabase (if not done)

- [ ] Supabase project created
- [ ] Database schema applied (copy schema.sql to SQL Editor)
- [ ] Seed data loaded (copy seed.sql to SQL Editor)
- [ ] Google OAuth configured (optional, for future):
  - [ ] Go to Supabase Auth settings
  - [ ] Add Google provider with your OAuth credentials
  - [ ] Set redirect URI: `https://your-domain.vercel.app/auth/callback`
- [ ] Row Level Security policies enabled (should be in schema.sql)
- [ ] Realtime subscriptions enabled for tables:
  - [ ] events
  - [ ] tasks
  - [ ] team_members
  - [ ] office_operations
  - [ ] onboarding_checklist

### 2. Prepare Vercel

```bash
# If not installed: npm i -g vercel
vercel login
```

- [ ] Vercel account created and logged in
- [ ] Git repository linked (should happen automatically)

### 3. Deploy Frontend

```bash
cd vc-dashboard
vercel deploy --prod
```

- [ ] Deployment completes successfully
- [ ] Get production URL (e.g., https://vc-dashboard.vercel.app)

### 4. Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

- [ ] Variables set
- [ ] Redeploy after setting variables:
  ```bash
  vercel deploy --prod
  ```

### 5. Test Production URL

Visit `https://your-domain.vercel.app`

- [ ] Login page loads
- [ ] Sign up works
- [ ] Dashboard tab loads with data from Supabase
- [ ] All tabs work
- [ ] Real-time sync works (make changes, verify they appear)
- [ ] Dark mode works
- [ ] No console errors (F12 → Console)

### 6. Configure Custom Domain (Optional)

In Vercel Dashboard → Domains:

- [ ] Add custom domain (e.g., dashboard.yourvc.com)
- [ ] DNS records added to domain registrar
- [ ] SSL certificate auto-issued
- [ ] Test at custom domain

### 7. Set Up Monitoring (Optional)

- [ ] Enable Vercel Analytics
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Enable Supabase logs monitoring
- [ ] Set up uptime monitoring (Uptime Robot, etc.)

## Post-Deployment

### Day 1
- [ ] Monitor error logs (Vercel, Supabase)
- [ ] Test all user flows again
- [ ] Verify real-time sync working
- [ ] Check performance (Lighthouse)
- [ ] Share with team for feedback

### Week 1
- [ ] Gather user feedback
- [ ] Monitor performance metrics
- [ ] Fix any reported bugs
- [ ] Document any issues found

### Future Integrations

When ready to add:

#### Google OAuth
- [ ] Add GOOGLE_CLIENT_ID to .env.local
- [ ] Uncomment Google OAuth in Login.jsx
- [ ] Test Google sign-in

#### Gmail Integration
- [ ] Get Gmail API credentials from Google Cloud Console
- [ ] Create `/api/gmail/list.js` endpoint
- [ ] Replace mock emails with real Gmail data
- [ ] Deploy updated code

#### Google Calendar Sync
- [ ] Get Google Calendar API credentials
- [ ] Create `/api/calendar/sync.js` endpoint
- [ ] Create `/api/calendar/fetch.js` endpoint
- [ ] Implement two-way sync logic
- [ ] Deploy updated code

#### Claude AI Chat
- [ ] Get Claude API key from Anthropic
- [ ] Add VITE_CLAUDE_API_KEY to env
- [ ] Implement `/api/chat.js` endpoint
- [ ] Update ChatSidebar.jsx to call real API
- [ ] Deploy updated code

## Rollback Plan

If something breaks in production:

### Quick Rollback (1 min)
```bash
vercel rollback
```

### Full Rollback (5 min)
1. Revert last commit: `git reset --hard HEAD~1`
2. Redeploy: `vercel deploy --prod`

## Performance Targets

- [ ] First Contentful Paint: < 2s
- [ ] Largest Contentful Paint: < 3s
- [ ] Cumulative Layout Shift: < 0.1
- [ ] Time to Interactive: < 3.5s

Check at: https://pagespeed.web.dev/

## Security Checklist

- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Environment variables not exposed in client code
- [ ] Supabase Row Level Security policies enforce authorization
- [ ] API keys never logged or sent to client
- [ ] CORS configured (if using separate backend)
- [ ] SQL injection prevented (using Supabase SDK)
- [ ] XSS prevented (React escapes by default)
- [ ] CSRF tokens (Supabase handles)

## Maintenance

### Weekly
- [ ] Check Vercel build status
- [ ] Check Supabase database usage
- [ ] Scan error logs

### Monthly
- [ ] Update dependencies: `npm update`
- [ ] Check for security vulnerabilities: `npm audit`
- [ ] Review usage metrics
- [ ] Backup database (Supabase auto-backups daily)

### Quarterly
- [ ] Review and optimize slow queries
- [ ] Archive old data if needed
- [ ] Update documentation
- [ ] Plan feature improvements

## Troubleshooting Deployment

### Build fails: "Module not found"
```bash
npm install
npm run build
```

### Environment variables not working
- [ ] Verify variables set in Vercel dashboard
- [ ] Redeploy after setting variables
- [ ] Check `.env.local` syntax (no spaces around `=`)

### Real-time not syncing
- [ ] Check Supabase realtime status: https://status.supabase.com
- [ ] Verify RLS policies allow authenticated users
- [ ] Check browser console for connection errors
- [ ] Restart dev server or redeploy

### Database connection fails
- [ ] Check Supabase project is active
- [ ] Verify credentials in `.env.local` are correct
- [ ] Check Supabase project status page
- [ ] Try reconnecting: `vercel env pull`

### 404 on API routes
- [ ] API routes only work on Vercel (not localhost)
- [ ] For local testing, use mock data
- [ ] Verify `/api` folder exists at project root
- [ ] Check function names match route structure

## Success Checklist

✅ **Deployment is successful when:**

- [ ] App loads at production URL
- [ ] All 6 tabs visible with sample data
- [ ] Create/edit/delete operations work
- [ ] Real-time updates work across tabs
- [ ] Dark/light mode works
- [ ] No errors in browser console
- [ ] No errors in Vercel logs
- [ ] No errors in Supabase logs
- [ ] Performance scores > 80
- [ ] Team can access and use the dashboard

---

**Estimated deployment time: 30 minutes**  
**Estimated total setup time: 1-2 hours** (including Supabase setup)

For questions, see [QUICKSTART.md](./vc-dashboard/QUICKSTART.md)
