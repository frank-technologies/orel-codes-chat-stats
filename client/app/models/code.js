import Model, { attr, belongsTo } from '@ember-data/model'

export default class CodeModel extends Model {
  @belongsTo('user') user
  @attr('string') code
  @attr('number') code_len
  @attr('number') place
}
