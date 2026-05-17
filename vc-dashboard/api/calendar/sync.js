export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token' })
  }

  const { event } = req.body
  if (!event) {
    return res.status(400).json({ error: 'Missing event' })
  }

  try {
    // Map dashboard event to Google Calendar event format
    const calendarEvent = {
      summary: event.name,
      description: event.notes || '',
      location: event.venue || '',
      start: {
        dateTime: new Date(`${event.date}T${event.time || '09:00'}`).toISOString(),
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: new Date(new Date(`${event.date}T${event.time || '09:00'}`).getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: 'America/New_York',
      },
    }

    let url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'
    let method = 'POST'

    // If event already has a Google Calendar ID, update it instead
    if (event.google_calendar_event_id) {
      url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event.google_calendar_event_id}`
      method = 'PATCH'
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(calendarEvent),
    })

    if (!response.ok) {
      throw new Error(`Google Calendar API error: ${response.status}`)
    }

    const result = await response.json()
    res.status(200).json({ google_calendar_event_id: result.id })
  } catch (error) {
    console.error('Calendar sync error:', error)
    res.status(500).json({ error: error.message })
  }
}
