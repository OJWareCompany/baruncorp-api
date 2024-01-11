import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { CreatePtoDetailCommand } from './create-pto-detail.command'
import { CreatePtoDetailRequestDto } from './create-pto-detail.request.dto'
import { ApiResponse } from '@nestjs/swagger'
import { AnnualPtoNotExceedException, DaysRangeIssueException, PastDatePTOException } from '../../domain/pto.error'

@Controller('ptos')
export class CreatePtoDetailHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  @ApiResponse({ status: HttpStatus.CREATED, type: IdResponse })
  @UseGuards(AuthGuard)
  async post(@Body() dto: CreatePtoDetailRequestDto): Promise<IdResponse> {
    // 연차 시작일과 종료일의 시간 범위 설정
    dto.startedAt.setHours(0, 0, 0, 0)
    // 과거 시간에 연차를 등록 할 시 예외처리
    const currentDate: Date = new Date()
    if (dto.startedAt < currentDate) throw new PastDatePTOException()

    if (dto.days > 100) throw new AnnualPtoNotExceedException()

    const endedAt: Date = new Date(dto.startedAt)
    endedAt.setDate(endedAt.getDate() + +dto.days)
    endedAt.setHours(23, 59, 59, 999)

    const command = new CreatePtoDetailCommand({
      ...dto,
      endedAt: endedAt,
    })
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
