document.addEventListener('DOMContentLoaded', () => {
    const product = JSON.parse(localStorage.getItem('selectedProduct'));

    if (!product) {
        document.querySelector('.product-detail').innerHTML = "<p>Nu există produs selectat!</p>";
        return;
    }

    const mainImage = document.getElementById('main-product-image');
    const thumbnailsContainer = document.getElementById('thumbnails-container');
    const nameEl = document.getElementById('product-name');
    const priceEl = document.getElementById('product-price');
    const descEl = document.getElementById('product-description');
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    // Setare date principale
    nameEl.innerText = product.name || product.title;
    priceEl.innerText = product.price;
    descEl.innerText = product.description;

    // Carousel: setare prima imagine și thumbnails
    let images = product.images || [product.image]; // fallback la un singur image
    mainImage.src = images[0];

    images.forEach((src, index) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        thumb.classList.add('thumb-image');
        if (index === 0) thumb.classList.add('active');

        thumb.addEventListener('click', () => {
            mainImage.src = src;
            document.querySelectorAll('.thumb-image').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });

        thumbnailsContainer.appendChild(thumb);
    });

    // Add to cart
    addToCartBtn.addEventListener('click', () => addToCart(product));
});

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(p => p.title === (product.name || product.title));

    if (existing) existing.quantity += 1;
    else cart.push({
        title: product.name || product.title,
        price: product.price,
        imageSrc: (product.images ? product.images[0] : product.image),
        quantity: 1
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name || product.title} a fost adăugat în coș!`);
}
