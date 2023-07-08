function authenticate(form, path) {
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)

    fetch(`http://localhost:8080${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        window.location.href = 'index.html'
        sessionStorage.setItem('token', data.token)
    })
    .catch(error => {
        console.error('Error:', error)
    })
}