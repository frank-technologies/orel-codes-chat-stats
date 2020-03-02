import Route from '@ember/routing/route';

export default class TypesSpammerRoute extends Route {
  model() {
    const users = this.modelFor('application')

    const spammers = users.sortBy('cnt_links').slice(-7).reverse()

    return spammers
  }
}
