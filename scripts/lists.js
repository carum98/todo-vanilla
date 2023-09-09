import Todos from './todos.js'
import { $fetch } from './helpers.js'
import { openDialog, openDialogConfirm } from './dialogs.js'
import { ColorPicker } from './webcomponents/color-picker.js'

async function get() {
    const ul = document.getElementById('lists')

    if (ul === null) {
        throw new Error('No element with id "list"')
    }

    ul.innerHTML = ''

    const { data } = await $fetch('/lists')
    
    const items = []

    for (const item of data) {
        items.push(buildTile(item))
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

    if (color instanceof ColorPicker) {
        color.setAttribute('value', item.color)
    }
}

export default {
    get,
    create,
    remove,
    update
}

function buildTile(item) {
    const button = document.createElement('button')
    button.classList.add('list-item')
    button.setAttribute('data-list-id', item.id)

    const count = document.createElement('span')
    count.classList.add('count')
    count.innerText = item.count.pending

    const removeButton = document.createElement('button')
    const editButton = document.createElement('button')

    const color = document.createElement('span')
    color.classList.add('color')
    color.style.backgroundColor = item.color

    button.setAttribute('data-list-id', item.id)
    button.append(color, item.name, count)

    const div = document.createElement('div')
    
    div.classList.add('actions')

    removeButton.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8s8-3.59 8-8s-3.59-8-8-8zm5 9H7v-2h10v2z" opacity=".3"/><path fill="currentColor" d="M7 11h10v2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8z"/></svg>`
    editButton.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24"><path fill="currentColor" d="m19.3 8.925l-4.25-4.2l1.4-1.4q.575-.575 1.413-.575t1.412.575l1.4 1.4q.575.575.6 1.388t-.55 1.387L19.3 8.925ZM4 21q-.425 0-.713-.288T3 20v-2.825q0-.2.075-.388t.225-.337l10.3-10.3l4.25 4.25l-10.3 10.3q-.15.15-.337.225T6.825 21H4Z"/></svg>`

    div.append(removeButton, editButton)

    button.append(div)

    button.addEventListener('click', () => {
        Todos.get(item.id)

        const active = document.querySelector('[data-active]')
        active?.attributes.removeNamedItem('data-active')

        button.setAttribute('data-active', '')
    })

    removeButton.addEventListener('click', (event) => {
        event.stopImmediatePropagation()

        remove(item.id)
    })

    editButton.addEventListener('click', (event) => {
        event.stopImmediatePropagation()
        update(item)
    })

    return button
}