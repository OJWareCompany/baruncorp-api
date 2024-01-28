import _ from 'lodash'

export function getModifiedFields<T>(
  original: T,
  modified: T,
): Record<string, { propertyTitle: string; before: any; after: any }> {
  const changes: Record<string, { propertyTitle: string; before: any; after: any }> = {}

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
          if (_.includes(['updated_at', 'updatedAt'], key)) return
          _.set(changes, newPath, {
            propertyTitle: _.startCase(key),
            before: String(_.get(originalObj, key)),
            after: String(value),
          })
        }
      })
    }
  }

  findChanges(original, modified)
  return changes
}
