import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { Movie } from "@models/Movie";
import { User } from "@models/User";
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
        const movies = this.persistanceService.getMovies(ownerId);
        return movies
    }

    public async createMovie(user:User,movie: Movie){
        const keyContent = `${user.username}#${movie.title}#${moment().toISOString()}`;
        movie.id = createHash(keyContent);
        const result = await this.persistanceService.createMovie(user,movie);
        return result
    }

    public async deleteMovie(user: User, movieId: string){
        const result = await this.persistanceService.deleteMovie(user, movieId);
        return result;
    }

}