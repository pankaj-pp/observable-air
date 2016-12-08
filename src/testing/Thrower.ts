/**
 * Created by tushar.mathur on 06/11/16.
 */

import {Observable} from '../types/core/Observable'
import {Subscription} from '../types/core/Subscription'
import {IScheduler} from '../types/IScheduler'
import {Observer} from '../types/core/Observer'

export const ERROR_MESSAGE = 'Test Exception'
export function throwError (message: string) {
  throw Error(message)
}
class ThrowerObserver implements Observer<void> {
  constructor (private sink: Observer<void>) {
  }

  next (val: void): void {
    throwError(ERROR_MESSAGE)
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.sink.complete()
  }
}

export class Thrower implements Observable<void> {
  constructor (private source: Observable<any>) {
  }

  subscribe (observer: Observer<void>, scheduler: IScheduler): Subscription {
    return this.source.subscribe(new ThrowerObserver(observer), scheduler)
  }
}

export function thrower (ob: Observable<any>) {
  return new Thrower(ob)
}
