fetch("http://localhost:3000/api/products")
    .then(function (data) {
        return data.json()
    })
    .then(function (kanaps) {
        for (let i = 0; i < kanaps.length; i++) {
            let kanap = kanaps[i]
            document.getElementById('items').appendChild(createDom(kanap))
        }
    })
/**
 * Crée le html du canapé passé en paramètre
 * @param {object} kanap
 * @returns {HTMLAnchorElement}
 */
function createDom(kanap) {
    const link = document.createElement('a')
    link.setAttribute('href', './product.html?id=' + kanap._id)

    const article = document.createElement('article')
    link.appendChild(article)

    const image = document.createElement("img")
    image.setAttribute('src', kanap.imageUrl)
    image.setAttribute('alt', kanap.altTxt)
    article.appendChild(image)

    const productTitle = document.createElement('h3')
    productTitle.setAttribute('class', 'productName')
    productTitle.textContent = kanap.name
    article.appendChild(productTitle)

    const p = document.createElement('p')
    p.setAttribute('class', 'productDescription')
    p.textContent = kanap.description
    article.appendChild(p)

    return link
}