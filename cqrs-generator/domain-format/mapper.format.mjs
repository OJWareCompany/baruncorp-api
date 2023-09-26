import { toPascalCase } from '../util/string-convertor.mjs'

export function getMapperFormat(folderName, domainName) {
  const entity = `${toPascalCase(domainName)}Entity`
  const responseDto = `${toPascalCase(domainName)}ResponseDto`
  const entityMapper = `${toPascalCase(domainName)}Mapper`

  return `import { ${toPascalCase(domainName)}s } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { ${responseDto} } from './dtos/${domainName}.response.dto'
import { ${entity} } from './domain/${domainName}.entity'


class Fields implements ${toPascalCase(domainName)}s {

}

@Injectable()
export class ${entityMapper} implements Mapper<${entity}, ${toPascalCase(domainName)}s, ${responseDto}> {
  toPersistence(entity: ${entity}): ${toPascalCase(domainName)}s {
    const props = entity.getProps()
    const record: ${toPascalCase(domainName)}s = {
      id: props.id,
    }
    return record
  }

  toDomain(record: ${toPascalCase(domainName)}s): ${entity} {
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
