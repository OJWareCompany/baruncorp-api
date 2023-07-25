import { ApiProperty } from '@nestjs/swagger'

/**
 * 제네릭에대한 표현의 어려움
 */

export class Page<T> {
  @ApiProperty({ default: 20 })
  pageSize: number
  @ApiProperty({ default: 10000 })
  totalCount: number
  @ApiProperty({ default: 500 })
  totalPage: number
  @ApiProperty({ default: [{}] })
  items: T[]

  constructor(totalCount: number, pageSize: number, items: T[]) {
    this.pageSize = pageSize
    this.totalCount = totalCount
    this.totalPage = Math.ceil(totalCount / pageSize)
    this.items = items
  }
}
