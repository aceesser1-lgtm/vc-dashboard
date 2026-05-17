-- ============================================
-- Seed Data - VC Office Manager Dashboard
-- Run AFTER schema.sql
-- ============================================

-- Team Members (10 people)
INSERT INTO public.team_members (name, role, email, phone, location, status) VALUES
  ('Sarah Chen', 'Managing Partner', 'sarah.chen@vcfirm.com', '(415) 555-0101', 'In Office', 'Active'),
  ('Marcus Williams', 'General Partner', 'marcus.w@vcfirm.com', '(415) 555-0102', 'Remote', 'Active'),
  ('Priya Patel', 'Principal', 'priya.patel@vcfirm.com', '(415) 555-0103', 'In Office', 'Active'),
  ('James Okonkwo', 'Senior Associate', 'james.o@vcfirm.com', '(415) 555-0104', 'Traveling', 'Active'),
  ('Emily Torres', 'Associate', 'emily.t@vcfirm.com', '(415) 555-0105', 'In Office', 'Active'),
  ('David Kim', 'Venture Partner', 'david.kim@vcfirm.com', '(415) 555-0106', 'Remote', 'Active'),
  ('Nina Goldberg', 'Office Manager', 'nina.g@vcfirm.com', '(415) 555-0107', 'In Office', 'Active'),
  ('Ryan Murphy', 'Financial Analyst', 'ryan.m@vcfirm.com', '(415) 555-0108', 'In Office', 'Active'),
  ('Aisha Johnson', 'Marketing Lead', 'aisha.j@vcfirm.com', '(415) 555-0109', 'OOO', 'Active'),
  ('Tom Nakamura', 'Platform Associate', 'tom.n@vcfirm.com', '(415) 555-0110', 'In Office', 'Active');

-- Events (6 upcoming events)
INSERT INTO public.events (name, date, time, attendees, venue, catering, budget, spent, status, notes) VALUES
  (
    'LP Annual Meeting',
    '2026-06-10',
    '09:00',
    ARRAY['Sarah Chen', 'Marcus Williams', 'Priya Patel', 'All LPs'],
    'Four Seasons Hotel, San Francisco',
    'Plated dinner by Wolfgang Puck',
    45000.00,
    12500.00,
    'Planning',
    'Annual LP update meeting. Deck due June 1st. 80 attendees expected.'
  ),
  (
    'Portfolio CEO Summit',
    '2026-06-18',
    '10:00',
    ARRAY['All Portfolio CEOs', 'Sarah Chen', 'Marcus Williams'],
    'Firm HQ - Main Conference Room',
    'Catered lunch from Tartine',
    8500.00,
    2100.00,
    'Confirmed',
    'Quarterly CEO roundtable. Keynote from Sarah on market outlook.'
  ),
  (
    'Founders Dinner',
    '2026-05-28',
    '19:00',
    ARRAY['Sarah Chen', 'Marcus Williams', 'David Kim', '12 Founders'],
    'Zuni Cafe, San Francisco',
    'Restaurant dining',
    3500.00,
    3500.00,
    'Confirmed',
    'Intimate dinner for select founders. Reservation confirmed.'
  ),
  (
    'Tech Demo Day',
    '2026-07-08',
    '13:00',
    ARRAY['All Team', 'Invited Guests', 'Press'],
    'Firm HQ - Demo Floor',
    'Light refreshments',
    6000.00,
    0.00,
    'Planning',
    'Showcase portfolio companies. Expecting 150 guests. AV setup needed.'
  ),
  (
    'New Hire Welcome Lunch',
    '2026-05-22',
    '12:00',
    ARRAY['All Team', 'Alex Rivera', 'Jordan Park'],
    'Firm HQ - Kitchen',
    'Catered by Mixt',
    400.00,
    400.00,
    'Completed',
    'Welcome lunch for two new hires.'
  ),
  (
    'Board Offsite',
    '2026-07-22',
    '08:00',
    ARRAY['Sarah Chen', 'Marcus Williams', 'Priya Patel', 'Board Members'],
    'Cavallo Point Lodge, Sausalito',
    'Full catering by venue',
    22000.00,
    5000.00,
    'Planning',
    '2-day board offsite. Strategy planning for H2. Room block reserved.'
  );

