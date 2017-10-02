const test = require('tape')

test('Check hello equal to world', assert => {
    const hello = 'world'
    assert.equal(hello, 'world', `The variable hello must be equal to "world" but is ${hello}`)
    assert.end()
})

test('Check variable value', assert => {
    const aVariable = 15
    assert.notEqual(aVariable, null, 'Variable must not be null')
    assert.equal(typeof aVariable, 'number', 'Variable must be a Number')
    assert.ok(aVariable > 10, `Variable must be greater than 10 but is ${aVariable}`)
    assert.notOk(aVariable > 20, `Variable must be lower than 20 but is ${aVariable}`)
    assert.end()
})
