/**
 * Created by tushar.mathur on 27/09/16.
 */

'use strict'

const logObserver = () => ({
  next: x => console.log(x),
  error: x => console.log('ERROR', x),
  complete: x => console.log('COMPLETE', x)
})

const testOB = (func, onComplete) => {
  const results = []
  const subscription = func().subscribe({
    next: value => results.push({type: 'value', value}),
    error: value => results.push({type: 'error', value}),
    complete: () => {
      results.push({type: 'complete'})
      if (onComplete) onComplete()
    }
  })
  return {subscription, results}
}

module.exports = {testOB, logObserver}
