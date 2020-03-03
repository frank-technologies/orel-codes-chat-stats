import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking'
import { action } from '@ember/object'

export default class ChroniclerComponent extends Component {
  @tracked showingMessage = null

  @action showMessage(message) {
    if (this.showingMessage === message) {
      this.showingMessage = null
    } else {
      this.showingMessage = message
    }
  }
}
