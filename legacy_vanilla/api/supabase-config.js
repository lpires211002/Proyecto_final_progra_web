export default function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const config = {
            url: process.env.SUPABASE_URL,
            anonKey: process.env.SUPABASE_ANON_KEY
        };

        if (!config.url || !config.anonKey) {
            console.error('Supabase configuration missing in environment variables.');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        res.status(200).json(config);
    } catch (error) {
        console.error('Error fetching Supabase config:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
