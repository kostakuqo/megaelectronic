// ===== HEADER ICONS =====
function attachHeaderIcons() {
    const cartIcon = document.querySelector(".fa-shopping-cart");
    if (cartIcon) cartIcon.addEventListener('click', () => window.location.href = 'cart.html');

    const heartIcon = document.querySelector(".fa-heart");
    if (heartIcon) heartIcon.addEventListener('click', () => window.location.href = 'favorites.html');

    const userIcon = document.querySelector(".fa-user");
    if (userIcon) userIcon.addEventListener('click', () => window.location.href = 'login.html');
}

// ===== LOAD DATA =====
async function loadData() {
    try {
        const [phonesResponse, containsResponse, headphonesResponse, speakersResponse, coversResponse, chargersResponse, scootersResponse] = await Promise.all([
            fetch('data/phones.json'),
            fetch('data/contains.json'),
            fetch('data/headphones.json'),
            fetch('data/speakers.json'),
            fetch('data/covers.json'),
            fetch('data/chargers.json'),
            fetch('data/scooters.json')
        ]);

        const phones = await phonesResponse.json();
        const contains = await containsResponse.json();
        const headphones = await headphonesResponse.json();
        const speakers = await speakersResponse.json();
        const covers = await coversResponse.json();
        const chargers = await chargersResponse.json();
        const scooters = await scootersResponse.json();

        // Generate product cards
        generateProductCards({
            products: phones,
            containerSelector: '.phonecardscontainer',
            cardSelector: '.phonecard',
            imageClass: '.phoneimage',
            nameClass: '.phonename',
            priceClass: '.phoneprice',
            descClass: '.phonedescription'
        });
        scrollProducts('.phonecardscontainer', '#phone-left', '#phone-right', 300);

        generateProductCards({
            products: headphones,
            containerSelector: '.headphonecardscontainer',
            cardSelector: '.headphonecard',
            imageClass: '.headphoneimage',
            nameClass: '.headphonename',
            priceClass: '.headphoneprice',
            descClass: '.headphonedescription'
        });
        scrollProducts('.headphonecardscontainer', '#headphone-left', '#headphone-right', 300);

        generateProductCards({
            products: speakers,
            containerSelector: '.speakercardscontainer',
            cardSelector: '.speakercard',
            imageClass: '.speakerimage',
            nameClass: '.speakername',
            priceClass: '.speakerprice',
            descClass: '.speakerdescription'
        });
        scrollProducts('.speakercardscontainer', '#speaker-left', '#speaker-right', 300);

        generateProductCards({
            products: covers,
            containerSelector: '.covercardscontainer',
            cardSelector: '.covercard',
            imageClass: '.coverimage',
            nameClass: '.covername',
            priceClass: '.coverprice',
            descClass: '.coverdescription'
        });
        scrollProducts('.covercardscontainer', '#cover-left', '#cover-right', 300);

        generateProductCards({
            products: chargers,
            containerSelector: '.chargercardscontainer',
            cardSelector: '.chargercard',
            imageClass: '.chargerimage',
            nameClass: '.chargername',
            priceClass: '.chargerprice',
            descClass: '.chargerdescription'
        });
        scrollProducts('.chargercardscontainer', '#charger-left', '#charger-right', 300);

        generateProductCards({
            products: scooters,
            containerSelector: '.scootercardscontainer',
            cardSelector: '.scootercard',
            imageClass: '.scooterimage',
            nameClass: '.scootername',
            priceClass: '.scooterprice',
            descClass: '.scooterdescription'
        });
        scrollProducts('.scootercardscontainer', '#scooter-left', '#scooter-right', 300);

        // Generate contain section
        generateContent(contains);

        // Attach header icons
        attachHeaderIcons();

        // Initialize other functions
        initContainSwipe();
        ready();
        initMap();
        initCarousel('.right-menu .carousel', 3000);

        // ===== INIT SEARCH =====
        const allProducts = [
            ...phones,
            ...headphones,
            ...speakers,
            ...covers,
            ...chargers,
            ...scooters
        ];
        initSearch(allProducts);

    } catch (error) {
        console.error(error);
    }
}

window.addEventListener('load', loadData);
window.addEventListener('DOMContentLoaded', attachHeaderIcons);

