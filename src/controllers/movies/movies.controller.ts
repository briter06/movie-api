import * as express from "express";
import { interfaces, controller, httpGet, request, response, next, httpPut, httpDelete, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { TYPE } from "@config/ioc/types";
import { MovieService } from "@services/movie/movie.service";
import { ApiRequest } from "@schemas/ApiRequest";
import { joiBodyValidator, joiQueryValidator } from "@middlewares/joi/joi.middleware";
import Joi from "joi";
import { VISIBILITY } from "@enums/visibility.enum";
import { joiDateFormat, joiStringInteger } from "@utils/joi.utils";

@controller("/movies")
export class MovieController implements interfaces.Controller {

    constructor(
        @inject(TYPE.MovieService) private movieService: MovieService
    ) {}

    @httpGet("/", TYPE.JwtMiddleware, joiQueryValidator(Joi.object().keys({
        owned: Joi.string().optional().valid('true','false'),
        limit: joiStringInteger().optional(),
        pageId: Joi.string().optional()
    })))
    public async getMovies(@request() req: ApiRequest, @response() res: express.Response, @next() nextf: express.NextFunction): Promise<any> {
        const pagination: any = {}
        if(req.query.limit){
            pagination.limit = Number(req.query.limit);
        }
        if(req.query.pageId){
            pagination.startKey = req.query.pageId;
        }
        const result = req.query.owned === 'true' ? await this.movieService.getMovies(pagination,req.user.username) : await this.movieService.getMovies(pagination);
        const resp: any = {
            data: {
                movies: result.movies
            }
        }
        if(result.lastEvaluatedKey){
            resp.data.nextPageId = result.lastEvaluatedKey;
        }
        return resp;
    }

    @httpPost("/", TYPE.JwtMiddleware, joiBodyValidator(Joi.object().keys({
        release_date: joiDateFormat('YYYY-MM-DD').required(),
        visibility: Joi.string().required().valid(VISIBILITY.PUBLIC, VISIBILITY.PRIVATE),
        description: Joi.string().required().max(200),
        title: Joi.string().required().max(25),
        cast: Joi.array().items({
            name: Joi.string().required()
        }).max(10).required()
    })))
    public async createMovie(@request() req: ApiRequest, @response() res: express.Response, @next() nextf: express.NextFunction): Promise<any> {
        const result = await this.movieService.createMovie(req.user,{
            release_date: req.body.release_date,
            visibility: req.body.visibility,
            description: req.body.description,
            title: req.body.title,
            cast: req.body.cast
        });
        return {
            data: result
        };
    }

    @httpPut("/", TYPE.JwtMiddleware, joiBodyValidator(Joi.object().keys({
        movieId: Joi.string().required(),
        data: Joi.object().keys({
            release_date: joiDateFormat('YYYY-MM-DD').optional(),
            visibility: Joi.string().optional().valid(VISIBILITY.PUBLIC, VISIBILITY.PRIVATE),
            description: Joi.string().optional().max(200),
            title: Joi.string().optional().max(25),
            cast: Joi.array().items({
                name: Joi.string().required()
            }).max(10).optional()
        }).required()
    })))
    public async updateMovie(@request() req: ApiRequest, @response() res: express.Response, @next() nextf: express.NextFunction): Promise<any> {
        const result = await this.movieService.updateMovie(req.user,req.body.movieId,req.body.data);
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