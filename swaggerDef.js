import swaggerJSDoc from "swagger-jsdoc";

const host = `http://${process.env.IP}:${process.env.PORT}`;

const swaggerDefinition = {

  info: {
    title: "Node Swagger API",
    version: "1.0.0",
    description: "Demonstrating how to describe a RESTful API with Swagger",
  },
  host,
  basePath: "/",
  swagger: "2.0",
  paths: { },
  definitions: { },
  responses: { },
  parameters: { },
  securityDefinitions: { },
};

const options = {
  swaggerDefinition,
  apis: ["./**/routes/*.js", "routes.js"],
};

const swaggerSpec = swaggerJSDoc(options);

exports = { swaggerDefinition, options, swaggerSpec };
