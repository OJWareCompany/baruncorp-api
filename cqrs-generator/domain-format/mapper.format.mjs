import { toPascalCase } from '../util/string-convertor.mjs'

export function getMapperFormat(folderName, domainName) {
  const entity = `${toPascalCase(domainName)}Entity`
  const responseDto = `${entity}ResponseDto`
  const entityMapper = `${entity}Mapper`

  return `import { ${toPascalCase(domainName)} } from '@prisma/client'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { ${responseDto} } from './dtos/${domainName}.response.dto'
import { ${entity} } from './domain/${domainName}.entity'

export class ${entityMapper} implements Mapper<${entity}, ${toPascalCase(domainName)}, ${responseDto}> {
  toPersistence(entity: ${entity}): ${toPascalCase(domainName)} {
    const props = entity.getProps()
    const record: ${toPascalCase(domainName)} = {
      id: props.id,
    }
    return record
  }

  toDomain(record: ${toPascalCase(domainName)}): ${entity} {
    const entity = new ${entity}({
      id: record.id,
      props: {
      },
    })
    return entity
  }

  toResponse(entity: ${entity}): ${responseDto} {
    const props = entity.getProps()
    const response = new ${responseDto}({
      id: props.id,
    })
    return response
  }
}

`
}
