import { ApiProperty } from '@nestjs/swagger'

/**
 * Repository, Service에서 사용
 * 여러가지 데이터의 페이지네이션 응답 객체의 포맷을 규격화하고 재사용한다.
 */
export class Paginated<T> {
  readonly page: number
  readonly pageSize: number
  readonly totalCount: number
  readonly totalPage: number
  readonly items: readonly T[]

  constructor(props: Omit<PaginatedResponseDto<T>, 'totalPage'>) {
    this.pageSize = props.pageSize
    this.totalCount = props.totalCount
    this.totalPage = Math.ceil(props.totalCount / props.pageSize)
    this.items = props.items
  }
}

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

  constructor(props: Omit<PaginatedResponseDto<T>, 'totalPage'>) {
    super(props)
  }
}
