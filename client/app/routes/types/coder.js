import Route from '@ember/routing/route';

export default class TypesCoderRoute extends Route {
  async model() {
    const users = this.modelFor('application')

    const coders = users.sortBy('cnt_codes').slice(-7).reverse()

    await this.store.query('code', { user_ids: coders.mapBy('id'), top: 7 })

    return coders
  }
}
