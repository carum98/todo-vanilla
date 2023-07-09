export function $fetch(url, method = 'GET', data = {}) {
    return fetch(`http://localhost:8080${url}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        method,
        body: method === 'GET' ? undefined : JSON.stringify(data)
    })
    .then(response => {
        if (response.status === 401) {
            window.location.href = 'login.html'
            sessionStorage.removeItem('token')

            return
        }

        if (response.status === 404) {
            throw new Error('Not found')
        }

        if (response.status === 500) {
            throw new Error('Internal server error')
        }

        if (response.status === 204) {
            return
        }

        return response.json()
    })
    .catch(error => {
        console.error('Error:', error)
    })
}