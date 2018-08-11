import {
  ModelValidationError,
  ValidationError,
} from 'redirector-client'

const pathSeparator = '.'

export function fieldValidationErrors (
  modelErrors: ModelValidationError,
  ...pathParts: Array<string | number>): Array<ValidationError> {
  let path = pathParts.map(_ => _.toString()).join(pathSeparator)

  let fieldErrors = modelErrors.find(_ => _.name === path)
  return fieldErrors && fieldErrors.errors || []
}

export function embedValidationErrors (
  modelErrors: ModelValidationError,
  ...prefixParts: Array<string | number>): ModelValidationError {
  let prefix = prefixParts
    .map(_ => _.toString())
    .join(pathSeparator)
    + pathSeparator

  return modelErrors
    .filter(_ => _.name.startsWith(prefix))
    .map(({ name, ...rest }) => ({
      name: name.replace(prefix, ''),
      ...rest,
    }))
}
