document.addEventListener('DOMContentLoaded', () => {

    const product = JSON.parse(localStorage.getItem('selectedProduct'));

    if (!product) {
        document.querySelector('.product-detail').innerHTML =
            "<p>Nu există produs selectat!</p>";
        return;
    }

    const nameEls = document.querySelectorAll('.product-name');
    const priceEl = document.getElementById('product-price');
    const descEl = document.getElementById('product-description');
    const mainImage = document.getElementById('main-product-image');
    const thumbnailsContainer = document.getElementById('thumbnails-container');
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    const colorBox = document.getElementById('color-options');
    const storageBox = document.getElementById('storage-options');
    const stateBox = document.getElementById('state-options');

    let selectedColor = null;
    let selectedStorage = null;
    let selectedState = null;

    const title = product.name || product.title;

    nameEls.forEach(el => el.innerText = title);
    priceEl.innerText = product.price;
    descEl.innerText = product.description;

    if (product.image) mainImage.src = product.image;

    // ----------------- COLORS -----------------
    if (product.colors) {
        Object.entries(product.colors).forEach(([color, img], i) => {
            const btn = document.createElement('div');
            btn.className = "option-item";
            btn.innerText = color;

            if (i === 0) {
                btn.classList.add("active");
                selectedColor = color;
                mainImage.src = img;
            }

            btn.addEventListener('click', () => {
                document.querySelectorAll('#color-options .option-item')
                    .forEach(el => el.classList.remove('active'));
                btn.classList.add("active");
                selectedColor = color;
                mainImage.src = img;

                // Actualizare thumbnail activ
                document.querySelectorAll(".thumb-image").forEach(el => {
                    el.classList.toggle("active", el.src === img);
                });
            });

            colorBox.appendChild(btn);
        });
    } else {
        colorBox.style.display = "none"; // ascunde selectorul dacă nu există
    }

    // ----------------- STORAGE -----------------
    if (product.storageOptions) {
        product.storageOptions.forEach((storage, i) => {
            const btn = document.createElement('div');
            btn.className = "option-item";
            btn.innerText = storage;

            if (i === 0) {
                btn.classList.add("active");
                selectedStorage = storage;
            }

            btn.addEventListener('click', () => {
                document.querySelectorAll('#storage-options .option-item')
                    .forEach(el => el.classList.remove('active'));
                btn.classList.add("active");
                selectedStorage = storage;
            });

            storageBox.appendChild(btn);
        });
    } else {
        storageBox.style.display = "none";
        selectedStorage = null;
    }

    // ----------------- STATE -----------------
    if (product.state) {
        const states = [product.state];

        states.forEach((state, i) => {
            const btn = document.createElement('div');
            btn.className = "option-item";
            btn.innerText = state;

            if (i === 0) {
                btn.classList.add("active");
                selectedState = state;
            }

            btn.addEventListener('click', () => {
                document.querySelectorAll('#state-options .option-item')
                    .forEach(el => el.classList.remove('active'));
                btn.classList.add("active");
                selectedState = state;
            });

            stateBox.appendChild(btn);
        });
    } else {
        stateBox.style.display = "none";
        selectedState = null;
    }

    // ----------------- THUMBNAILS -----------------
    thumbnailsContainer.innerHTML = "";
    const images = product.images || (product.image ? [product.image] : []);

    images.forEach((img, i) => {
        const thumb = document.createElement('img');
        thumb.src = img;
        thumb.classList.add("thumb-image");
        if (i === 0) thumb.classList.add("active");

        thumb.addEventListener('click', () => {
            mainImage.src = img;
            document.querySelectorAll(".thumb-image")
                .forEach(el => el.classList.remove("active"));
            thumb.classList.add("active");
        });

        thumbnailsContainer.appendChild(thumb);
    });

    // ----------------- ADD TO CART -----------------
    addToCartBtn.addEventListener('click', () => {

        if (
            (product.colors && !selectedColor) ||
            (product.storageOptions && !selectedStorage) ||
            (product.state && !selectedState)
        ) {
            alert("Te lutem zgjidh toate opțiunile disponibile!");
            return;
        }

        const selectedImage =
            product.colors?.[selectedColor] || mainImage.src;

        addToCart(
            product,
            selectedImage,
            selectedColor,
            selectedStorage,
            selectedState
        );
    });

});

// ----------------- FUNCTION ADD TO CART -----------------
function addToCart(product, image, color, storage, state) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const title = product.name || product.title;

    const existing = cart.find(p =>
        p.title === title &&
        p.color === color &&
        p.storage === storage &&
        p.state === state
    );

    if (existing) existing.quantity++;
    else cart.push({
        title,
        price: product.price,
        imageSrc: image,
        color,
        storage,
        state,
        quantity: 1
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${title} a fost adăugat în coș!`);
}
