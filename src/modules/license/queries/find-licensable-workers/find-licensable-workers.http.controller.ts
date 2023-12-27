import { Controller, Get } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Users } from '@prisma/client'
import { FindLicensableWorkersQuery } from './find-licensable-workers.query-handler'
import { PositionUnregisteredUserResponseDto } from '../../../position/dtos/position-unregistered-user.response.dto'

@Controller('licenses')
export class FindLicensableWorkersHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('licensable/workers')
  async get(): Promise<PositionUnregisteredUserResponseDto> {
    const command = new FindLicensableWorkersQuery({
      // abbreviation: param.abbreviation,
      // type: request.type,
    })
    const result: Users[] = await this.queryBus.execute(command)

    return {
      items: result.map((user) => {
        return {
          userId: user.id,
          email: user.email,
          userName: user.full_name,
        }
      }),
    }
  }
}
