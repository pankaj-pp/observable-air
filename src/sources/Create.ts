/**
 * Created by tushar.mathur on 16/10/16.
 */
import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {IScheduler} from '../lib/Scheduler'
import {ISubscription, BaseSubscription} from '../lib/Subscription'
import {ISubscriberFunction} from '../lib/SubscriberFunction'


class CreateObservable<T> implements IObservable<T> {
  constructor (private f: ISubscriberFunction<T>) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return BaseSubscription.from(this.f(observer, scheduler))
  }
}

export const create = <T> (f: ISubscriberFunction<T>): IObservable<T> => new CreateObservable(f)
