const { palindrome } = require('../utils/for_testing')

test.skip('palindrome of joruizdev', () => {
  const result = palindrome('joruizdev')
  expect(result).toBe('vedziuroj')
})

test.skip('palindrome of empty string', () => {
  const result = palindrome('')
  expect(result).toBe('')
})

test.skip('palindrome of undefined', () => {
  const result = palindrome()
  expect(result).toBeUndefined()
})
