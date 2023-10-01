import { toCamelCase, toPascalCase, toScreamingSnakeCase } from '../util/string-convertor.mjs'

export function getModuleFormat(folderName, domainName) {
  const camelDomainName = `${toCamelCase(domainName)}`
  const pascalDomainName = `${toPascalCase(domainName)}`

  return `import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import UserMapper from '../users/user.mapper'
import { Create${pascalDomainName}HttpController } from './commands/create-${domainName}/create-${domainName}.http.controller'
import { Update${pascalDomainName}HttpController } from './commands/update-${domainName}/update-${domainName}.http.controller'
import { Delete${pascalDomainName}HttpController } from './commands/delete-${domainName}/delete-${domainName}.http.controller'
import { Find${pascalDomainName}HttpController } from './queries/find-${domainName}/find-${domainName}.http.controller'
import { Find${pascalDomainName}PaginatedHttpController } from './queries/find-${domainName}-paginated/find-${domainName}.paginated.http.controller'
import { Create${pascalDomainName}Service } from './commands/create-${domainName}/create-${domainName}.service'
import { Update${pascalDomainName}Service } from './commands/update-${domainName}/update-${domainName}.service'
import { Delete${pascalDomainName}Service } from './commands/delete-${domainName}/delete-${domainName}.service'
import { Find${pascalDomainName}QueryHandler } from './queries/find-${domainName}/find-${domainName}.query-handler'
import { Find${pascalDomainName}PaginatedQueryHandler } from './queries/find-${domainName}-paginated/find-${domainName}.paginated.query-handler'
import { ${toScreamingSnakeCase(domainName)}_REPOSITORY } from './${domainName}.di-token'
import { ${pascalDomainName}Repository } from './database/${domainName}.repository'
import { ${pascalDomainName}Mapper } from './${domainName}.mapper'

const httpControllers = [
  Create${pascalDomainName}HttpController,
  Update${pascalDomainName}HttpController,
  Delete${pascalDomainName}HttpController,
  Find${pascalDomainName}HttpController,
  Find${pascalDomainName}PaginatedHttpController,
]
const commandHandlers: Provider[] = [Create${pascalDomainName}Service, Update${pascalDomainName}Service, Delete${pascalDomainName}Service]
const queryHandlers: Provider[] = [Find${pascalDomainName}QueryHandler, Find${pascalDomainName}PaginatedQueryHandler]
const repositories: Provider[] = [
  {
    provide: ${toScreamingSnakeCase(domainName)}_REPOSITORY,
    useClass: ${pascalDomainName}Repository,
  },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [${pascalDomainName}Mapper, UserMapper]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
})
export class ${toPascalCase(domainName)}Module {}
`
}
