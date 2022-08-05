import "reflect-metadata";
import 'module-alias/register';
import 'dotenv/config'
import * as bodyParser from 'body-parser';
import { InversifyExpressServer } from 'inversify-express-utils';

import { container } from "@config/ioc/inversify.config";
import { EnvironmentService } from "@config/env/environment.service";
import { TYPE } from "@config/ioc/types";
import { errorFilter } from "@middlewares/error/error.filter";

const environmentService: EnvironmentService = new EnvironmentService();
const loadedEnvironment = environmentService.loadEnvironment();
if (!loadedEnvironment.valid){
  throw new Error(loadedEnvironment.error);
}
container.bind<EnvironmentService>(TYPE.EnvironmentService).toConstantValue(environmentService);

// create server
const server = new InversifyExpressServer(container, null, {
  rootPath: environmentService.getVariables().rootPath
});
server.setConfig((app) => {
  // add body parser
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
});

server.setErrorConfig((app) => {
  app.use(errorFilter);
});

const serverApp = server.build();
const port = environmentService.getVariables().port || 8000;
serverApp.listen(port, ()=>{console.log(`Server listening at ${port}`)});