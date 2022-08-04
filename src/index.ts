import "reflect-metadata";
import 'module-alias/register';
import 'dotenv/config'
import * as bodyParser from 'body-parser';
import { InversifyExpressServer } from 'inversify-express-utils';

import { container } from "@config/ioc/inversify.config";
import { EnvironmentService } from "@config/env/environment.service";
import { TYPE } from "@config/ioc/types";

const environmentService: EnvironmentService = new EnvironmentService();
const loadedEnvironment = environmentService.loadEnvironment();
if (!loadedEnvironment.valid){
  throw new Error(loadedEnvironment.error);
}
container.bind<EnvironmentService>(TYPE.EnvironmentService).toConstantValue(environmentService);

// create server
const server = new InversifyExpressServer(container);
server.setConfig((app) => {
  // add body parser
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
});

const serverApp = server.build();
const port = environmentService.getVariables().port || 8000;
serverApp.listen(port, ()=>{console.log(`Server listening at ${port}`)});