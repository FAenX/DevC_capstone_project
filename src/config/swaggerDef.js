import swaggerJSDoc from "swagger-jsdoc";

const host = "https://glacial-sea-11269.herokuapp.com";

const swaggerDefinition = {

  info: {
    title: "DevC capstone Project - Teamwork",
    version: "1.0.0",
    description: "Teamwork is an internal social network for employees of an organization. The goal of this application is to facilitate more interaction between colleagues and promote team bonding.",
  },
  host,
  basePath: "/api/vi/",
  swagger: "2.0",
  paths: { },
  definitions: { },
  responses: { },
  parameters: { },
  securityDefinitions: {
    BasicAuth: {
      type: "http",
      scheme: "basic",
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./swagger.yaml"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerDefinition, options, swaggerSpec };
