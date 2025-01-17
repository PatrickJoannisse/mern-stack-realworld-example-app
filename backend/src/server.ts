import express from "express";
// import {OpenApiValidator} from 'express-openapi-validator' // if version 3.*
import * as OpenApiValidator from "express-openapi-validator";
import { Express } from "express-serve-static-core";
import { connector, summarise } from "swagger-routes-express";
import YAML from "yamljs";
import path from "path";

import * as controllers from "./api/controllers";

export async function createServer(): Promise<Express> {
  const yamlSpecFile = path.resolve(__dirname, "./api/openapi.yml");
  const apiDefinition = YAML.load(yamlSpecFile);
  const apiSummary = summarise(apiDefinition);
  console.info(apiSummary);

  const server = express();
  // here we can intialize body/cookies parsers, connect logger, for example morgan

  // setup API validator
  const validatorOptions = {
    coerceTypes: true,
    apiSpec: yamlSpecFile,
    validateRequests: true,
    validateResponses: true,
  };
  //   await new OpenApiValidator(validatorOptions).install(server) // if version 3.*
  server.use(OpenApiValidator.middleware(validatorOptions));

  // error customization, if request is invalid
  server.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      res.status(err.status).json({
        error: {
          type: "request_validation",
          message: err.message,
          errors: err.errors,
        },
      });
    }
  );

  const connect = connector(controllers, apiDefinition, {
    onCreateRoute: (method: string, descriptor: any[]) => {
      console.log(
        `${method}: ${descriptor[0]} : ${(descriptor[1] as any).name}`
      );
    },
  });

  connect(server);

  return server;
}

createServer()
  .then((server) => {
    server.listen(3000, () => {
      console.info(`Listening on http://localhost:3000`);
    });
  })
  .catch((err) => {
    console.error(`Error: ${err}`);
  });
