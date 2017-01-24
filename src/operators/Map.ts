/**
 * Created by tushar.mathur on 27/09/16.
 */
import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {Subscription} from '../types/core/Subscription'
import {Scheduler} from '../types/Scheduler'


export type TMapper<T, R> = (value: T) => R
export type TSource<T> = Observable<T>
export type TResult<R> = Observable<R>


class MapObserver<T, R> implements Observer<T> {
  constructor (private mapper: TMapper<T, R>, private sink: Observer<R>) {

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

export class Mapper <T, R> implements TResult<R> {
  constructor (private mapper: TMapper<T, R>, private source: TSource<T>) {
  }

  subscribe (observer: Observer<R>, scheduler: Scheduler): Subscription {
    return this.source.subscribe(new MapObserver(this.mapper, observer), scheduler)
  }
}
