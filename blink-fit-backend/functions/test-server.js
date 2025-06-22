const express = require('express');
const cors = require('cors');

// Import our functions
const { api } = require('./lib/index.js');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Mount the Firebase Functions
app.use('/api', api);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📋 API endpoints available at:`);
  console.log(`   GET  http://localhost:${port}/api/hello`);
  console.log(`   POST http://localhost:${port}/api/hello`);
  console.log(`   POST http://localhost:${port}/api/generate-guide`);
  console.log(`   POST http://localhost:${port}/api/exercise-guidance`);
});
