/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { ORGANIZATION_REPOSITORY } from './organization.di-token'
import { OrganizationRepositoryPort } from './database/organization.repository.port'
import { UserRepositoryPort } from '../users/database/user.repository.port'
import { USER_REPOSITORY } from '../users/user.di-tokens'
import { OrganizationEntity } from './domain/organization.entity'

@Injectable()
export class OrganizationService {
  constructor(
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepository: OrganizationRepositoryPort,
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}

  async findOrganizationById(organizationId: string): Promise<OrganizationEntity | null> {
    return await this.organizationRepository.findOneOrThrow(organizationId)
  }

  /**
   * TODO: Aggregate 구현하기
   *
   * 유저를 조회할때 관련된 정보를 함께 조회해야한다. (조직, 자격증, 등)
   * Domain Service는 DTO가 아닌 Entity를 반환해야하므로 Application Service에서 각각의 정보들을 조회하고 조합해서 응답한다.
   * 유저 리스트를 조회할때 application 메서드를 재사용하게 되면, 10명의 유저를 조회했을때 10번의 메서드가 반복된다.
   * 그럼 database call이 불필요하게 많이 생긴다.
   *
   * 어쨋든! 유저의 정보가 담긴 객체 (UserEntity)는 항상 다른 테이블을 join하여서 쓰려고 하는 상황이다.
   * 이때! Aggregate 개념이 필요한 것 같다! (여러가지 Entity의 묶음)
   */
}
