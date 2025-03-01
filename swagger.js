const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TaskHub API",
      version: "1.0.0",
      description: "A simple API for managing tasks",
    },
    servers: [
      {
        url: "https://taskhubbackend-4rue.onrender.com", 
      },
    ],
  },
  apis: ["./routes/tasks/taskRoutes.js"], 
};

const swaggerDocs = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerDocs };
