window.addEventListener('load', () => {
    if (!sessionStorage.getItem('token')) {
        window.location.href = 'login.html'
    }
})
