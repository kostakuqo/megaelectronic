let cart = JSON.parse(localStorage.getItem('cart')) || [];

window.onload = function () {
    renderCart();
    document.querySelector('.btn-purchase').addEventListener('click', purchaseClicked);
};

function renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.classList.add('empty-message');
        emptyMessage.innerHTML = `<p>🛒 Koshi eshte bosh, shto nje produkt per te derguar nje porosi!</p>`;
        cartItemsContainer.appendChild(emptyMessage);
        document.querySelector('.cart-total-price').innerText = '$0';
        return;
    }

    cart.forEach((product, index) => {
        const cartRow = document.createElement('div');
        cartRow.classList.add('cart-row');

        cartRow.innerHTML = `
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="${product.imageSrc}" width="100" height="100">
                <span class="cart-item-title">${product.title}</span>
            </div>
               <span class="cart-options cart-column">
                Color: ${product.color || 'N/A'}<br>
                Memory: ${product.storage || 'N/A'}
                </span>

            <span class="cart-price cart-column">${product.price}</span>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" value="${product.quantity}" min="1">
                <button class="btn btn-danger">Remove</button>
            </div>
        `;

        cartItemsContainer.appendChild(cartRow);

        cartRow.querySelector('.btn-danger').addEventListener('click', () => {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        });

        cartRow.querySelector('.cart-quantity-input').addEventListener('change', e => {
            let qty = parseInt(e.target.value);
            if (isNaN(qty) || qty < 1) qty = 1;
            product.quantity = qty;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartTotal();
        });
    });

    updateCartTotal();
}

function updateCartTotal() {
    const cartRows = document.querySelectorAll('.cart-row');
    let total = 0;

    cartRows.forEach(row => {
        const priceElement = row.querySelector('.cart-price');
        const quantityElement = row.querySelector('.cart-quantity-input');

        if (!priceElement || !quantityElement) return;

        const price = parseFloat(priceElement.innerText.replace("$", ""));
        const quantity = parseInt(quantityElement.value);
        total += price * quantity;
    });

    total = Math.round(total * 100) / 100;
    document.querySelector('.cart-total-price').innerText = '$' + total;
}


function purchaseClicked() {
    if (cart.length === 0) {
        alert("Coșul este gol!");
        return;
    }

    openPopup();
}


document.getElementById('order-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const form = e.target;

    const order = {
        customer: {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            phone: form.phone.value.trim(),
            address: form.address.value.trim(),
        },
        products: cart,
        total: cart.reduce((sum, p) => sum + parseFloat(p.price) * p.quantity, 0)
    };

    console.log("🟦 Porosia e derguar:", order);

    alert("Faleminderit! Porosia u dërgua me sukses.");

    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();

    form.reset();
    hidePopup();
});







const popup = document.getElementById('popup');
const overlay = document.getElementById('popup-overlay');
const closePopup = document.getElementById('close-popup');

function openPopup() {
    popup.classList.add('show');
    overlay.classList.add('show');
}

function hidePopup() {
    popup.classList.remove('show');
    overlay.classList.remove('show');
}

// Închidere la apăsarea butonului X
closePopup.addEventListener('click', hidePopup);

// Închidere la click în afara popup-ului
overlay.addEventListener('click', hidePopup);
