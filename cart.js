let cart = JSON.parse(localStorage.getItem('cart')) || [];

window.onload = function () {
    renderCart();
    const purchaseBtn = document.querySelector('.btn-purchase');
    if (purchaseBtn) purchaseBtn.addEventListener('click', purchaseClicked);

    attachFormListener();
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
        alert("Koshi juaj eshte bosh!");
        return;
    }
    openPopup();
}

function attachFormListener() {
    const form = document.getElementById('order-form');
    if (!form || form.hasListenerAttached) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

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

        try {
            await fetch('https://europe-west1-megaelectronic.cloudfunctions.net/sendOrderEmails', { // înlocuiește cu URL-ul funcției tale
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            });

            alert("✅ Felicitări! Porosia a fost trimisă cu succes.");

            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();

            form.reset();
            hidePopup();

        } catch (err) {
            alert("❌ Eroare la trimiterea comenzii.");
            console.error(err);
        }
    });

    form.hasListenerAttached = true;
}

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

closePopup.addEventListener('click', hidePopup);
overlay.addEventListener('click', hidePopup);
