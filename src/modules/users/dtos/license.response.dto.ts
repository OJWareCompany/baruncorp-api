import { ApiProperty } from '@nestjs/swagger'
import { LicenseType } from '../../users/user-license.type'
import { initialize } from '../../../libs/utils/constructor-initializer'

export class LincenseResponseDto {
  @ApiProperty({ enum: LicenseType })
  readonly type: string

  @ApiProperty()
  readonly ownerName: string

  @ApiProperty()
  readonly issuingCountryName: string

  @ApiProperty()
  readonly abbreviation: string

  @ApiProperty()
  readonly priority: number | null

  @ApiProperty()
  readonly expiryDate: string | null

  constructor(create: LincenseResponseDto) {
    initialize(this, create)
  }
}

/**
 * 문서에 보이는 형태의 테이블로 보낸다면?
 * - 화면에 종속적으로 데이터를 보내게 된다, 나중에 테이블 형태가 바뀐다면 또 바꿔야함.
 * - priority가 현재는 7까지 있지만 더 늘어날수도 있는데 클라이언트에서 동적으로 처리할수 있어야함. (응답 포맷이 테이블 형태가 아니어도 어차피 해야하는 것)
 *
 * 나의 라이센스 조회
 * 전체 라이센스 조회 (데이터가 있든 없든 모든 State기준 Left Join)
 * {
 *  "${issuingCountryName}": {
 *    "${type}",
 *    "${priority}": "${userName}",
 *    "${priority}": "${userName}",
 *  }
 * }
 */
