/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {ISubscription} from '../types/core/ISubscription'
import {IScheduler} from '../types/IScheduler'
import {Curry2} from '../lib/Curry'

class MapObserver<T> implements IObserver<T> {
  constructor (private mapper: (a: T) =>  T, private sink: IObserver<T>) {

  }

  next (val: T): void {
    this.sink.next(this.mapper(val))
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.sink.complete()
  }
}

export class MapObservable <T> implements IObservable<T> {
  constructor (private mapper: (a: T) =>  T, private observer: IObservable<T>) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.observer.subscribe(new MapObserver(this.mapper, observer), scheduler)
  }
}

export const map = Curry2(function (mapFunction: (a: any) => any, source: IObservable<any>) {
  return new MapObservable(mapFunction, source)
})
