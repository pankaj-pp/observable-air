/**
 * Created by tushar.mathur on 04/10/16.
 */

import {ITask} from '../types/ITask'
import {IScheduledTask} from '../types/IScheduledTask'

export class ScheduleImmediately implements IScheduledTask {
  closed: boolean
  private id: number

  constructor (private task: ITask) {
    this.closed = false
  }

  run () {
    this.id = setImmediate(() => {
      this.task()
      this.closed = true
    })
    return this
  }

  unsubscribe (): void {
    if (this.closed) return
    clearImmediate(this.id)
    this.closed = true
  }
}
