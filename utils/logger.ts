import consola from "consola"
consola.wrapConsole()
export namespace logger {
    
    export const error = (...args: any[]) => {
        console.error(...args)
    }
    export const log = (...args: any[]) => {
        console.log(...args)
    }
}