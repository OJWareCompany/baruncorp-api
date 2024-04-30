import { NestFactory } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { rateLimit } from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { LoggingMiddleware } from './libs/common/middleware/logging.middleware'

ConfigModule.forRoot()

const { APP_PORT } = process.env

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(new LoggingMiddleware().use)

  app.use(
    rateLimit({
      skip: (req, res) => req.path === '/auth/me',
      windowMs: Number(1000),
      max: Number(30),
    }),
  )

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.use(cookieParser())

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .addServer('http://localhost:3000')
    .addServer('http://54.180.214.169:3000')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  process.on('uncaughtException', (error) => {
    console.error('Unhandled Exception', error)
  })

  await app.listen(Number(APP_PORT))
}
bootstrap()
