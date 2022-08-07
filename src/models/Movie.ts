import { VISIBILITY } from "@enums/visibility.enum"

export interface Movie{
    id?: string
    release_date: string
    visibility: VISIBILITY
    description: string
    title: string
    actors: {
        name: string
    }[]
}