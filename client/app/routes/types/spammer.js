import Route from '@ember/routing/route';

export default class TypesSpammerRoute extends Route {
  async model() {
    const users = this.modelFor('application')

    const spammers = users.sortBy('cnt_links').slice(-7).reverse()

    await this.store.query('host', { user_ids: spammers.mapBy('id'), top: 5 })

    return spammers
  }
}
