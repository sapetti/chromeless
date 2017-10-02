const test = require('tape')
const { Chromeless } = require('chromeless')
const { ALL, COMPLETED, ACTIVE, createTodo, getTodos, goToHome, getTodoById, getTodoByName, removeTodo, toggleTodo, changeFilter } = require('../utilities/todos')
const { getMilis } = require('../utilities/common')

test('Create a TODO', async assert => {
  //Start session
  const chromeless = new Chromeless()
  try {
    const todoName = `Test TODO ${getMilis()}`
    //Go to home page
    await goToHome(chromeless)
    //Get TODOs list length
    const prevTodos = await getTodos(chromeless)
    //Create the new TODO
    const newTodo = await createTodo(chromeless, todoName, false)
    //Get TODOs list length
    const currTodos = await getTodos(chromeless)
    
    //Assertions
    assert.equal(newTodo.name, todoName, `The TODO has the expected name ${todoName}`)
    assert.equal(currTodos.length, prevTodos.length + 1, 'The number of TODOs has been increased in 1')
    assert.ok(newTodo.id, 'The TODO has an id')
    assert.equal(newTodo.status, 'active', 'The TODO is not completed yet')
    const isListed = currTodos.reduce((acc, t) => t.name === todoName ? true : acc, false)
    assert.true(isListed, 'The TODO is listed')

  } catch(error) {
    console.error(error)
    assert.fail('Unexpected error ocurred, see log for further details')

  } finally {
    //Teardown... end session and test suite
    console.log('teardown!!')
    await chromeless.end()
    assert.end()
  }

})

test('Remove a TODO', async assert => {

  const chromeless = new Chromeless()
  try {
    const todoName = `To Delete ${getMilis()}`
    //Go to home page
    await goToHome(chromeless)
    //Create the TODO to be removed
    const newTodo = await createTodo(chromeless, todoName)
    assert.ok(newTodo, 'TODO was created')
    assert.ok(newTodo.id, 'TODO has id')
    //Remove the TODO
    const wasDeleted = await removeTodo(chromeless, newTodo.id)
    //Try to find the TODO
    const exist = await getTodoByName(chromeless, newTodo.name) ? true : false

    //Assertions
    assert.true(wasDeleted, 'The TODO was removed')
    assert.false(exist, 'The TODO does not exist anymore')

  } catch(error) {
    console.error(error)
    assert.fail('Unexpected error ocurred, see log for further details')

  } finally {
    //Teardown... end session and test suite
    console.log('teardown!!')
    await chromeless.end()
    assert.end()
  }
})

test('Toggle TODO status', async assert => {

  const chromeless = new Chromeless()
  try {
    const todoName = `Toggle TODO ${getMilis()}`
    //Go to home page
    await goToHome(chromeless)
    //Create the TODO to be toggled
    const newTodo = await createTodo(chromeless, todoName)
    assert.ok(newTodo, 'TODO was created')
    assert.ok(newTodo.status, 'TODO has id')
    //Toggle the TODO
    const newStatus = await toggleTodo(chromeless, newTodo.id)
    //Try to find the TODO
    const updatedTodo = await getTodoByName(chromeless, newTodo.name)

    //Assertions
    assert.notEqual(newTodo.status,  updatedTodo.status, 'The TODO was toggled')
    assert.notEqual(newTodo.status,  newStatus, 'Old status does not match new one')
    assert.equal(newStatus, updatedTodo.status, 'Returned status matches TODO status')
    assert.equal(newStatus, COMPLETED, 'Status is completed')
    //Toggle the TODO again
    const revertedStatus = await toggleTodo(chromeless, newTodo.id)
    //Try to find the TODO
    const revertedTodo = await getTodoByName(chromeless, newTodo.name)
    //Assertions
    assert.equal(newTodo.status,  revertedTodo.status, 'The toggled was reverted')
    assert.equal(newTodo.status,  revertedTodo.status, 'Old status matches reverted one')
    assert.notEqual(updatedTodo.status,  revertedTodo.status, 'Changes are reverted')
    assert.equal(revertedStatus, ACTIVE, 'Status is active again')
  } catch(error) {
    console.error(error)
    assert.fail('Unexpected error ocurred, see log for further details')

  } finally {
    //Teardown... end session and test suite
    await chromeless.end()
    assert.end()
  }
})

test( 'Filter TODO view', async assert => {

  const chromeless = new Chromeless()
  try {
    const activeTodoName = `Active TODO ${getMilis()}`
    const completedTodoName = `Completed TODO ${getMilis()}`
    //Go to home page
    await goToHome(chromeless)
    //Create the TODOs to be filtered
    let activeTodo = await createTodo(chromeless, activeTodoName)
    let completedTodo = await createTodo(chromeless, completedTodoName)
    await toggleTodo(chromeless, completedTodo.id)
    completedTodo = await getTodoByName(chromeless, completedTodoName)
    //Check TODO status
    assert.equal(activeTodo.status, 'active', 'Status is active')
    assert.equal(completedTodo.status, 'completed', 'Status is active')
    //Change the filter to Completed
    await changeFilter(chromeless, COMPLETED)
    //Check TODOs visibility
    activeTodo = await getTodoByName(chromeless, activeTodoName)
    completedTodo = await getTodoByName(chromeless, completedTodoName)
    assert.notOk(activeTodo, 'The active TODO is not visible in the completed view')
    assert.ok(completedTodo.id, 'The completed TODO is visible in the completed view')
    //Change the filter to Active
    await changeFilter(chromeless, ACTIVE)
    //Check TODOs visibility
    activeTodo = await getTodoByName(chromeless, activeTodoName)
    completedTodo = await getTodoByName(chromeless, completedTodoName)
    assert.ok(activeTodo.id, 'The active TODO is visible in the active view')
    assert.notOk(completedTodo, 'The completed TODO is not visible in the active view')
    //Change the filter to All
    await changeFilter(chromeless, ALL)
    //Check TODOs visibility
    activeTodo = await getTodoByName(chromeless, activeTodoName)
    completedTodo = await getTodoByName(chromeless, completedTodoName)
    assert.ok(activeTodo.id, 'The active TODO is visible in the all view')
    assert.ok(completedTodo.id, 'The completed TODO is visible in the all view')
  
  } catch(error) {
    console.error(error)
    assert.fail('Unexpected error ocurred, see log for further details')

  } finally {
    //Teardown... end session and test suite
    console.log('teardown!!')
    await chromeless.end()
    assert.end()
  }

})