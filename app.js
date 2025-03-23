const express = require('express');
const path = require('path');

const cors = require('cors');
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require('./db');
const { swaggerUi, swaggerDocs } = require("./swagger");
const blogRoutes = require('./routes/blogs/blogRoutes');
const authRoutes = require('./routes/auth/authRoutes');
const taskRoutes = require('./routes/tasks/taskRoutes');
const faqRoutes = require('./routes/faq/faqRoutes');
const newsletterRoutes  = require('./routes/newsletter/newsletterRoutes');
dotenv.config();

const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.get('/', (req, res) => {
  res.send('Hello, welcome to my API!');
});
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/faq', faqRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/newsletter', newsletterRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

connectDB();
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Image size should not exceed 500KB!" });
    }
  }
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
