import { ConfigModule } from '@nestjs/config'
ConfigModule.forRoot()

const { JWT_SECRET } = process.env

// TODO:  JOI
export const jwtConstants = {
  secret: JWT_SECRET,
}
