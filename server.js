const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const COMMENTS_FILE = path.join(__dirname, 'comments.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize comments file if not exists
if (!fs.existsSync(COMMENTS_FILE)) {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify([]));
}

// Get all comments
app.get('/api/comments', (req, res) => {
    fs.readFile(COMMENTS_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read comments' });
        res.json(JSON.parse(data));
    });
});

// Add a new comment
app.post('/api/comments', (req, res) => {
    const { name, message, attendance, date } = req.body;
    if (!name || !message || !attendance) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const newComment = { name, message, attendance, date };

    fs.readFile(COMMENTS_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read comments' });
        const comments = JSON.parse(data);
        comments.push(newComment);
        
        fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Failed to save comment' });
            res.status(201).json(newComment);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
