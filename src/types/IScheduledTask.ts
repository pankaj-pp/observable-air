/**
 * Created by tushar.mathur on 04/10/16.
 */

import {ISubscription} from './core/ISubscription'

export interface IScheduledTask extends ISubscription {
  run (): IScheduledTask
}
