/**
 * Created by tushar.mathur on 17/10/16.
 */

import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {ISubscription} from '../types/core/ISubscription'
import {CompositeSubscription} from '../lib/CompositeSubscription'

export class MergeObserver implements IObserver<any> {
  private count = 0

  constructor (private total: number, private sink: IObserver<any>) {
  }

  next (val: any): void {
    this.sink.next(val)
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.count++
    if (this.count === this.total) {
      this.sink.complete()
    }
  }
}

export class MergeObservable implements IObservable<any> {
  constructor (private sources: Array<IObservable<any>>) {
  }

  subscribe (observer: IObserver<any>, scheduler: IScheduler): ISubscription {
    const cSub = new CompositeSubscription()
    const mergeObserver = new MergeObserver(this.sources.length, observer)
    for (var i = 0; i < this.sources.length; ++i) {
      cSub.add(this.sources[i].subscribe(mergeObserver, scheduler))
    }
    return cSub
  }
}

export function merge (sources: Array<IObservable<any>>) {
  return new MergeObservable(sources)
}
