/*  Most of repositories will probably need generic 
    save/find/delete operations, so it's easier
    to have some shared interfaces.
    More specific queries should be defined
    in a respective repository.
*/

/**
 * Repository, Service에서 사용
 * 여러가지 데이터의 페이지네이션 응답 객체의 포맷을 규격화하고 재사용한다.
 */
export class Paginated<T> {
  readonly totalCount: number
  readonly pageSize: number
  readonly page: number
  readonly totalPage: number
  readonly items: readonly T[]

  constructor(props: Omit<Paginated<T>, 'totalPage'>) {
    this.totalCount = props.totalCount
    this.pageSize = props.pageSize
    this.page = props.page
    this.totalPage = Math.ceil(props.totalCount / props.pageSize)
    this.items = props.items
  }
}

export type OrderBy = { field: string | true; param: 'asc' | 'desc' }

export type PaginatedQueryParams = {
  limit: number
  page: number
  offset: number
  orderBy: OrderBy | null | undefined
}

// export interface RepositoryPort<Entity> {
//   insert(entity: Entity | Entity[]): Promise<void>
//   findOneById(id: string): Promise<Option<Entity>>
//   findAll(): Promise<Entity[]>
//   findAllPaginated(params: PaginatedQueryParams): Promise<Paginated<Entity>>
//   delete(entity: Entity): Promise<boolean>

//   transaction<T>(handler: () => Promise<T>): Promise<T>
// }
