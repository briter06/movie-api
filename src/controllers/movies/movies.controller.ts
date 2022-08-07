import * as express from "express";
import { interfaces, controller, httpGet, request, response, next, httpPut, httpDelete, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { TYPE } from "@config/ioc/types";
import { MovieService } from "@services/movie/movie.service";
import { ApiRequest } from "@schemas/ApiRequest";
import { Movie } from "@models/Movie";
import { joiBodyValidator, joiQueryValidator } from "@middlewares/joi/joi.middleware";
import Joi from "joi";
import moment from "moment";
import { VISIBILITY } from "@enums/visibility.enum";

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

    @httpPost("/", TYPE.JwtMiddleware, joiBodyValidator(Joi.object().keys({
        release_date: Joi.string().required().custom((value, helper)=>{
            const date = moment(value, 'YYYY-MM-DD', true);
            if(date.isValid()){
                return true;
            }else{
                return helper.error('date.invalid');
            }
        }).messages({
            'date.invalid': '"release_date" must be a valid date in YYYY-MM-DD format'
        }),
        visibility: Joi.string().required().valid(VISIBILITY.PUBLIC, VISIBILITY.PRIVATE),
        description: Joi.string().required().max(200),
        title: Joi.string().required().max(25),
        actors: Joi.array().items({
            name: Joi.string().required()
        }).max(10)
    })))
    public async createMovie(@request() req: ApiRequest, @response() res: express.Response, @next() nextf: express.NextFunction): Promise<any> {
        const result = await this.movieService.createMovie(req.user,{
            release_date: req.body.release_date,
            visibility: req.body.visibility,
            description: req.body.description,
            title: req.body.title,
            actors: req.body.actors
        });
        return {
            data: result
        };
    }

    @httpDelete("/", TYPE.JwtMiddleware, joiBodyValidator(Joi.object().keys({
        movieId: Joi.string().required()
    })))
    public async deleteMovie(@request() req: ApiRequest, @response() res: express.Response, @next() nextf: express.NextFunction): Promise<any> {
        const result = await this.movieService.deleteMovie(req.user, req.body.movieId);
        return {
            data: result
        };
    }
}