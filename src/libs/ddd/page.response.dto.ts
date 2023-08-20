import { ApiProperty } from '@nestjs/swagger'
import { Paginated } from './repository.port'

/**
 * 제네릭에대한 표현의 어려움
 * HTTP용 페이지네이션 응답 객체
 */

export abstract class PaginatedResponseDto<T> extends Paginated<T> {
  @ApiProperty({ default: 1 })
  readonly page: number

  @ApiProperty({ default: 20 })
  readonly pageSize: number

  @ApiProperty({ example: 10000 })
  readonly totalCount: number

  @ApiProperty({ example: 500 })
  readonly totalPage: number

  @ApiProperty({ isArray: true })
  abstract items: readonly T[] // 그대로 사용하지 않고, 상속받는 구현체에서 구현하도록 (Swagger 표현, 혹은 각 아이템마다 특성에 맞는 작업을 위해)
}
