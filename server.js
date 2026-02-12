const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3005;

// Serve static files from the root directory
app.use(express.static(__dirname));

// Basic route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server.');
});
