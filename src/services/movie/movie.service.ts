import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { Movie } from "@models/Movie";
import { PersistanceService } from "@services/persistance/persistance.service";
import { inject } from "inversify";

@provide(TYPE.MovieService)
export class MovieService{

    constructor(
        @inject(TYPE.PersistanceService) private persistanceService: PersistanceService
    ){}

    public async getMovies(ownerId?: string): Promise<Movie[]> {
        const movies = this.persistanceService.getMovies(ownerId);
        return movies
    }

}