import { helper } from '@ember/component/helper'
import { isArray } from '@ember/array'

export default helper(function isInclude(params/*, hash*/) {
  const [ arr, item  ] = params

  if (!isArray(arr)) {
    throw new Error('Первый аргумент должен быть массивом')
  }

  return arr.includes(item)
});
