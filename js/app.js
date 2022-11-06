let elCardsList = document.querySelector(".hero__list");
let elBtn = document.querySelector(".card__btn");
let elProductsResult = document.querySelector("#result-product")
let elCardsTemplate = document.querySelector("#card__template");

let productsApi = "https://fakestoreapi.com/products";
let products = [];

let renderProducts = function(showingProducts = products) {
    elCardsList.innerHTML = "";
    elProductsResult.textContent = `Number of Products: ${products.length}`
    showingProducts.forEach(product => {
        let cardsTemplate = elCardsTemplate.cloneNode(true).content;
        let {id, title, price, about, category, text, image, rating} = product;
        
        let cardsImg = cardsTemplate.querySelector(".card__pic");cardsImg.src = image;
        let cardsTitle = cardsTemplate.querySelector(".cards__title");cardsTitle.textContent = title;
        let cardsPrice = cardsTemplate.querySelector(".card__price");cardsPrice.textContent = price;
        let cardsText = cardsTemplate.querySelector(".card__text");cardsText.textContent = text
        let cardsAbout = cardsTemplate.querySelector(".card__about");cardsAbout.textContent = about;
        let cardsCategory = cardsTemplate.querySelector(".cards__category");cardsCategory.textContent = category;
        let cardsDeleteBtn = cardsTemplate.querySelector(".card__btn");cardsDeleteBtn.dataset.deleteId = id
        elCardsList.appendChild(cardsTemplate)
    })
}

let showAlertError = function(alertWrapper, erRmSg) {
    let newAlertP = document.createElement("p")
    newAlertP.textContent = "Error" || erRmSg
    newAlertP.className = "alert alert-danger";
    alertWrapper.appendChild(newAlertP)
    
    return newAlertP
}


// let newP = document.createElement("p")
// newP.className = "loader"
// elLoadingWrapperr.prepend(newP)


fetch(productsApi)
.then((res) => {
    if (res.status === 200) {
        return res.json()
    }
    return Promise.reject(res)
})
.then((data) => {
    products = data
    renderProducts(products)
})
.catch((err) => {
    if (err.status === 404) {
        return showAlertError(elLoadingWrapperr, "Hech narsa topilmadi")
    }
    showAlertError(elLoadingWrapperr, "Xatolik yuz berdi")
})
.finally(() => {
    newP.remove()
})

elCardsList.addEventListener("click", function(evt) {
    evt.preventDefault()
    
    if (evt.target.matches(".card__btn")) {
        let deleteBtnId = +evt.target.dataset.deleteId;
        evt.target.disabled = true;
        fetch(`${productsApi}/${deleteBtnId}`, {
            method: "DELETE",
        })
        .then((res) => {
            if (res.status === 200) {
                return res.json()
            }
            return Promise.reject(res)
        })
        .then(() => {
            let deleteIndex = products.find(function(item) {
                return item.id == deleteBtnId
            })
            products.splice(deleteIndex, 1)
            renderProducts(products)
        })
        .catch(() => {
            evt.target.disabled = false
            return showAlertError(elLoadingWrapperr, "Hatolik yuz berdi")
        })
    }
})