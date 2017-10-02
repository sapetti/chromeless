
const APP_URL = 'http://todomvc.com/examples/vanillajs/'

const PRESS_INTRO = '\r'
const COMPLETED = 'completed'
const ACTIVE = 'active'
const ALL = 'all'


async function screenshot(chromeless) {
  console.log(await chromeless.screenshot()) // prints local file path or S3 url
}

async function goToHome(chromeless) {
  await chromeless.goto(APP_URL)
}

async function getTodos(chromeless) {
  const todos = await chromeless.evaluate(() => {
      // this will be executed in headless chrome
      const todosList = [].reduce.call(
        document.querySelectorAll('li'),
        ((acc, li) => li.getAttribute('data-id') ? acc.concat({
                                                      id: li.getAttribute('data-id'),
                                                      name: li.children[0].children[1].innerHTML,
                                                      //Has no access to constants, scope !== this
                                                      status: !li.getAttribute('class') ? 'active' : 'completed'
                                                    })
                                                 : acc),
        [])
      return todosList
    })
  console.log('TODOs retrieved:: ', JSON.stringify(todos))
  return todos
}


async function getTodo(chromeless, field, value) {
  const todos = await getTodos(chromeless)
  const todo = [].filter.call(todos, t => t[field] === value )
    .pop()
  return todo
}


async function getTodoByName(chromeless, name) {
  const todo = await getTodo(chromeless, 'name', name)
  return todo
}


async function getTodoById(chromeless, id) {
  const todo = await getTodo(chromeless, 'id', id)
  return todo
}


async function createTodo(chromeless, name) {

  const todoName = (name ? name : "My new TODO")

  await chromeless.type(todoName + PRESS_INTRO, 'input[class="new-todo"]')
    .wait(150)
    
  const todo = await getTodoByName(chromeless, todoName)
  if(!todo) throw new Error('An error occurred while creating a new TODO')

  console.log(`TODO created with id:: '${todo.id}'`)
  return todo
}


async function removeTodo(chromeless, id) {
  if(!id) throw new Error('An id must be provided to remove a TODO')
  const destroySelector = `li[data-id="${id}"] div[class="view"] button[class="destroy"]`
  await chromeless.wait(destroySelector)
    .click(`li[data-id="${id}"]`) // click the row to show the button
    .click(destroySelector)
    .wait(150)
  const deleted = await getTodoById(chromeless, id) ? false : true
  return deleted
}


async function toggleTodo(chromeless, id) {
  if(!id) throw new Error('An id must be provided to toggle a TODO')
  const toggleSelector = `li[data-id="${id}"] div[class="view"] input[class="toggle"]`
  await chromeless.wait(toggleSelector)
    //.click(`li[data-id="${id}"]`) // click the row to show the button
    .click(toggleSelector)
    .wait(150)
  const currTodo = await getTodoById(chromeless, id)
  return currTodo.status
}


async function changeFilter(chromeless, view) {
  const link = view === COMPLETED ? '#/completed' :
               view === ACTIVE    ? '#/active'
                                  : '#/'

  await chromeless.wait(`a[href="${link}"]`)
    .click(`a[href="${link}"]`)
    .wait(150)
}

module.exports = {
  ALL,
  COMPLETED,
  ACTIVE,
  createTodo,
  getTodos,
  screenshot,
  goToHome,
  getTodoById,
  getTodoByName,
  removeTodo,
  toggleTodo,
  changeFilter
}
