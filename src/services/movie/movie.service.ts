import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";

@provide(TYPE.MovieService)
export class MovieService{


    public getMovies(): any {
        return {
            data: true
        }
    }

}