let cart = JSON.parse(localStorage.getItem('cart')) || [];

window.onload = function () {
    renderCart();
    document.querySelector('.btn-purchase').addEventListener('click', purchaseClicked)


};


function renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.classList.add('empty-message');
        emptyMessage.innerHTML = `
            <p>
                🛒 Koshi juaj eshte bosh ! Bashkangjisni produktet ne kosh per te derguar nje porosi!
            </p>
        `;
        cartItemsContainer.appendChild(emptyMessage);
        document.querySelector('.cart-total-price').innerText = '$0';
        return;
    }


    cart.forEach(product => {
        const cartRow = document.createElement('div');
        cartRow.classList.add("cart-row");

        cartRow.innerHTML = `
        
     <div class="cart-item cart-column">
        <img class="cart-item-image" src="${product.imageSrc}" width="100" height="100">
        <span class="cart-item-title">${product.title}</span>
        </div>
        <span class="cart-price cart-column">${product.price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">Remove</button>
        </div>`

        cartItemsContainer.appendChild(cartRow);
        var removeCartButtons = document.getElementsByClassName("btn-danger");
        for (var i = 0; i < removeCartButtons.length; i++) {
            var button = removeCartButtons[i];
            button.addEventListener('click', removeCartItem)
        }

        var quantityInputs = document.getElementsByClassName('cart-quantity-input');
        for (var i = 0; i < quantityInputs.length; i++) {
            var input = quantityInputs[i];
            input.addEventListener('change', quantityChanget);

        }
        var addToCartButtons = document.getElementsByClassName('buyphone-btn');
        for (var i = 0; i < addToCartButtons.length; i++) {
            var button = addToCartButtons[i];
            button.addEventListener('click', addToCartClicked)

        }





    })
    updateCartTotal();

}
const cartIcon = document.querySelector(".fa-shopping-cart");
if (cartIcon) cartIcon.addEventListener('click', () => window.location.href = 'cart.html');

const heartIcon = document.querySelector(".fa-heart");
if (heartIcon) heartIcon.addEventListener('click', () => window.location.href = 'favorites.html');

const userIcon = document.querySelector(".fa-user");
if (userIcon) userIcon.addEventListener('click', () => window.location.href = 'login.html');

function purchaseClicked() {
    alert('Faleminderit për porosinë tuaj ❤️');


    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));


    renderCart();
}



function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal();

}

function quantityChanget(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal();
}
function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItemContainer.getElementsByClassName("cart-row")
    var total = 0;
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName('cart-price')[0];
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        var price = parseFloat(priceElement.innerText.replace("$", ''));
        var quantity = quantityElement.value
        total = total + (price * quantity);
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total;
}


