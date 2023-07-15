export function dragElement(list, callback) {
    list.addEventListener('dragstart', (event) => {
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/plain', event.target.getAttribute('data-todo-id'))
    })

    list.addEventListener('dragover', (event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    })

    list.addEventListener('drop', async (event) => {
        event.preventDefault()

        const id = event.dataTransfer.getData('text/plain')
        const todo = document.querySelector(`[data-todo-id="${id}"]`)

        const target = event.target

        const index = [...list.children].indexOf(todo)
        const newIndex = [...list.children].indexOf(target)

        todo?.remove()

        if (index > newIndex) {
            target?.insertAdjacentElement('beforebegin', todo)
        } else {
            target?.insertAdjacentElement('afterend', todo)
        }

        event.dataTransfer.clearData()

        callback?.(id, newIndex)
    })
}