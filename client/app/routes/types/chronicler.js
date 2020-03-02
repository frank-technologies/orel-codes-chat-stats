import Route from '@ember/routing/route';

export default class TypesChroniclerRoute extends Route {
  async model() {
    const users = this.modelFor('application')

    const coders = users.sortBy('cnt_chars').slice(-7).reverse()

    await this.store.query('message', { user_ids: coders.mapBy('id'), top: 5 })

    return coders
  }
}
