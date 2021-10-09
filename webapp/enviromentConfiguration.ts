import * as dotenv from "dotenv";
dotenv.config();

export interface EnviromentConfiguration {
    JWT_SECRET_KEY: string
}

export const enviromentConfiguration: EnviromentConfiguration = {
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || ""
}