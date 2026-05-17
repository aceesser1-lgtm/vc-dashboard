export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token' })
  }

  try {
    // List messages in inbox
    const listResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=INBOX&maxResults=20&q=is:unread',
      {
        headers: { 'Authorization': `Bearer ${token}` },
      }
    )

    if (!listResponse.ok) {
      const errorData = await listResponse.json().catch(() => ({}))
      console.error('Gmail API error response:', { status: listResponse.status, data: errorData })
      throw new Error(`Gmail API error: ${listResponse.status} - ${errorData.error?.message || 'Unknown error'}`)
    }

    const listData = await listResponse.json()
    const messageIds = listData.messages || []

    // Fetch full details for each message
    const emails = await Promise.all(
      messageIds.map(async ({ id }) => {
        const msgResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
          {
            headers: { 'Authorization': `Bearer ${token}` },
          }
        )

        if (!msgResponse.ok) {
          console.error(`Failed to fetch message ${id}`)
          return null
        }

        const msg = await msgResponse.json()
        const headers = msg.payload.headers || []
        const subject = headers.find((h) => h.name === 'Subject')?.value || '(no subject)'
        const from = headers.find((h) => h.name === 'From')?.value || 'unknown@example.com'
        const dateStr = headers.find((h) => h.name === 'Date')?.value || new Date().toISOString()
        const date = new Date(dateStr)

        let body = ''
        if (msg.payload.parts) {
          const textPart = msg.payload.parts.find((p) => p.mimeType === 'text/plain')
          if (textPart?.body?.data) {
            body = Buffer.from(textPart.body.data, 'base64').toString('utf-8')
          }
        } else if (msg.payload.body?.data) {
          body = Buffer.from(msg.payload.body.data, 'base64').toString('utf-8')
        }

        const preview = body.substring(0, 100)

        return {
          id,
          from,
          subject,
          preview,
          date,
          body,
          read: !msg.labelIds?.includes('UNREAD'),
        }
      })
    )

    const validEmails = emails.filter((e) => e !== null)
    res.status(200).json(validEmails)
  } catch (error) {
    console.error('Gmail list error:', error)
    res.status(500).json({ error: error.message })
  }
}
