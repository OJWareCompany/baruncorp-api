import { toPascalCase } from '../util/string-convertor.mjs'

export function getRepositoryPortFormat(folderName, domainName) {
  const entity = `${toPascalCase(domainName)}Entity`

  return `import { Paginated } from '../../../libs/ddd/repository.port'
import { ${entity} } from '../domain/${domainName}.entity'

export interface ${toPascalCase(domainName)}RepositoryPort {
  insert(entity: ${entity}): Promise<void>
  update(entity: ${entity}): Promise<void>
  delete(id: string): Promise<void>
  findOne(id: string): Promise<${entity} | null>
  find(): Promise<Paginated<${entity}>>
}
`
}
