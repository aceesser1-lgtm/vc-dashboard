export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token' })
  }

  const { action, messageId } = req.body

  if (!action || !messageId) {
    return res.status(400).json({ error: 'Missing action or messageId' })
  }

  try {
    let removeLabelIds = []
    let addLabelIds = []

    if (action === 'markRead') {
      removeLabelIds = ['UNREAD']
    } else if (action === 'archive') {
      removeLabelIds = ['INBOX']
    } else {
      return res.status(400).json({ error: 'Unknown action' })
    }

    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          removeLabelIds,
          addLabelIds,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Gmail API error: ${response.status}`)
    }

    const result = await response.json()
    res.status(200).json(result)
  } catch (error) {
    console.error('Gmail action error:', error)
    res.status(500).json({ error: error.message })
  }
}
