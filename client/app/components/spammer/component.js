import Component from '@glimmer/component'

export default class SpammerComponent extends Component {
  get hosts() {
    return this.args.spammer.hosts
  }
}
