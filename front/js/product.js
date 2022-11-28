const link = window.location.href;
const url = new URL(link);
const id = url.searchParams.get("id");
const colors = document.getElementById('colors')


fetch("http://localhost:3000/api/products/" + id)
    .then(function (data) {
        return data.json()
    })
    .then(function (kanap) {
        createDom(kanap)
    })

/**
 * Crée le html du canapé passé en paramètre
 * @param {object} kanap
 * @returns {void}
 */
function createDom(kanap) {
    const image = document.createElement('img')
    image.src = kanap.imageUrl
    image.alt = kanap.altTxt
    document.querySelector('.item__img').appendChild(image)

    const title = document.getElementById('title')
    title.textContent = kanap.name

    const price = document.getElementById('price')
    price.textContent = kanap.price

    const description = document.querySelector('.item__content__description__title')
    description.textContent = kanap.description

    for (let i = 0; i < kanap.colors.length; i++) {
        let option = document.createElement('option')
        let color = kanap.colors[i]
        option.value = color
        option.textContent = color
        colors.appendChild(option)
    }

}

/**
 * Crée dans le localStorage une sauvegarde de la selection de l'utilisateur s'il n'y a pas d'erreur
 * @param {void}
 * @returns {void}
 */
function send() {
    let cart = localStorage.getItem('products')
    let product = {}
    product[id] = {}
    product[id][colors.value] = document.getElementById('quantity').value
    document.getElementById('succes').textContent = ""
    
    if(!verifyError()){
        return
    }

    document.getElementById('succes').textContent = "Article ajouté au panier"

    if (cart === null) {
        cart = product
    } else {
        cart = JSON.parse(cart)
        if (id in cart) {
            if (colors.value in cart[id]) {
                cart[id][colors.value] = Number(cart[id][colors.value]) + Number(document.getElementById('quantity').value)
            } else {
                cart[id][colors.value] = document.getElementById('quantity').value
            }
        } else {
            cart[id] = {}
            cart[id][colors.value] = document.getElementById('quantity').value
        }
    }

    localStorage.setItem('products', JSON.stringify(cart))
}
document.querySelector("#addToCart").addEventListener("click", send);
/**
 * Vérifie les champs des formulaires et retourne le nombre d'erreur
 * @returns {boolean} error
 */
function verifyError(){
    let error = 0
    let alertColor = document.getElementById('errorSelect')
    if (colors.value === "") {
        alertColor.textContent = "Veuillez choisir un coloris s'il vous plaît"
        alertColor.style.color = 'red'
        error++
    } else {
        alertColor.textContent = ""
    }
    let alertQuantity = document.getElementById('errorQuantity')
    if (document.getElementById('quantity').value < 1 || document.getElementById('quantity').value > 100) {
        alertQuantity.textContent = "Veuillez choisir une quantité comprise entre 1 et 100 s'il vous plaît"
        alertQuantity.style.color = 'red'
        error++
    } else {
        alertQuantity.textContent = ""
    }
    return error == 0
}