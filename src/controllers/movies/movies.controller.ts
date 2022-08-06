import * as express from "express";
import { interfaces, controller, httpGet, request, response, next } from "inversify-express-utils";
import { inject } from "inversify";
import { TYPE } from "@config/ioc/types";
import { MovieService } from "@services/movie/movie.service";
import { ROLES } from "@enums/roles.enum";
import { ApiRequest } from "@schemas/ApiRequest";
import { Movie } from "@models/Movie";
import { joiQueryValidator } from "@middlewares/joi/joi.middleware";
import Joi from "joi";

@controller("/movies")
export class MovieController implements interfaces.Controller {

    constructor(
        @inject(TYPE.MovieService) private movieService: MovieService
    ) {}

    @httpGet("/", TYPE.JwtMiddleware, joiQueryValidator(Joi.object().keys({
        owned: Joi.string().optional().valid('true','false')
    })))
    public async getMovies(@request() req: ApiRequest, @response() res: express.Response, @next() nextf: express.NextFunction): Promise<any> {
        const result: Movie[] = req.query.owned === 'true' ? await this.movieService.getMovies(req.user.username) : await this.movieService.getMovies();
        return {
            data: result
        };
    }
}