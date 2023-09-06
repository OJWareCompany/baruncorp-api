import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class FindUsersQuery extends PaginatedQueryBase {
  readonly email?: string

  readonly organizationId?: string

  constructor(props: PaginatedParams<FindUsersQuery>) {
    super(props)
    initialize(this, props)
  }
}
