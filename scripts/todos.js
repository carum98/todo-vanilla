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
        items.push(buildTile(item, listId))
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
    const data = await $fetch(`/todos/${todo.id}/toggle`, 'POST')

    const element = document.querySelector(`[data-todo-id="${todo.id}"]`)

    if (element instanceof HTMLElement) {
        if (data.is_complete) {
            element.setAttribute('data-complete', '')
        } else {
            element.removeAttribute('data-complete')
        }
    }
}

export default {
    get,
    create,
    toggle,
    remove
}

function buildTile(item, listId) {
    const li = document.createElement('li')
    li.classList.add('todo-item')

    const removeButton = document.createElement('button')
    const editButton = document.createElement('button')

    li.setAttribute('data-todo-id', item.id)

    const div = document.createElement('div')
    
    div.classList.add('actions')

    removeButton.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8s8-3.59 8-8s-3.59-8-8-8zm5 9H7v-2h10v2z" opacity=".3"/><path fill="currentColor" d="M7 11h10v2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8z"/></svg>`
    editButton.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24"><path fill="currentColor" d="m19.3 8.925l-4.25-4.2l1.4-1.4q.575-.575 1.413-.575t1.412.575l1.4 1.4q.575.575.6 1.388t-.55 1.387L19.3 8.925ZM4 21q-.425 0-.713-.288T3 20v-2.825q0-.2.075-.388t.225-.337l10.3-10.3l4.25 4.25l-10.3 10.3q-.15.15-.337.225T6.825 21H4Z"/></svg>`

    div.append(removeButton, editButton)

    const i = document.createElement('i')

    if (item.is_complete) {
        li.setAttribute('data-complete', '')
        i.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8z"/><circle cx="12" cy="12" r="5" fill="currentColor"/></svg>`
    } else {
        i.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8z"/></svg>`
    }

    li.append(i, item.title, div)

    li.addEventListener('click', () => {
        toggle(item)
    })

    removeButton.addEventListener('click', (event) => {
        event.stopPropagation()

        remove(item.id)
    })

    editButton.addEventListener('click', (event) => {
        event.stopPropagation()

        update(listId, item)
    })

    return li
}