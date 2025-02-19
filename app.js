const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const taskRoutes = require('./routes/tasks/taskRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
  res.send('Hello, welcome to my API!');
});
app.use('/tasks', taskRoutes);

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
