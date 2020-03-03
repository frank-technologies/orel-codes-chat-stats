import Controller from '@ember/controller';
import { sum, mapBy } from '@ember/object/computed'

export default class IndexController extends Controller {
  @mapBy('model', 'cnt_links') cntLinks
  @sum('cntLinks') sumCntLinks

  @mapBy('model', 'cnt_chars') cntChars
  @sum('cntChars') sumCntChars

  @mapBy('model', 'cnt_codes') cntCodes
  @sum('cntCodes') sumCntCodes
}
