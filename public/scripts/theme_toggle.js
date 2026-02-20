const body = document.querySelector("body");
const button = document.getElementById("theme-button")

button.addEventListener('click', (event) => {
    body.classList.toggle("light")
})