// ===== SEARCH FUNCTION =====
// ===== SEARCH FUNCTION =====
function initSearch(allProducts) {
    const searchInput = document.querySelector('.search-input');
    const resultsContainer = document.getElementById('search-results');

    // Folosim cardul template ascuns
    const templateCard = document.querySelector('.phonecard.template');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        resultsContainer.innerHTML = '';

        if (!query) {
            resultsContainer.style.display = 'none';
            return;
        }

        resultsContainer.style.display = 'grid';

        const filtered = allProducts.filter(product => product.name.toLowerCase().includes(query));

        if (filtered.length === 0) {
            const msg = document.createElement('div');
            msg.textContent = "Niciun rezultat";
            msg.style.gridColumn = '1 / -1';
            resultsContainer.appendChild(msg);
            return;
        }

        filtered.forEach(product => {
            // Clonează template-ul
            const card = templateCard.cloneNode(true);
            card.classList.remove('template');
            card.style.display = 'block'; // fă-l vizibil

            // Imagine
            const img = card.querySelector('.phoneimage');
            if (img) img.src = product.images?.[0] || product.image || '';

            // Nume
            const name = card.querySelector('.phonename');
            if (name) name.textContent = product.name;

            // Preț
            const price = card.querySelector('.phoneprice');
            if (price) price.textContent = product.price;

            // Descriere
            const desc = card.querySelector('.phonedescription');
            if (desc) {
                const maxLength = 20;
                desc.textContent = product.description
                    ? (product.description.length > maxLength ? product.description.slice(0, maxLength) + '...' : product.description)
                    : '';
            }

            // Click pe card (fără să fie buton)
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.buyphone-btn')) {
                    localStorage.setItem('selectedProduct', JSON.stringify(product));
                    window.location.href = 'product.html';
                }
            });

            // Click pe Add to Cart
            const addToCartBtn = card.querySelector('.buyphone-btn');
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // nu deschide pagina
                    addToCartClicked(product);
                });
            }

            resultsContainer.appendChild(card);
        });
    });

    // Ascundem search-ul dacă facem click în afara lui
    document.addEventListener('click', e => {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.style.display = 'none';
        }
    });
}







// ===== GENERATE PRODUCT CARDS =====
function generateProductCards({ products, containerSelector, cardSelector, imageClass, nameClass, priceClass, descClass }) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const templateCard = container.querySelector(cardSelector);
    templateCard.style.display = 'none';

    products.forEach(product => {
        const newCard = templateCard.cloneNode(true);

        const img = newCard.querySelector(imageClass);
        if (img) img.src = product.images?.[0] || product.image || "";

        const name = newCard.querySelector(nameClass);
        if (name) name.textContent = product.name;

        const price = newCard.querySelector(priceClass);
        if (price) price.textContent = product.price;

        const desc = newCard.querySelector(descClass);
        if (desc) {
            const maxLength = 20;
            desc.textContent = product.description.length > maxLength ? product.description.slice(0, maxLength) + '...' : product.description;
        }

        newCard.style.display = 'block';
        container.appendChild(newCard);

        const addToCartBtn = newCard.querySelector('.buyphone-btn, .buyheadphone-btn, .buyspeaker-btn, .buycover-btn, .buycharger-btn, .buyscooter-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                addToCartClicked(product);
            });
        }

        newCard.addEventListener('click', () => {
            localStorage.setItem('selectedProduct', JSON.stringify(product));
            window.location.href = 'product.html';
        });
    });
}

// ===== SCROLL PRODUCTS =====
function scrollProducts(containerSelector, btnLeftSelector, btnRightSelector, scrollAmount = 1000) {
    const container = document.querySelector(containerSelector);
    const btnLeft = document.querySelector(btnLeftSelector);
    const btnRight = document.querySelector(btnRightSelector);
    if (!container || !btnLeft || !btnRight) return;

    function updateButtons() {
        btnLeft.disabled = container.scrollLeft === 0;
        btnRight.disabled = container.scrollLeft + container.clientWidth >= container.scrollWidth;
    }

    btnLeft.addEventListener('click', () => {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        setTimeout(updateButtons, 300);
    });

    btnRight.addEventListener('click', () => {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        setTimeout(updateButtons, 300);
    });

    container.addEventListener('scroll', updateButtons);
    updateButtons();
}

// ===== CART FUNCTIONS =====
function ready() {
    const removeCartButtons = document.getElementsByClassName("btn-danger");
    for (let button of removeCartButtons) button.addEventListener('click', removeCartItem);

    const quantityInputs = document.getElementsByClassName('cart-quantity-input');
    for (let input of quantityInputs) input.addEventListener('change', quantityChanget);

    const addToCartButtons = document.getElementsByClassName('buyphone-btn');
    for (let button of addToCartButtons) button.addEventListener('click', addToCartClicked);

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked);
}

function purchaseClicked() {
    alert('Faleminderit per porosine tuaj!');
    const cartItems = document.getElementsByClassName('cart-items')[0];
    while (cartItems.firstChild) cartItems.removeChild(cartItems.firstChild);
    updateCartTotal();
}

function removeCartItem(event) {
    const buttonClicked = event.target;
    buttonClicked.closest('.cart-row').remove();
    updateCartTotal();
}

function quantityChanget(event) {
    const input = event.target;
    if (isNaN(input.value) || input.value <= 0) input.value = 1;
    updateCartTotal();
}

