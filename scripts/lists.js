import Todos from './todos.js'
import { $fetch } from './helpers.js'
import { openDialog, openDialogConfirm } from './dialogs.js'

async function get() {
    const ul = document.getElementById('lists')

    if (ul === null) {
        throw new Error('No element with id "list"')
    }

    ul.innerHTML = ''

    const { data } = await $fetch('/lists')
    
    const items = []

    for (const item of data) {
        const li = document.createElement('li')

        const button = document.createElement('button')
        const removeButton = document.createElement('button')
        const editButton = document.createElement('button')

        const span = document.createElement('span')

        span.style.backgroundColor = item.color

        li.setAttribute('data-list-id', item.id)

        button.append(span, item.name)
        removeButton.append('Remove')
        editButton.append('Edit')

        li.append(button, removeButton, editButton)

        items.push(li)

        button.addEventListener('click', () => {
            Todos.get(item.id)

            const active = document.querySelector('[data-active]')
            active?.attributes.removeNamedItem('data-active')

            button.parentElement?.setAttribute('data-active', '')
        })

        removeButton.addEventListener('click', () => {
            remove(item.id)
        })

        editButton.addEventListener('click', () => {
            update(item)
        })
    }

    ul.append(...items)
}

async function create(params) {
    await $fetch('/lists', 'POST', params)

    get()
}

async function remove(id) {
    openDialogConfirm('Are you sure you want to delete this list?', async () => {
        await $fetch(`/lists/${id}`, 'DELETE')
        get()
    })
}

function update(item) {
    const dialog = openDialog('form-list', async (params) => {
        await $fetch(`/lists/${item.id}`, 'PUT', params)
        get()
    })

    const form = dialog?.querySelector('form')

    const name = form?.querySelector('[name="name"]')
    const color = form?.querySelector('[name="color"]')

    if (name instanceof HTMLInputElement) {
        name.value = item.name
    }

    if (color instanceof HTMLInputElement) {
        color.value = item.color
    }
}

export default {
    get,
    create,
    remove,
    update
}