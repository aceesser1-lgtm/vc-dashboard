-- Add google_calendar_event_id column to events table
ALTER TABLE events ADD COLUMN google_calendar_event_id TEXT;

-- Add index for faster lookups
CREATE INDEX idx_events_google_calendar_event_id ON events(google_calendar_event_id);

-- Add comment
COMMENT ON COLUMN events.google_calendar_event_id IS 'Google Calendar event ID for synced events';
