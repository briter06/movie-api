const SERVICES = {
    AuthService: Symbol("AuthService"),
    EnvironmentService: Symbol('EnvironmentService'),
    LoggerService: Symbol('LoggerService'),
    MovieService: Symbol('MovieService'),
    PersistanceService: Symbol('PersistanceService'),
    RandomService: Symbol('RandomService')
}

const MIDDLEWARES = {
    JwtMiddleware: Symbol('JwtMiddleware')
}

export const TYPE = {
    ...SERVICES,
    ...MIDDLEWARES
}