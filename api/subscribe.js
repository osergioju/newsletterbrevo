export default async function handler(req, res) {

    // 🔓 LIBERA CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 🧠 Preflight request (IMPORTANTE)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const response = await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.BREVO_API_KEY
            },
            body: JSON.stringify({
                email,
                listIds: [7],
                updateEnabled: true
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(400).json({ message: data.message });
        }

        return res.status(200).json({ message: 'ok' });

    } catch (err) {
        return res.status(500).json({ message: 'server error' });
    }
}
