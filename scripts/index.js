
import { openDialog, openDialogConfirm } from './dialogs.js'
import { dragElement } from './drag.js'

import List from './lists.js'
import Todos from './todos.js'

if (!sessionStorage.getItem('token')) {
    window.location.href = 'login.html'
}

window.addEventListener('DOMContentLoaded', init, { once: true })

function init() {
    List.get()

    const buttons = document.querySelectorAll('[data-dialog]')

    for (const button of buttons) {
        const id = button.getAttribute('data-dialog')
        let callback = null

        if (id === 'form-list') {
            callback = List.create
        } else if (id === 'form-todo') {
            callback = Todos.create
        }

        if (callback) {
            button.addEventListener('click', () => openDialog(id, callback))
        }
    }

    const logout = document.getElementById('logout')

    if (logout) {
        logout.addEventListener('click', () => {
            openDialogConfirm('Are you sure you want to logout?', () => {
                sessionStorage.removeItem('token')
                window.location.href = 'login.html'
            })
        })
    }

    const todoList = document.getElementById('todos')

    dragElement(todoList, Todos.move)
}
