window.addEventListener('DOMContentLoaded', init, { once: true })

function init() {
    const form = document.querySelector('form')

    if (!(form instanceof HTMLFormElement)) {
        throw new Error('Error to find form')
    }

    // Disable submit button if any input is empty
    form.addEventListener('input', () => {
        const submit = form.querySelector('input[type="submit"]')
        const inputs = form.querySelectorAll('input:not([type="submit"])')

        if (!(submit instanceof HTMLInputElement)) {
            throw new Error('Error to find submit or inputs')
        }
        
        const empty = Array.from(inputs).filter(input => input instanceof HTMLInputElement ? input.value === '' : false)

        submit.disabled = empty.length > 0
    })

    form.addEventListener('submit', (event) => {
        event.preventDefault()

        auth(form, form.getAttribute('action'))
    }, { once: true })
}

function auth(form, path) {
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)

    fetch(`http://localhost:8080${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status === 404) {
            throw new Error('Not found')
        }

        if (response.status === 500) {
            throw new Error('Internal server error')
        }

        return response.json()
    })
    .then(data => {
        window.location.href = 'index.html'
        sessionStorage.setItem('token', data.token)
    })
    .catch(error => {
        console.error('Error:', error)
    })
}