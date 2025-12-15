
let cart = JSON.parse(localStorage.getItem('cart')) || [];


document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    const purchaseBtn = document.querySelector('.btn-purchase');
    if (purchaseBtn) purchaseBtn.addEventListener('click', purchaseClicked);

    attachFormListener();
    attachPopupListeners();
});


function renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.classList.add('empty-message');
        emptyMessage.innerHTML = `<p>🛒 Koshi eshte bosh, shto nje produkt per te derguar nje porosi!</p>`;
        cartItemsContainer.appendChild(emptyMessage);
        updateTotal(0);
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
                <input class="cart-quantity-input" type="number" min="1" value="${product.quantity}">
                <button class="btn btn-danger">Remove</button>
            </div>
        `;

        cartItemsContainer.appendChild(cartRow);

        const removeBtn = cartRow.querySelector('.btn-danger');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                cart.splice(index, 1);
                saveCart();
                renderCart();
            });
        }

        const qtyInput = cartRow.querySelector('.cart-quantity-input');
        if (qtyInput) {
            qtyInput.addEventListener('change', e => {
                const qty = Math.max(1, parseInt(e.target.value) || 1);
                product.quantity = qty;
                saveCart();
                updateCartTotal();
            });
        }
    });

    updateCartTotal();
}


function updateCartTotal() {
    let total = cart.reduce((sum, p) => sum + parseFloat(p.price) * p.quantity, 0);
    total = Math.round(total * 100) / 100;
    updateTotal(total);
}

function updateTotal(value) {
    const totalEl = document.querySelector('.cart-total-price');
    if (totalEl) totalEl.textContent = '$' + value;
}


function purchaseClicked() {
    if (cart.length === 0) {
        alert('Koshi juaj eshte bosh!');
        return;
    }
    openPopup();
}


function attachFormListener() {
    const form = document.getElementById('order-form');
    if (!form || form.dataset.listener) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();

        const order = {
            customer: {
                name: form.name.value.trim(),
                email: form.email.value.trim(),
                phone: form.phone.value.trim(),
                address: form.address.value.trim()
            },
            products: cart,
            total: cart.reduce((sum, p) => sum + parseFloat(p.price) * p.quantity, 0)
        };

        try {
            await fetch('https://europe-west1-megaelectronic.cloudfunctions.net/sendOrderEmails', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            });

            alert('✅ Porosia u dergua me sukses!');
            form.reset();
            hidePopup();


            cart = [];
            saveCart();
            renderCart();

        } catch (err) {
            alert('Gabim ne dergimin e porsise!!');
            console.error(err);
        }
    });

    form.dataset.listener = 'true';
}


function attachPopupListeners() {
    const closePopup = document.getElementById('close-popup');
    const overlay = document.getElementById('popup-overlay');

    if (closePopup) closePopup.addEventListener('click', hidePopup);
    if (overlay) overlay.addEventListener('click', hidePopup);
}

const popup = document.getElementById('popup');
const overlay = document.getElementById('popup-overlay');

function openPopup() {
    popup?.classList.add('show');
    overlay?.classList.add('show');
}

function hidePopup() {
    popup?.classList.remove('show');
    overlay?.classList.remove('show');
}


function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}
