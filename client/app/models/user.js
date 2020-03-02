import Model, { attr } from '@ember-data/model'

export default class UserModel extends Model {
  @attr('string') name
  @attr('number') cnt_links
  @attr('number') cnt_codes
  @attr('number') cnt_chars
}
