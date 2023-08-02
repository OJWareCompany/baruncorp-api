import { Body, Controller, Post } from '@nestjs/common'
import { AddressFromMapBox } from './infra/census/census.type.dto'
import { ProjectService } from './project.service'

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  /**
   * Census에서 행정구역이 매칭되지 않는 주소들이 있음
   * Census 결과와 상관 없이 프로젝트는 생성되어야함
   */
  @Post('')
  async postCreateProject(@Body() createProjectDto: AddressFromMapBox) {
    return await this.projectService.createProject(createProjectDto)
  }
}

/**
 * geography repository를 import해서 쓰자니 모듈화가 안된다.
 * 이벤트로 전달하면 되는걸까?
 * 지금 필요한 부분이 아니니까 나중에 알아보자.
 * 일단 geo관련한건 geo repo에서 구현하는걸로
 */
