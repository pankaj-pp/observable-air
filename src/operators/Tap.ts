/**
 * Created by tushar.mathur on 02/10/16.
 */

import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {ISubscription} from '../types/core/ISubscription'
import {IScheduler} from '../types/IScheduler'
import {Curry2} from '../lib/Curry'

interface ITapper<T> {
  (f: T): void
}

export class TapObserver<T> implements IObserver<T> {
  constructor (private tapper: ITapper<T>, private observer: IObserver<T>) {

  }

  next (val: T): void {
    this.tapper(val)
    this.observer.next(val)
  }

  error (err: Error): void {
    this.observer.error(err)
  }

  complete (): void {
    this.observer.complete()
  }

}

export class TapObservable<T> implements IObservable<T> {
  constructor (private tapper: ITapper<T>, private source: IObservable<T>) {

  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new TapObserver(this.tapper, observer), scheduler)
  }
}

export const tap = Curry2(function (tapper: ITapper<any>, source: IObservable<any>) {
  return new TapObservable(tapper, source)
})
