import { helper } from '@ember/component/helper';

export default helper(function formatInt(params/*, hash*/) {
  const int = Number(params[0])
  const intStr = String(params[0])
  if (isNaN(int)) {
    throw new Error(`Ошибка, передано не число, а ${intStr}`)
  }

  let res = '';
  for (let i = 0; i < intStr.length; i++) {
    if (i > 0 && i / 3 >= 1 && i % 3 === 0) {
      res = ' ' + res
    }
    res = intStr[intStr.length - i - 1] + res
  }

  return res
});
