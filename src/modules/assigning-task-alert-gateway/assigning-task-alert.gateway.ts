import { ApiProperty } from '@nestjs/swagger'
import { ConnectedSocket, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { PrismaService } from '../database/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { config, jwtConstants } from '../auth/constants'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../project/domain/project.type'
import { HttpStatus } from '@nestjs/common'
import { instanceToPlain } from 'class-transformer'
import { initialize } from '../../libs/utils/constructor-initializer'

// TODO: class-transfer 사용해서 넘어온 데이터에서 정의된 필드만 걸러내기
// @Exclude()
export class TaskAlert {
  @ApiProperty()
  readonly taskId: string
  @ApiProperty()
  readonly taskName: string
  @ApiProperty()
  readonly jobId: string
  @ApiProperty()
  readonly projectPropertyType: ProjectPropertyTypeEnum
  @ApiProperty()
  readonly mountingType: MountingTypeEnum
  @ApiProperty()
  readonly isRevision: boolean
  @ApiProperty()
  readonly note: string | null

  constructor(props: TaskAlert) {
    initialize(this, props)
  }
}

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

@WebSocketGateway({ path: config.socketPort, namespace: 'assigning-task', cors: true })
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

  async emitTaskAssignedEvent(userId: any, task: TaskAlert) {
    this.server.to(userId).emit('task-assigned', instanceToPlain(task))
  }
}