function addToCartClicked(input) {
    let product;

    if (input instanceof Event) {
        const button = input.target.closest('.buyphone-btn, .buyheadphone-btn,.buyspeaker-btn,.buycover-btn,.buycharger-btn,.buyscooter-btn');
        if (!button) return;

        const shopItem = button.closest('.phonecard, .headphonecard,.speakercard,.covercard,.chargercard,.scootercard');
        if (!shopItem) return;

        const title = shopItem.querySelector('.phonename, .headphonename,.speakername,.covername,.chargername,.scootername')?.innerText || "Titlu lipsă";
        const price = shopItem.querySelector('.phoneprice, .headphoneprice,.speakerprice,.coverprice,.chargerprice,.scooterprice')?.innerText || "0";
        const imageSrc = shopItem.querySelector('.phoneimage, .headphoneimage,speakerimage,.coverimage,.chargerimage,.scooterimage')?.src || "";

        product = { title, price, imageSrc, quantity: 1 };
    } else {
        product = { title: input.name || input.title, price: input.price, imageSrc: input.image || input.imageSrc, quantity: 1 };
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(p => p.title === product.title);
    if (existing) existing.quantity += 1;
    else cart.push(product);

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.title} u shtua în coș!`);

    addItemToCard(product.title, product.price, product.imageSrc);
    updateCartTotal();
}

function addItemToCard(title, price, imageSrc) {
    const cartItems = document.getElementsByClassName('cart-items')[0];
    const cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');

    cartRow.innerHTML = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">Remove</button>
        </div>
    `;

    cartItems.appendChild(cartRow);

    cartRow.querySelector('.btn-danger').addEventListener('click', removeCartItem);
    cartRow.querySelector('.cart-quantity-input').addEventListener('change', quantityChanget);
}

function updateCartTotal() {
    const cartItemContainer = document.getElementsByClassName('cart-items')[0];
    const cartRows = cartItemContainer.getElementsByClassName("cart-row");
    let total = 0;

    for (let cartRow of cartRows) {
        const priceElement = cartRow.querySelector('.cart-price');
        const quantityElement = cartRow.querySelector('.cart-quantity-input');
        const price = parseFloat(priceElement.innerText.replace("$", ''));
        const quantity = quantityElement.value;
        total += price * quantity;
    }
    total = Math.round(total * 100) / 100;
    document.querySelector('.cart-total-price').innerText = '$' + total;
}

// ===== CONTAIN SECTION =====
function generateContent(contains) {
    const container = document.querySelector(".about-contain");
    const templateContainer = document.querySelector(".main-container");
    templateContainer.style.display = "none";

    contains.forEach(contain => {
        const newContain = templateContainer.cloneNode(true);

        newContain.querySelector(".preview-contain").innerHTML = contain.contain;
        newContain.querySelector(".image-contain").src = contain.image;
        newContain.querySelector(".icon-contain").innerHTML = `<i class="${contain.icon}"></i>`;
        newContain.querySelector(".tooltip-text").textContent = contain.text;
        newContain.style.display = "block";

        const redirectLink = newContain.querySelector('a.icon-contain-link');
        if (redirectLink) redirectLink.removeAttribute('href');

        container.appendChild(newContain);

        newContain.addEventListener('click', () => {
            if (contain.type) {
                window.location.href = `${contain.type}.html`;
            }
        });
    });
}

// ===== CONTAIN SWIPE =====
function initContainSwipe() {
    const container = document.querySelector('.about-contain');
    if (!container) return;

    const cards = container.querySelectorAll('.main-container');
    const dotsContainer = document.querySelector('.contain-dots');
    if (cards.length === 0 || !dotsContainer) return;

    dotsContainer.innerHTML = "";

    const dots = [];
    cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = "contain-dot";
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
            container.scrollTo({ left: cards[i].offsetLeft, behavior: 'smooth' });
        });
        dotsContainer.appendChild(dot);
        dots.push(dot);
    });

    function getActiveCardIndex() {
        let containerLeft = container.scrollLeft;
        let containerCenter = containerLeft + container.clientWidth / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        cards.forEach((card, i) => {
            let cardCenter = card.offsetLeft + card.offsetWidth / 2;
            let distance = Math.abs(containerCenter - cardCenter);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = i;
            }
        });

        return closestIndex;
    }

    let scrollTimeout;
    container.addEventListener("scroll", () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const index = getActiveCardIndex();
            dots.forEach(d => d.classList.remove("active"));
            if (dots[index]) dots[index].classList.add("active");
        }, 50);
    });
}

// ===== CAROUSEL =====
function initCarousel(carouselSelector, interval = 3000) {
    const carousel = document.querySelector(carouselSelector);
    if (!carousel) return;

    const images = carousel.querySelectorAll('img.carousel-image');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    let currentIndex = 0;

    const dots = [];
    images.forEach((img, i) => {
        const dot = document.createElement('span');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentIndex = i;
            showImage(currentIndex);
        });
        dotsContainer.appendChild(dot);
        dots.push(dot);
    });

    function showImage(index) {
        images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
            dots[i].classList.toggle('active', i === index);
        });
    }

    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }, interval);

    const btnPrev = carousel.querySelector('.prev');
    const btnNext = carousel.querySelector('.next');

    if (btnPrev) btnPrev.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    });
    if (btnNext) btnNext.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    });
}

// ===== MAP =====
function initMap() {
    const map = L.map('map').setView([41.32832421751286, 19.814152215343267], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([41.32832421751286, 19.814152215343267])
        .addTo(map)
        .bindPopup('Megaelectronic')
        .openPopup();
}
