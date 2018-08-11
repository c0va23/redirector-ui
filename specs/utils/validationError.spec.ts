import { ModelValidationError } from 'redirector-client'

import {
  embedValidationErrors,
  fieldValidationErrors,
} from '../../src/utils/validationErrors'

describe('fieldValidationErrors', () => {
  let modelErrors: ModelValidationError
  const fieldErrors = (...fieldPath: Array<string | number>) =>
    fieldValidationErrors(modelErrors, ...fieldPath)

  describe('when modelErrors empty', () => {
    beforeEach(() => modelErrors = [])

    it('return empty model errors', () => {
      expect(fieldErrors('field')).toEqual([])
    })
  })

  describe('when modelError not have errors for field', () => {
    beforeEach(() => {
      modelErrors = [{ name: 'other', errors: [] }]
    })

    it('return empty model errors', () => {
      expect(fieldErrors('field')).toEqual([])
    })
  })

  describe('when modelError have field errors', () => {
    let fieldName = 'field'
    beforeEach(() => {
      modelErrors = [
        {
          name: fieldName,
          errors: [
            { translationKey: 'error1' },
            { translationKey: 'error2' },
          ],
        },
        {
          name: 'other',
          errors: [],
        },
      ]
    })

    it('return field errors', () => {
      expect(fieldErrors(fieldName)).toEqual(modelErrors[0].errors)
    })
  })

  describe('when modelError have field errors on index', () => {
    const fieldName = 'field'
    const fieldIndex = 1

    beforeEach(() => {
      modelErrors = [
        {
          name: [fieldName, fieldIndex].join('.'),
          errors: [
            { translationKey: 'error1' },
            { translationKey: 'error2' },
          ],
        },
        { name: 'other', errors: [] },
      ]
    })

    it('return field errors', () => {
      expect(fieldErrors(fieldName, fieldIndex)).toEqual(modelErrors[0].errors)
    })

    it('return empty errors on wrong index', () => {
      expect(fieldErrors(fieldName, fieldIndex + 1)).toEqual([])
    })
  })
})

describe('embedValidationErrors', () => {
  let modelError: ModelValidationError
  const embedErrors = (...embedPath: Array<string | number>) =>
    embedValidationErrors(modelError, ...embedPath)

  describe('when model error is empty', () => {
    beforeEach(() => modelError = [])

    it('return empty model errors', () => {
      expect(embedErrors('embed')).toEqual([])
    })
  })

  describe('when model have errors for embed', () => {
    const embedName = 'embed'

    beforeEach(() => {
      modelError = [
        {
          name: `${embedName}.field`,
          errors: [
            { translationKey: 'error1' },
          ],
        },
        { name: 'other', errors: [] },
      ]
    })

    it('return embed model errors', () => {
      expect(embedErrors(embedName)).toEqual([{
        name: 'field',
        errors: modelError[0].errors,
      }])
    })
  })
})
