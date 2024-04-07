const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, '')));

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});