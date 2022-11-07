export interface Enviroment {
   baseURL: string;
}

const devEnviroment: Enviroment = {
   baseURL: 'http://localhost:3333'
}

export const enviroment = devEnviroment