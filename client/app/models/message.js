import Model, { belongsTo, attr } from '@ember-data/model'

export default class MessageModel extends Model {
  @belongsTo('user') user

  @attr('string') txt
  @attr('number') txt_len
  @attr('number') place
}
