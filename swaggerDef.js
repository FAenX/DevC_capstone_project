import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

const host = `http://${process.env.IP}:${process.env.PORT}`;

const swaggerDefinition = {
  
  info: {
    title: "Node Swagger API",
    version: "1.0.0",
    description: "Demonstrating how to describe a RESTful API with Swagger"
  },
  host: "localhost:3001",
  basePath: "/",
  swagger: "2.0",
  paths: { },
  definitions: { },
  responses: { },
  parameters: { },
  securityDefinitions: { }
}
const options = {
  swaggerDefinition,
  apis: ['./**/routes/*.js','routes.js'],
};
const swaggerSpec = swaggerJSDoc(options);

module.exports = {swaggerDefinition, options, swaggerSpec};