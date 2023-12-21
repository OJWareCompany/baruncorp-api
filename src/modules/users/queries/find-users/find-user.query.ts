import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class FindUsersQuery extends PaginatedQueryBase {
  readonly email?: string | null
  readonly organizationId?: string | null
  readonly organizationName?: string | null
  readonly isContractor?: boolean | null
  readonly userName?: string | null

  constructor(props: PaginatedParams<FindUsersQuery>) {
    super(props)
    initialize(this, props)
  }
}
