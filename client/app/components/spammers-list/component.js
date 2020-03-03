import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { action } from '@ember/object'

export default class SpammersListComponent extends Component {
  @tracked expandedSpammers = []

  get isHaveExpanded() {
    return this.expandedSpammers.length > 0
  }

  @action toggleExpandedSpammer(spammer) {
    const expandedSpammers = this.expandedSpammers
    if (expandedSpammers.includes(spammer)) {
      expandedSpammers.removeObject(spammer)
    } else {
      expandedSpammers.addObject(spammer)
    }
  }

  @action toggleAllExpandedSpammer() {
    if (this.isHaveExpanded) {
      this.expandedSpammers = []
    } else {
      this.expandedSpammers = this.args.users.toArray()
    }
  }
}
