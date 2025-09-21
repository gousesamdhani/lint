
export interface Logger {
    readonly log: (message: string, args?: object) => void;
    readonly error: (message: string, args?: object) =>void
}

export const consoleLogger: Logger = {
    log: (message, args) => console.log(message, args),
    error: (message, args) => console.log(message, args)
}