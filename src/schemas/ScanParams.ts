import { ScanOperators } from "@enums/scanOperators.enum"


export interface ScanParams{
    [key: string]: {
        operator: ScanOperators,
        value: any
    }
}