import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigModule } from '@nestjs/config'
import cookieParser from 'cookie-parser'

ConfigModule.forRoot()

const { APP_PORT } = process.env

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(cookieParser())

  await app.listen(APP_PORT)
}
bootstrap()
