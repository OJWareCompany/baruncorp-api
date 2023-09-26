import { toPascalCase } from '../util/string-convertor.mjs'

export function getRepositoryPortFormat(folderName, domainName) {
  const entity = `${toPascalCase(domainName)}Entity`

  return `import { Paginated } from '../../../libs/ddd/repository.port'
import { ${entity} } from '../domain/${domainName}.entity'

export interface ${entity}RepositoryPort {
  insert(entity: ${entity}): Promise<void>
  update(entity: ${entity}): Promise<void>
  delete(entity: ${entity}): Promise<void>
  findOne(id: string): Promise<${entity} | null>
  find(): Promise<Paginated<${entity}>>
}

`
}
