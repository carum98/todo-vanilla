export function openDialog(dialogId, callback) {
    const dialog = document.getElementById(dialogId)

    if (dialog instanceof HTMLDialogElement) {
        dialog.showModal()

        const form = dialog.querySelector('form')
        const close = dialog.querySelector('[data-close]')

        if (!(form instanceof HTMLFormElement && close instanceof HTMLButtonElement)) {
            throw new Error('No form or close button found')
        }

        const closeDialog = () => dialog.close()

        async function submit(event) {
            event.preventDefault()

            const formData = new FormData(event.target)
            const data = Object.fromEntries(formData)

            await callback(data)

            closeDialog()
        }

        form.addEventListener('submit', submit)

        close.addEventListener('click', closeDialog)

        dialog.addEventListener('close', () => {
            form.removeEventListener('submit', submit)
            close.removeEventListener('click', closeDialog)
            
            form.reset()
        })

        return dialog
    }
}

export function openDialogConfirm(message, callback) {
    const dialog = document.getElementById('confirm')

    if (dialog instanceof HTMLDialogElement) {
        dialog.showModal()

        const p = dialog.querySelector('[data-message]')
        const close = dialog.querySelector('[data-close]')
        const confirm = dialog.querySelector('[data-confirm]')

        if (!(close instanceof HTMLButtonElement && confirm instanceof HTMLButtonElement && p instanceof HTMLParagraphElement)) {
            throw new Error('Error to build dialog')
        }

        p.innerText = message

        const closeDialog = () => dialog.close()

        async function confirmCallback(event) {
            event.preventDefault()

            await callback()

            closeDialog()
        }


        close.addEventListener('click', closeDialog)
        confirm.addEventListener('click', confirmCallback)

        dialog.addEventListener('close', () => {
            close.removeEventListener('click', closeDialog)
            confirm.removeEventListener('click', confirmCallback)
        })
    }
}
