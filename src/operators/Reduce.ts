/**
 * Created by tushar.mathur on 27/09/16.
 */


import {Observable} from '../lib/Observable'
import {Observer} from '../lib/Observer'
import {Subscription} from '../lib/Subscription'
import {Curry} from '../lib/Curry'
import {Scheduler} from '../lib/Scheduler'


export type TReducer<T, R> = {(memory: R, current: T): R}
export type TSeed<R> = R
export type TSource<T> = Observable<T>
export type TResult<R> = Observable<R>

class ReduceObserver<T, R> implements Observer<T> {
  constructor (private reducer: TReducer<T, R>,
               private value: TSeed<R>,
               private sink: Observer<R>) {
  }

  next (val: T): void {
    this.value = this.reducer(this.value, val)
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.sink.next(this.value)
    this.sink.complete()
  }
}

class ReduceObservable <T, R> implements TResult<R> {
  constructor (private reducer: TReducer<T, R>,
               private seed: TSeed<R>,
               private source: TSource<T>) {
  }

  subscribe (obr: Observer<R>, scheduler: Scheduler): Subscription {
    return this.source.subscribe(new ReduceObserver<T, R>(this.reducer, this.seed, obr), scheduler)
  }
}

export const reduce = Curry(function <T, R> (t0: TReducer<T, R>, t1: R, t2: Observable<T>) {
  return new ReduceObservable(t0, t1, t2)
}) as Function &
  {<T, R>(reducer: TReducer<T, R>, seed: TSeed<R>, source: TSource<T>): TResult<R>} &
  {<T, R>(reducer: TReducer<T, R>): {(seed: TSeed<R>, source: TSource<T>): TResult<R>}} &
  {<T, R>(reducer: TReducer<T, R>, seed: TSeed<R>): {(source: TSource<T>): TResult<R>}} &
  {<T, R>(reducer: TReducer<T, R>): { (seed: TSeed<R>): { (source: TSource<T>): TResult<R> } } }
