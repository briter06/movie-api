import { VISIBILITY } from "@enums/visibility.enum"

export interface Movie{
    release_date: string
    visibility: VISIBILITY
    description: string
    title: string
}