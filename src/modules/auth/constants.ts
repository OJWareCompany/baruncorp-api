import { ConfigModule } from '@nestjs/config'
ConfigModule.forRoot()

const { JWT_SECRET } = process.env
const { SOCKET_PORT } = process.env

// TODO:  JOI
// TODO: Generate config module
export const jwtConstants = {
  secret: JWT_SECRET,
}

export const config = {
  socketPort: SOCKET_PORT,
}
