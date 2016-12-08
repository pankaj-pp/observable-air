/**
 * Created by tushar.mathur on 10/10/16.
 */


import {Observable} from '../types/core/IObservable'
import {Observer} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {Subscription} from '../types/core/ISubscription'
import {CompositeSubscription} from '../lib/CompositeSubscription'


export class JoinValueObserver<T> implements Observer<T> {
  constructor (private sink: Observer<T>, private root: JoinObserver<T>) {
  }

  next (val: T): void {
    this.sink.next(val)
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.root.subscriptionCompleted()
  }

}

export class JoinObserver<T> implements Observer<Observable<T>> {
  private count: number
  private sourceCompleted: boolean

  constructor (private sink: Observer<T>, private scheduler: IScheduler, private subscriptions: CompositeSubscription) {
    this.sourceCompleted = false
    this.count = 0
  }

  subscriptionCompleted () {
    this.count--
    this.completeSink()
  }

  completeSink () {
    if (this.sourceCompleted && this.count === 0) {
      this.sink.complete()
    }
  }


  next (val: Observable<T>): void {
    const joinValueObserver = new JoinValueObserver(this.sink, this)
    this.count++
    this.subscriptions.add(
      val.subscribe(joinValueObserver, this.scheduler)
    )
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.sourceCompleted = true
    this.completeSink()
  }
}


export class JoinObservable<T> implements Observable<T> {
  constructor (private source: Observable<Observable<T>>) {
  }

  subscribe (observer: Observer<T>, scheduler: IScheduler): Subscription {
    const subscription = new CompositeSubscription()
    subscription.add(
      this.source.subscribe(new JoinObserver(observer, scheduler, subscription), scheduler)
    )
    return subscription
  }
}

export function join <T> (source: Observable<Observable<T>>) {
  return new JoinObservable(source)
}
