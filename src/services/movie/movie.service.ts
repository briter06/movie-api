import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { ScanOperators } from "@enums/scanOperators.enum";
import { VISIBILITY } from "@enums/visibility.enum";
import { ForbiddenItemError } from "@errors/forbiddenItem.error";
import { ItemNoExistsError } from "@errors/itemNoExists.error";
import { Movie, UPDATABLE_MOVIE_FIELDS } from "@models/Movie";
import { User } from "@models/User";
import { ScanParams } from "@schemas/ScanParams";
import { PersistanceService } from "@services/persistance/persistance.service";
import { createHash } from "@utils/hash.crypto";
import { inject } from "inversify";
import moment from "moment";

@provide(TYPE.MovieService)
export class MovieService{

    constructor(
        @inject(TYPE.PersistanceService) private persistanceService: PersistanceService
    ){}

    public async getMovies(ownerId?: string): Promise<Movie[]> {
        const scanParams: ScanParams = ownerId ?
        {
            SK: {
                operator: ScanOperators.BEGINS_WITH,
                value: 'MOVIE#'
            },
            PK: {
                operator: ScanOperators.EQUALS,
                value: `USER#${ownerId}`
            }
        } :
        {
            SK: {
                operator: ScanOperators.BEGINS_WITH,
                value: 'MOVIE#'
            },
            visibility: {
                operator: ScanOperators.EQUALS,
                value: VISIBILITY.PUBLIC
            }
        }
        const fieldsToReturn = ['release_date', 'SK', 'description', 'title', 'visibility', 'actors'];
        const records = await this.persistanceService.scanRecords(fieldsToReturn, scanParams);
        const movies: Movie[] = records.map((r:any)=>({
            id: r.SK.split('#')[1],
            release_date: r.release_date,
            visibility: r.visibility,
            description: r.description,
            title: r.title,
            actors: r.actors
        }));
        return movies
    }

    public async createMovie(user:User,movie: Movie){
        const keyContent = `${user.username}#${movie.title}#${moment().toISOString()}`;
        movie.id = createHash(keyContent);
        const result = await this.persistanceService.createItem({
            PK: `USER#${user.username}`,
            SK: `MOVIE#${movie.id}`
        },{
            release_date: movie.release_date,
            visibility: movie.visibility,
            description: movie.description,
            title: movie.title,
            actors: movie.actors
        });
        // const result = await this.persistanceService.createMovie(user,movie);
        return result
    }

    public async updateMovie(user:User, movieId: string, movie: any){
        const objectKeys = Object.keys(movie);
        const updatableFields = objectKeys.filter(k=>UPDATABLE_MOVIE_FIELDS.indexOf(k as any)!==-1);
        const newMovieData: any = {};
        updatableFields.forEach((f)=>{
            newMovieData[f] = movie[f];
        });
        const movieRecords = await this.persistanceService.scanRecords(['PK','SK'],{
            SK: {
                operator: ScanOperators.EQUALS,
                value: `MOVIE#${movieId}`
            }
        });
        if(movieRecords.length>0){
            try{
                const result = await this.persistanceService.updateItem({
                    PK: `USER#${user.username}`,
                    SK: `MOVIE#${movieId}`
                }, newMovieData);
                return result;
            }catch(err){
                throw new ForbiddenItemError('Forbidden movie');
            }
        }
        throw new ItemNoExistsError('Movie id does not exist');
    }

    public async deleteMovie(user: User, movieId: string){
        const movieRecords = await this.persistanceService.scanRecords(['PK','SK'],{
            SK: {
                operator: ScanOperators.EQUALS,
                value: `MOVIE#${movieId}`
            }
        });
        if(movieRecords.length>0){
            try{
                const result = await this.persistanceService.deleteItem({
                    PK: `USER#${user.username}`,
                    SK: `MOVIE#${movieId}`
                });
                return result;
            }catch(err){
                throw new ForbiddenItemError('Forbidden movie');
            }
        }
        throw new ItemNoExistsError('Movie id does not exist');
    }

}