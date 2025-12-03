document.addEventListener('DOMContentLoaded', () => {
    const product = JSON.parse(localStorage.getItem('selectedProduct'));
    if (!product) {
        document.querySelector('.product-detail').innerHTML = "<p>Nu există produs selectat!</p>";
        return;
    }

    const nameElements = document.querySelectorAll('.product-name');
    const priceEl = document.getElementById('product-price');
    const descEl = document.getElementById('product-description');
    const mainImage = document.getElementById('main-product-image');
    const thumbnailsContainer = document.getElementById('thumbnails-container');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const colorSelect = document.getElementById('color-select');
    const storageSelect = document.getElementById('storage-select');

    const productName = product.name || product.title;

    // Setare nume, pret si descriere
    nameElements.forEach(el => el.innerText = productName);
    priceEl.innerText = product.price;
    descEl.innerText = product.description;

    // ----------------- COLOR OPTIONS -----------------
    const colors = product.colors || {};
    const colorKeys = Object.keys(colors);

    if (colorKeys.length > 0) {
        colorKeys.forEach(color => {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = color;
            colorSelect.appendChild(option);
        });

        // Setare imagine initiala pe prima culoare
        mainImage.src = colors[colorKeys[0]];

        colorSelect.addEventListener('change', () => {
            mainImage.src = colors[colorSelect.value];
        });
    } else {
        // fallback la imaginea default
        const images = product.images || (product.image ? [product.image] : []);
        if (images.length > 0) mainImage.src = images[0];
    }

    // ----------------- STORAGE OPTIONS -----------------
    if (product.storageOptions && product.storageOptions.length > 0) {
        product.storageOptions.forEach(storage => {
            const option = document.createElement('option');
            option.value = storage;
            option.textContent = storage;
            storageSelect.appendChild(option);
        });
    }

    // ----------------- THUMBNAILS -----------------
    thumbnailsContainer.innerHTML = '';
    const images = product.images || (product.image ? [product.image] : []);
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

    // ----------------- ADD TO CART -----------------
    addToCartBtn.addEventListener('click', () => {
        const selectedColor = colorSelect.value || null;
        const selectedStorage = storageSelect.value || null;
        const selectedImage = selectedColor ? colors[selectedColor] : mainImage.src;

        addToCart(product, selectedImage, selectedColor, selectedStorage);
    });
});

function addToCart(product, selectedImage, selectedColor, selectedStorage) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Verificam daca produsul cu aceleasi optiuni exista deja
    const existing = cart.find(p => 
        p.title === (product.name || product.title) &&
        p.color === selectedColor &&
        p.storage === selectedStorage
    );

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            title: product.name || product.title,
            price: product.price,
            imageSrc: selectedImage,
            color: selectedColor,
            storage: selectedStorage,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name || product.title} a fost adăugat în coș!`);
}
