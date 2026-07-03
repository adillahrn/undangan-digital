const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Ensure table exists
        await sql`
            CREATE TABLE IF NOT EXISTS comments (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                attendance VARCHAR(50) NOT NULL,
                date VARCHAR(100),
                created_at TIMESTAMP DEFAULT NOW()
            )
        `;

        if (req.method === 'GET') {
            const { rows } = await sql`
                SELECT id, name, message, attendance, date, created_at
                FROM comments
                ORDER BY created_at ASC
            `;
            return res.status(200).json(rows);
        }

        if (req.method === 'POST') {
            const { name, message, attendance, date } = req.body;

            if (!name || !message || !attendance) {
                return res.status(400).json({ error: 'Missing required fields: name, message, attendance' });
            }

            const { rows } = await sql`
                INSERT INTO comments (name, message, attendance, date)
                VALUES (${name}, ${message}, ${attendance}, ${date || ''})
                RETURNING id, name, message, attendance, date, created_at
            `;

            return res.status(201).json(rows[0]);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
