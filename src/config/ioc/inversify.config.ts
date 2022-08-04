import { Container } from 'inversify';
import { buildProviderModule, provide } from 'inversify-binding-decorators'

// set up container
const container = new Container();

// import controllers
import "@controllers/movies/movies.controller";

// import services
import "@services/movie/movie.service"

container.load(buildProviderModule())

export { container, provide }