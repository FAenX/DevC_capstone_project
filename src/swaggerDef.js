import swaggerJSDoc from "swagger-jsdoc";

const host = `http://${process.env.IP}:${process.env.PORT}`;

const swaggerDefinition = {

  info: {
    title: "DevC capstone project",
    version: "1.0.0",
    description: "Teamwork",
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
  apis: ["./swagger.yaml"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerDefinition, options, swaggerSpec };
