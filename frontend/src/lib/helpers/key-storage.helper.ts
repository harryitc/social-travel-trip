import _ from 'lodash'

export type TDuplicateEntry = {
  key: string
  values: string[]
}

function flattenObject(obj: object, path: string = ''): Record<string, string> {
  const formatted = {}
  _.forOwn(obj, (value, key) => {
    const newPath = path ? `${path}.${key}` : key
    if (_.isObject(value)) {
      _.merge(formatted, flattenObject(value, newPath))
    } else {
      Object.assign(formatted, { [newPath]: value })
    }
  })

  return formatted
}

function findDuplicateValues(data: Record<string, string>): TDuplicateEntry[] {
  const inverted = _.invertBy(data)
  const duplicates: TDuplicateEntry[] = []

  _.forEach(inverted, (values, key) => {
    if (values.length > 1) {
      duplicates.push({ key, values })
    }
  })
  return duplicates
}

function findDuplicateObjects(configKeys: object): TDuplicateEntry[] {
  const flattenedObject = flattenObject(configKeys)
  return findDuplicateValues(flattenedObject)
}

const KeyStorageHelper = {
  findDuplicateObjects
}

export default KeyStorageHelper