-- Office Operations - Supplies
INSERT INTO public.office_operations (type, item, status, vendor, priority, quantity, notes) VALUES
  ('Supply', 'Printer Paper (Case)', 'OK', 'Staples Business', 'Low', 12, 'Reorder at 4 cases'),
  ('Supply', 'Coffee Beans (5lb)', 'Low Stock', 'Blue Bottle Coffee', 'High', 1, 'Order weekly — goes fast'),
  ('Supply', 'Sparkling Water (Case)', 'OK', 'Costco Business', 'Low', 8, NULL),
  ('Supply', 'Hand Sanitizer', 'OK', 'Amazon Business', 'Low', 6, NULL),
  ('Supply', 'Whiteboard Markers', 'Out of Stock', 'Staples Business', 'High', 0, 'Needed for conference rooms'),
  ('Supply', 'Snack Pantry Items', 'Low Stock', 'Boxed.com', 'Medium', NULL, 'Monthly delivery — next one May 28'),
  ('Supply', 'Printer Toner (Black)', 'OK', 'Staples Business', 'Medium', 2, NULL);

-- Office Operations - Vendors
INSERT INTO public.office_operations (type, item, status, vendor, next_service, priority, notes) VALUES
  ('Vendor', 'HVAC Maintenance', 'Scheduled', 'Climate Solutions SF', '2026-06-01', 'Medium', 'Annual service contract. Contact: Mike (415) 555-0200'),
  ('Vendor', 'Office Cleaning', 'Active', 'SF Clean Pro', NULL, 'Low', 'MWF service. Weekly deep clean Fridays.'),
  ('Vendor', 'IT Support', 'Active', 'TechDesk Solutions', NULL, 'High', 'On-call support. SLA: 2hr response. Contact: help@techdesk.io'),
  ('Vendor', 'Pest Control', 'Scheduled', 'Bay Area Pest Co', '2026-07-15', 'Low', 'Quarterly service');

-- Office Operations - Maintenance
INSERT INTO public.office_operations (type, item, status, vendor, next_service, priority, notes) VALUES
  ('Maintenance', 'Elevator Inspection', 'Scheduled', 'Otis Elevator', '2026-06-20', 'High', 'Annual city-required inspection. Cert expires July 1.'),
  ('Maintenance', 'Fire Extinguisher Check', 'Overdue', 'SafeGuard Fire', '2026-05-01', 'High', 'OVERDUE - schedule immediately'),
  ('Maintenance', 'Office Plants Watering', 'Active', 'Green Office SF', NULL, 'Low', 'Biweekly service included in lease');

