import Route from '@ember/routing/route';

export default class TypesCoderRoute extends Route {
  model() {
    const users = this.modelFor('application')

    const coders = users.sortBy('cnt_codes').slice(-7).reverse()

    return coders
  }
}
