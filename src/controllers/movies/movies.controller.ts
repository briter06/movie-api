import * as express from "express";
import { interfaces, controller, httpGet, request, response, next } from "inversify-express-utils";
import { inject } from "inversify";
import { TYPE } from "@config/ioc/types";
import { MovieService } from "@services/movie/movie.service";

@controller("/movies")
export class MovieController implements interfaces.Controller {

    constructor(
        @inject(TYPE.MovieService) private movieService: MovieService
    ) {}

    @httpGet("/")
    public getMovies(@request() req: express.Request, @response() res: express.Response, @next() nextf: express.NextFunction): any {
        const result: any = this.movieService.getMovies();
        return result;
    }
}