-- Onboarding Checklist (2 new hires)
INSERT INTO public.onboarding_checklist (hire_name, hire_role, hire_start_date, task, assigned_to, completed, deadline) VALUES
  -- Alex Rivera
  ('Alex Rivera', 'Senior Associate', '2026-05-19', 'Send offer letter and onboarding packet', 'Nina Goldberg', TRUE, '2026-05-12'),
  ('Alex Rivera', 'Senior Associate', '2026-05-19', 'Set up laptop and software accounts', 'Tom Nakamura', TRUE, '2026-05-16'),
  ('Alex Rivera', 'Senior Associate', '2026-05-19', 'Configure email and Slack', 'Tom Nakamura', TRUE, '2026-05-16'),
  ('Alex Rivera', 'Senior Associate', '2026-05-19', 'Building access and key card', 'Nina Goldberg', TRUE, '2026-05-19'),
  ('Alex Rivera', 'Senior Associate', '2026-05-19', 'HR paperwork and benefits enrollment', 'Ryan Murphy', FALSE, '2026-05-23'),
  ('Alex Rivera', 'Senior Associate', '2026-05-19', 'Introductory 1:1 with Sarah Chen', 'Sarah Chen', FALSE, '2026-05-26'),
  ('Alex Rivera', 'Senior Associate', '2026-05-19', 'Portfolio company overview deck review', 'Priya Patel', FALSE, '2026-05-30'),
  ('Alex Rivera', 'Senior Associate', '2026-05-19', '30-day check-in meeting', 'Marcus Williams', FALSE, '2026-06-18'),

  -- Jordan Park
  ('Jordan Park', 'Marketing Coordinator', '2026-06-02', 'Send offer letter and onboarding packet', 'Nina Goldberg', TRUE, '2026-05-26'),
  ('Jordan Park', 'Marketing Coordinator', '2026-06-02', 'Set up laptop and software accounts', 'Tom Nakamura', FALSE, '2026-05-30'),
  ('Jordan Park', 'Marketing Coordinator', '2026-06-02', 'Configure email and Slack', 'Tom Nakamura', FALSE, '2026-05-30'),
  ('Jordan Park', 'Marketing Coordinator', '2026-06-02', 'Building access and key card', 'Nina Goldberg', FALSE, '2026-06-02'),
  ('Jordan Park', 'Marketing Coordinator', '2026-06-02', 'HR paperwork and benefits enrollment', 'Ryan Murphy', FALSE, '2026-06-06'),
  ('Jordan Park', 'Marketing Coordinator', '2026-06-02', 'Introductory 1:1 with Sarah Chen', 'Sarah Chen', FALSE, '2026-06-09'),
  ('Jordan Park', 'Marketing Coordinator', '2026-06-02', 'Brand guidelines and asset library walkthrough', 'Aisha Johnson', FALSE, '2026-06-09'),
  ('Jordan Park', 'Marketing Coordinator', '2026-06-02', '30-day check-in meeting', 'Aisha Johnson', FALSE, '2026-07-02');

-- Tasks
INSERT INTO public.tasks (title, description, status, priority, due_date, assigned_to, source) VALUES
  ('Book AV equipment for Tech Demo Day', 'Need projectors, mics, and livestream setup for 150 guests', 'Open', 'High', '2026-06-20', 'Nina Goldberg', 'manual'),
  ('Confirm LP dietary restrictions', 'Send form to all LP attendees for Annual Meeting catering', 'In Progress', 'High', '2026-05-30', 'Nina Goldberg', 'manual'),
  ('Renew office cleaning contract', 'Current contract expires June 30. Get quotes from 2 vendors.', 'Open', 'Medium', '2026-06-01', 'Nina Goldberg', 'manual'),
  ('Order whiteboard markers', 'All conference rooms are out. Order immediately.', 'Open', 'High', '2026-05-17', 'Nina Goldberg', 'manual'),
  ('Schedule fire extinguisher inspection', 'Overdue since May 1. Contact SafeGuard Fire immediately.', 'Open', 'High', '2026-05-17', 'Nina Goldberg', 'manual'),
  ('Prepare LP meeting deck', 'Annual LP update presentation. Coordinate with Marcus on financials.', 'In Progress', 'High', '2026-06-01', 'Priya Patel', 'manual'),
  ('Research Cavallo Point room block', 'Confirm room block for Board Offsite July 22-23. Need 12 rooms.', 'In Progress', 'Medium', '2026-05-25', 'Nina Goldberg', 'manual'),
  ('Update portfolio company one-pagers', 'Q2 updates needed for all 11 portfolio companies', 'Open', 'Medium', '2026-06-15', 'Emily Torres', 'manual'),
  ('Reorder coffee beans', 'Down to last bag. Place weekly order with Blue Bottle.', 'Open', 'High', '2026-05-17', 'Nina Goldberg', 'manual'),
  ('Send Tech Demo Day invites', 'Guest list approved. Need to send Evite by May 25.', 'Open', 'Medium', '2026-05-25', 'Aisha Johnson', 'manual');
