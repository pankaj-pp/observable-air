/**
 * Created by tushar.mathur on 27/09/16.
 */

'use strict'

import test from 'ava'
import {TestScheduler} from '../src/testing/TestScheduler'
import {ReactiveEvents} from '../src/testing/ReactiveEvents'
import {air} from '../src/Main'

const {next, complete} = ReactiveEvents
test('takeN(0, 3)', t => {
  const sh = TestScheduler.of()
  const ob$ = sh.Cold([
    next(0, 1),
    next(10, 2),
    next(20, 3),
    next(30, 4),
    next(40, 5),
    complete(50)
  ])
  const {results} = sh.start(() => air(ob$).slice(0, 3))
  t.deepEqual(results, [
    next(200, 1),
    next(210, 2),
    next(220, 3),
    complete(220)
  ])
})

test('takeN(0, Infinity)', t => {
  const sh = TestScheduler.of()
  const ob$ = sh.Cold([
    next(0, 1),
    next(10, 2),
    next(20, 3),
    next(30, 4),
    next(40, 5),
    complete(50)
  ])
  const {results} = sh.start(() => air(ob$).slice(0, Infinity))
  t.deepEqual(results, [
    next(200, 1),
    next(210, 2),
    next(220, 3),
    next(230, 4),
    next(240, 5),
    complete(250)
  ])
})

test('takeN(1, 3)', t => {
  const sh = TestScheduler.of()
  const ob$ = sh.Cold([
    next(0, 1),
    next(10, 2),
    next(20, 3),
    next(30, 4),
    next(40, 5),
    complete(50)
  ])
  const {results} = sh.start(() => air(ob$).slice(1, 3))
  t.deepEqual(results, [
    next(210, 2),
    next(220, 3),
    next(230, 4),
    complete(230)
  ])
})

test('takeN(1, 3):unsubscribe', t => {
  const sh = TestScheduler.of()
  const ob$ = sh.Hot([
    next(201, 1),
    next(210, 2),
    next(220, 3),
    next(230, 4),
    next(240, 5),
    complete(250)
  ])
  const {results} = sh.start(() => air(ob$).slice(1, 3))
  t.deepEqual(results, [
    next(210, 2),
    next(220, 3),
    next(230, 4),
    complete(230)
  ])
  t.deepEqual(ob$.subscriptions.map(t => t.time), [200, 230])
})
