import { VISIBILITY } from "@enums/visibility.enum"

export interface Movie{
    id?: string
    title: string
    release_date: string
    visibility: VISIBILITY
    description: string
    cast: {
        name: string
    }[]
}

export const UPDATABLE_MOVIE_FIELDS: (keyof Movie)[] = ["title", "release_date", "visibility", "description", "cast"];