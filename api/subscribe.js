export default async function handler(req, res) {

    // 🔓 LIBERA CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 🧠 Preflight request
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

        const response = await fetch(
            'https://api.brevo.com/v3/contacts/doubleOptinConfirmation',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.BREVO_API_KEY
                },
                body: JSON.stringify({
                    email,

                    // ID da lista
                    includeListIds: [7],

                    // URL pra onde o usuário vai depois de confirmar
                    redirectionUrl: 'https://sportbyfort.com/thank-you',

                    // ID do template de e-mail do Brevo
                    templateId: 1
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(400).json({
                message: data.message || 'Brevo error'
            });
        }

        return res.status(200).json({
            message: 'confirmation email sent'
        });

    } catch (err) {

        return res.status(500).json({
            message: 'server error'
        });

    }
}
