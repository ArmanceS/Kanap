const products = localStorage.getItem('products')
let cart = JSON.parse(products)

/**
 * Crée le html du canapé passé en paramètre en tenant compte de sa couleur et quantité
 * @param {object} kanap
 * @param {string} color
 * @param {int} quantite
 * @returns {void}
 */
function createDom(kanap, color, quantite) {
    const article = document.createElement('article')
    article.className = 'cart__item'
    article.setAttribute('data-id', kanap._id)
    article.setAttribute('data-color', color)
    document.querySelector('#cart__items').appendChild(article)

    const divImg = document.createElement('div')
    divImg.setAttribute('class', "cart__item__img")
    article.appendChild(divImg)

    const img = document.createElement('img')
    img.setAttribute("src", kanap.imageUrl)
    img.setAttribute("alt", kanap.description)
    divImg.appendChild(img)

    const divContent = document.createElement('div')
    divContent.setAttribute('class', "cart__item__content")
    article.appendChild(divContent)

    const divCtDescrip = document.createElement('div')
    divCtDescrip.setAttribute('class', "cart__item__content__description")
    divContent.appendChild(divCtDescrip)

    const productTitle = document.createElement('h2')
    productTitle.textContent = kanap.name
    divCtDescrip.appendChild(productTitle)

    const productColor = document.createElement('p')
    productColor.textContent = color
    divCtDescrip.appendChild(productColor)

    const productPrice = document.createElement('p')
    productPrice.textContent = quantite * kanap.price + "€"
    divCtDescrip.appendChild(productPrice)

    const divCtSettings = document.createElement('div')
    divCtSettings.setAttribute('class', "cart__item__content__settings")
    divContent.appendChild(divCtSettings)

    const divCtSettingsQtity = document.createElement('div')
    divCtSettingsQtity.setAttribute('class', "cart__item__content__settings__quantity")
    divCtSettings.appendChild(divCtSettingsQtity)

    const productQuantity = document.createElement('p')
    productQuantity.textContent = "Qté :"
    divCtSettingsQtity.appendChild(productQuantity)

    const productQuantitySelect = document.createElement('input')
    productQuantitySelect.type = "number"
    productQuantitySelect.setAttribute('class', "itemQuantity")
    productQuantitySelect.name = "itemQuantity"
    productQuantitySelect.min = "1"
    productQuantitySelect.max = "100"
    productQuantitySelect.value = quantite
    divCtSettingsQtity.appendChild(productQuantitySelect)

    const divCtSettingsDelete = document.createElement('div')
    divCtSettingsDelete.setAttribute('class', "cart__item__content__settings__delete")
    divCtSettings.appendChild(divCtSettingsDelete)

    const productDelete = document.createElement('p')
    productDelete.setAttribute('class', "deleteItem")
    productDelete.textContent = "Supprimer"
    divCtSettingsDelete.appendChild(productDelete)

    productQuantitySelect.addEventListener('change', function () {
        const newQuantity = Number(productQuantitySelect.value)
        updateProductFromCart(id, color, newQuantity)
        document.querySelector('#totalQuantity').textContent = Number(document.querySelector('#totalQuantity').textContent) - Number(quantite) + newQuantity

        document.querySelector('#totalPrice').textContent = Number(document.querySelector('#totalPrice').textContent) - Number(kanap.price * quantite) + kanap.price * newQuantity

        quantite = newQuantity
    })


    let id = article.dataset.id
    productDelete.addEventListener('click', function () {
        deleteProductFromCart(id, color)
        productDelete.closest('article').remove() 
        document.querySelector('#totalQuantity').textContent = Number(document.querySelector('#totalQuantity').textContent) - Number(quantite)

        document.querySelector('#totalPrice').textContent = Number(document.querySelector('#totalPrice').textContent) - kanap.price * Number(quantite)
    })

    document.querySelector('#totalQuantity').textContent = Number(document.querySelector('#totalQuantity').textContent) + Number(quantite)

    document.querySelector('#totalPrice').textContent = Number(document.querySelector('#totalPrice').textContent) + kanap.price * Number(quantite)

}
/**
 * Moifie la quantité d'un produit dans le panier
 * @param {int} id 
 * @param {string} color 
 * @param {int} newQuantity 
 */
function updateProductFromCart(id, color, newQuantity){
    cart[id][color] = newQuantity
    localStorage.setItem('products', JSON.stringify(cart))
}
/**
 * Permet de supprimer un produit du panier
 * @param {int} id
 * @param {string} color
 */
function deleteProductFromCart(id, color){
    delete cart[id][color]
    if (Object.keys(cart[id]).length < 1) {
        delete cart[id]
    }
    localStorage.setItem('products', JSON.stringify(cart))
}

for (const [id, caracteristiques] of Object.entries(cart)) {
    fetch('http://localhost:3000/api/products/' + id)
        .then(function (data) {
            return data.json()
        })
        .then(function (kanap) {
            for (const [color, quantite] of Object.entries(caracteristiques)) {
                createDom(kanap, color, quantite)
            }
        })

}

document.querySelector('.cart__order__form').addEventListener('submit', function(e) {
    e.preventDefault()
      let error = 0
      let firstName = document.getElementById('firstName')
      const onlyChars = /^[aA-zZ-éèêâîôû-\D]+$/
      if (firstName.value.length < 2 || !(onlyChars.test(firstName.value))) {
          document.getElementById('firstNameErrorMsg').textContent = 'Veillez entrer un Prénom de minimun 2 lettres'
          error++
      } else {
          document.getElementById('firstNameErrorMsg').textContent = ""
      }
  
      let lastName = document.getElementById('lastName')
      if (lastName.value.length < 2 || !(onlyChars.test(lastName.value))) {
          document.getElementById('lastNameErrorMsg').textContent = 'Veillez entrer un Nom de minimun 2 lettres'
          error++
      } else {
          document.getElementById('lastNameErrorMsg').textContent = ""
      }
  
      let address = document.getElementById('address')
      if (address.value.length < 10) {
          document.getElementById('addressErrorMsg').textContent = 'Ex : 33 rue de l\'Exemple'
          error++
      } else {
          document.getElementById('addressErrorMsg').textContent = ""
      }
  
      let city = document.getElementById('city')
      if (city.value.length < 3 || !(onlyChars.test(city.value))) {
          document.getElementById('cityErrorMsg').textContent = 'Veuillez préciser la Ville'
          error++
      } else {
          document.getElementById('cityErrorMsg').textContent = ""
      }
  
      let email = document.getElementById('email')
      if (!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.value))) {
          document.getElementById('emailErrorMsg').textContent = 'Veuillez entrer une adresse mail valide'
          error++
      } else {
          document.getElementById('emailErrorMsg').textContent = ""
      }
  
      if (error === 0) {
          postData(firstName, lastName, address, city, email);
      }
  })

function postData(firstName, lastName, address, city, email){
  let contact = { firstName: firstName.value, lastName: lastName.value, address: address.value, city: city.value, email: email.value }
        let products = []
        let productId = document.querySelectorAll('[data-id]')
        for (let i = 0; i < productId.length; i++) {
            if (!products.includes(productId[i].dataset.id)) {
                products.push(productId[i].dataset.id)
            }
        }

        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
                'Accept': 'application/json;charset=utf-8',
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ contact: contact, products: products })
        }).then(function (data) {
                return data.json()
            }).then(function (order) {
                localStorage.clear()
                window.location.href = 'confirmation.html?id=' + order.orderId
            })
}