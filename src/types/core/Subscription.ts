/**
 * Created by tushar.mathur on 27/09/16.
 */

export interface Subscription {
  unsubscribe(): void
  readonly closed: boolean
}
