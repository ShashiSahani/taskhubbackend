const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description: "A simple API to manage tasks",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Local Server",
      },
    ],
  },
  apis: ["./src/routes/taskRoutes.js"],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
