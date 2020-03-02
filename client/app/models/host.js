import Model, { belongsTo, attr } from '@ember-data/model'

export default class HostModel extends Model {
  @belongsTo('user') user

  @attr('string') name
  @attr('number') place
  @attr('number') cnt_links
}
