import { Container } from 'inversify';
import { buildProviderModule, provide } from 'inversify-binding-decorators'

// set up container
const container = new Container();

// import controllers
import "@controllers/movies/movies.controller";
import "@controllers/auth/auth.controller";

// import services
import "@services/auth/auth.service";
import "@services/movie/movie.service";
import "@services/persistance/persistance.service";

// import middlewares
import "@middlewares/jwt/jwt.middleware";

container.load(buildProviderModule());

export { container, provide };