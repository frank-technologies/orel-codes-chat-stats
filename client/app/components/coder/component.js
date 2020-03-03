import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking'
import { action } from '@ember/object'

export default class CoderComponent extends Component {
  @tracked isShowCode = false

  get codes() {
    return this.args.coder.codes
  }

  @action toggleCode() {
    this.isShowCode = !this.isShowCode
  }
}
