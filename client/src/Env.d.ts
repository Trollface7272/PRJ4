declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: string,
            PORT: number,
            DEFAULT_LANGUAGE: string
        }
    }
}