import { openDialog, openDialogConfirm } from './dialogs.js'
import { $fetch } from './helpers.js'

async function get(listId) {
    const ul = document.getElementById('todos')

    if (ul === null) {
        throw new Error('No element with id "todos"')
    }

    ul.innerHTML = ''

    const { data } = await $fetch(`/lists/${listId}/todos`)

    const items = []

    for (const item of data) {
        const li = document.createElement('li')

        const button = document.createElement('button')
        const removeButton = document.createElement('button')
        const editButton = document.createElement('button')

        button.setAttribute('data-todo-id', item.id)
        removeButton.append('Remove')
        editButton.append('Edit')

        if (item.is_complete) {
            button.style.textDecoration = 'line-through'
        }

        button.append(item.title)
        li.append(button, removeButton, editButton)

        items.push(li)

        button.addEventListener('click', () => {
            toggle(item)
        })

        removeButton.addEventListener('click', () => {
            remove(item.id)
        })

        editButton.addEventListener('click', () => {
            update(listId, item)
        })
    }

    ul.append(...items)
}

async function create(params) {
    const active = document.querySelector('[data-active]')

    const listId = active?.getAttribute('data-list-id')
    
    await $fetch(`/lists/${listId}/todos`, 'POST', params)

    get(listId)
}

async function remove(id) {
    openDialogConfirm('Are you sure you want to delete this ToDo?', async () => {
        await $fetch(`/todos/${id}`, 'DELETE')

        const button = document.querySelector(`[data-todo-id="${id}"]`)
        button?.parentElement?.remove()
    })
}

function update(listId, todo) {
    const dialog = openDialog('form-todo', async (params) => {
        await $fetch(`/todos/${todo.id}`, 'PUT', params)
        get(listId)
    })

    const form = dialog?.querySelector('form')

    const title = form?.querySelector('[name="title"]')
    const description = form?.querySelector('[name="description"]')

    if (title instanceof HTMLInputElement) {
        title.value = todo.title
    }

    if (description instanceof HTMLInputElement) {
        description.value = todo.description
    }
}

async function toggle(todo) {
    const data = await $fetch(`/todos/${todo.id}/complete`, 'POST')

    const button = document.querySelector(`[data-todo-id="${todo.id}"]`)

    console.log(button)

    if (button && button instanceof HTMLButtonElement && data.is_complete === true) {
        button.style.textDecoration = 'line-through'
    }
}

export default {
    get,
    create,
    toggle,
    remove
}