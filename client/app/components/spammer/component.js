import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { action } from '@ember/object'

export default class SpammerComponent extends Component {
  @tracked isShowDomains = false

  get hosts() {
    return this.args.spammer.hosts
  }

  @action toggleDomains() {
    this.isShowDomains = !this.isShowDomains
  }
}
