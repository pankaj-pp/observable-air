/**
 * Created by tushar.mathur on 09/10/16.
 */


import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {ISubscription} from '../types/core/ISubscription'
import {IReducer} from '../types/IReducer'
import {Curry3} from '../lib/Curry'

export class ScanObserver<T> implements IObserver<T> {

  constructor (private reducer: IReducer<T>,
               private value: T,
               private sink: IObserver<T>) {
  }

  next (val: T): void {
    this.value = this.reducer(this.value, val)
    this.sink.next(this.value)
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.sink.complete()
  }

}

export class ScanObservable<T> implements IObservable<T> {
  constructor (private reducer: IReducer<T>, private value: T, private source: IObservable<T>) {

  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new ScanObserver(this.reducer, this.value, observer), scheduler)
  }
}

export const scan = Curry3(function (reducer: IReducer<any>, value: any, source: IObservable<any>) {
  return new ScanObservable(reducer, value, source)
})
