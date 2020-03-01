import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | types/chronicler', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:types/chronicler');
    assert.ok(route);
  });
});
