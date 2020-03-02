import Route from '@ember/routing/route';

export default class TypesChroniclerRoute extends Route {
  model() {
    const users = this.modelFor('application')

    const coders = users.sortBy('cnt_chars').slice(-7).reverse()

    return coders
  }
}
