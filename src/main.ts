import { NestFactory } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

ConfigModule.forRoot()

const { APP_PORT } = process.env

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  })

  // const prismaService = app.get(PrismaService)
  // await prismaService.enableShutdownHooks(app)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.use(cookieParser())

  await app.listen(APP_PORT)
}
bootstrap()
