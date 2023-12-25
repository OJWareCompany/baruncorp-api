import { ConnectedSocket, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { PrismaService } from '../database/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { config, jwtConstants } from '../auth/constants'
import { HttpStatus } from '@nestjs/common'
import { instanceToPlain } from 'class-transformer'
import { AssigningTaskAlertResponse } from './dto/assigning-task-alert.response.dto'

class InvalidSignatureWsException extends WsException {
  constructor() {
    super({ errorCode: '10023', message: 'invalid signature', statusCode: HttpStatus.UNAUTHORIZED })
  }
}
class UserNotFoundWsException extends WsException {
  constructor() {
    super({ errorCode: '10024', message: 'Not Found User', statusCode: HttpStatus.NOT_FOUND })
  }
}

@WebSocketGateway({
  path: config.socketPort,
  namespace: 'assigning-task',
  cors: true,
  credentials: true,
})
export class AssigningTaskAlertGateway {
  constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) {}
  @WebSocketServer()
  server: Server

  async handleConnection(@ConnectedSocket() client: Socket) {
    const token: string | string[] | undefined = client.handshake.query.token
    if (Array.isArray(token) || !token) {
      throw new InvalidSignatureWsException()
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: jwtConstants.secret })
      const user = await this.prismaService.users.findUnique({ where: { id: payload.id } })
      if (!user) {
        throw new UserNotFoundWsException()
      }
      client.join(user.id)
    } catch (error) {
      if ((error as any).message === 'invalid signature') {
        client.emit('error', {
          errorCode: '10023',
          message: 'invalid signature',
          statusCode: HttpStatus.UNAUTHORIZED,
        })
      } else {
        client.emit('error', {
          errorCode: (error as any)?.error?.errorCode,
          message: (error as any)?.message,
          statusCode: (error as any)?.error?.statusCode,
        })
      }
      client.disconnect()
    }
  }

  async emitTaskAssignedEvent(userId: any, task: AssigningTaskAlertResponse) {
    this.server.to(userId).emit('task-assigned', instanceToPlain(task))
  }
}
