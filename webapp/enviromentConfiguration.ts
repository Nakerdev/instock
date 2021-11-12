import * as dotenv from 'dotenv'
dotenv.config()

export interface EnviromentConfiguration {
    JWT_SECRET_KEY: string,
    SENDGRID_API_KEY: string,
    SYMETRIC_ENCRYPTION_KEY: string,
    NO_REPPLY_EMAIL: string,
    SUPPORT_EMAIL: string,
    WEBAPP_BASE_URL: string,
    SOURCE: string
}

export const enviromentConfiguration: EnviromentConfiguration = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || '',
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
  SYMETRIC_ENCRYPTION_KEY: process.env.SYMETRIC_ENCRYPTION_KEY || '',
  NO_REPPLY_EMAIL: 'noreply.stockout@gmail.com',
  SUPPORT_EMAIL: 'hello.stockout@gmail.com',
  WEBAPP_BASE_URL: 'http://localhost:3000',
  SOURCE: 'WebApp'
}
