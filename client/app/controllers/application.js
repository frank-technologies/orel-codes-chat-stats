import Controller from '@ember/controller'
import { sum, mapBy } from '@ember/object/computed'

export default class ApplicationController extends Controller {
  model = null

  @mapBy('model', 'cnt_messages') cntMessages
  @sum('cntMessages') sumCntMessages
}
