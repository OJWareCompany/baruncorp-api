import _ from 'lodash'

type ModifiedFieldsType = Record<string, { propertyTitle: string; before: any; after: any; isDateType: boolean }>
/**
 * updated at, updated by 이외의 수정된 필드를 검색합니다.
 */
export function getModifiedFields<T>(original: T, modified: T): ModifiedFieldsType {
  const changes: ModifiedFieldsType = {}
  const excludingFields = ['updated_at', 'updatedAt', 'modified_by', 'modifiedBy', 'updated_by', 'updatedBy']

  function findChanges(originalObj: any, modifiedObj: any, path = ''): void {
    if (_.isNil(originalObj) || _.isNil(modifiedObj)) {
      return
    }

    if (_.isArray(originalObj) && _.isArray(modifiedObj)) {
      const maxLength = Math.max(originalObj.length, modifiedObj.length)
      for (let i = 0; i < maxLength; i++) {
        const newPath = `${path}[${i}]`
        findChanges(_.get(originalObj, i), _.get(modifiedObj, i), newPath)
      }
    } else {
      _.forEach(modifiedObj, (value, key) => {
        const newPath = path ? `${path}.${key}` : key

        if (_.isObject(value) && _.isObject(_.get(originalObj, key))) {
          findChanges(_.get(originalObj, key), value, newPath)
        } else if (!_.isEqual(_.get(originalObj, key), value)) {
          if (_.includes(excludingFields, key)) return null

          const beforeValue = transformValue(_.get(originalObj, key))
          const afterValue = transformValue(value)

          _.set(changes, newPath, {
            propertyTitle: _.startCase(key),
            before: beforeValue,
            after: afterValue,
            isDateType: isISO8601Date(beforeValue) || isISO8601Date(afterValue),
          })
        }
      })
    }
  }

  findChanges(original, modified)
  return changes
}

function transformValue(value: any) {
  if (_.isNil(value)) {
    return null
  }

  if (_.isNumber(value)) {
    return String(value)
  }

  return String(value)
}

// 날짜 형식 패턴 분석 함수
function isISO8601Date(str: any): boolean {
  // 문자열이 아니거나 빈 문자열인 경우 false 반환
  if (typeof str !== 'string' || str.trim() === '' || str === null) return false
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
  return regex.test(str)
}
