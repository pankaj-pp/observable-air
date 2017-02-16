/**
 * Created by tushar.mathur on 28/09/16.
 */
import {Observable} from '../lib/Observable'
import {Subscription} from '../lib/Subscription'
import {Observer} from '../lib/Observer'
import {Scheduler} from '../lib/Scheduler'
import {tryCatch} from '../lib/Utils'

class FromArraySubscription <T> implements Subscription {
  private subscription: Subscription
  closed = false

  constructor (private array: Array<T>, private sink: Observer<T>, scheduler: Scheduler) {
    this.subscription = scheduler.asap(this.executeSafely.bind(this))
  }


  private executeSafely () {
    const r = tryCatch(this.execute).call(this)
    if (r.isError()) this.sink.error(r.getError())
  }

  execute () {
    const l = this.array.length
    const sink = this.sink
    for (var i = 0; i < l && !this.closed; ++i) {
      sink.next(this.array[i])
    }
    sink.complete()
  }

  unsubscribe (): void {
    this.subscription.unsubscribe()
    this.closed = true
  }
}

class FromObservable<T> implements Observable<T> {
  constructor (private array: Array<T>) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    return new FromArraySubscription<T>(this.array, observer, scheduler)
  }
}

export function fromArray<T> (list: Array<T>): Observable<T> {
  return new FromObservable(list)
}

export function of<T> (...list: Array<T>) {
  return fromArray(list)
}
