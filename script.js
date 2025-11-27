// ===========================================
// LOAD DATA + INIT
// ===========================================
async function loadData() {
    try {
        const [phonesResponse, containsResponse] = await Promise.all([
            fetch('phones.json'),
            fetch('contains.json')
        ]);
        const phones = await phonesResponse.json();
        const contains = await containsResponse.json();

        generatePhoneCards(phones);
        generateContent(contains);
        ready(); // atașează evenimente

        // scroll carduri
        scrollPhones('.phonecardscontainer', '.scroll-btn-left', '.scroll-btn-right', 300);

        // init map
        initMap();

        // init carousel
        initCarousel('.right-menu .carousel', 3000);

    } catch (error) {
        console.error(error);
    }
}

window.addEventListener('load', loadData);

// ===========================================
// CAROUSEL
// ===========================================
function initCarousel(carouselSelector, interval = 3000) {
    const carousel = document.querySelector(carouselSelector);
    if (!carousel) return;

    const images = carousel.querySelectorAll('img.carousel-image');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    let currentIndex = 0;

    // creează dot-uri
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

    // autoplay
    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }, interval);

    // butoane prev/next
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


// ===========================================
// CART ICONS
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector(".fa-shopping-cart");
    if (cartIcon) cartIcon.addEventListener('click', () => window.location.href = 'cart.html');

    const heartIcon = document.querySelector(".fa-heart");
    if (heartIcon) heartIcon.addEventListener('click', () => window.location.href = 'favorites.html');

    const userIcon = document.querySelector(".fa-user");
    if (userIcon) userIcon.addEventListener('click', () => window.location.href = 'login.html');
});

// ===========================================
// SHOW ONLY PHONES SECTION
// ===========================================
function showPhonesonly() {
    let allSections = document.querySelectorAll('section');
    let phonesSection = document.querySelector('.phonesection');
    let footerSection = document.querySelector('.footer-section');

    allSections.forEach(section => {
        section.style.display = section === phonesSection ? "block" : "none";
    });
    if (footerSection) footerSection.style.display = "block";
}

// ===========================================
// LEAFLET MAP
// ===========================================
function initMap() {
    var map = L.map('map').setView([41.32832421751286, 19.814152215343267], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([41.32832421751286, 19.814152215343267])
        .addTo(map)
        .bindPopup('Megaelectronic')
        .openPopup();
}

// ===========================================
// CART FUNCTIONS
// ===========================================
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

function addToCartClicked(event) {
    const button = event.target.closest('.buyphone-btn');
    if (!button) return;

    const shopItem = button.closest('.phonecard');
    if (!shopItem) return;

    const title = shopItem.querySelector('.phonename')?.innerText || "Titlu lipsë";
    const price = shopItem.querySelector('.phoneprice')?.innerText || "0";
    const imageSrc = shopItem.querySelector('.phoneimage')?.src || "";

    const product = { title, price, imageSrc, quantity: 1 };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(p => p.title === title);
    if (existing) existing.quantity += 1;
    else cart.push(product);

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${title} u shtua ne koshin!`);

    addItemToCard(title, price, imageSrc);
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

// ===========================================
// GENERATE CONTENT & PHONE CARDS
// ===========================================
function generateContent(contains) {
    const container = document.querySelector(".about-contain");
    const templateContainer = document.querySelector(".main-container");
    templateContainer.style.display = "none";

    contains.forEach(contain => {
        const newContain = templateContainer.cloneNode(true);
        newContain.querySelector(".preview-contain").innerHTML = contain.contain;
        newContain.querySelector(".image-contain").src = contain.image;
        newContain.querySelector(".icon-contain").src = contain.icon;
        newContain.querySelector(".tooltip-text").text = contain.text;
        newContain.style.display = "block";
        container.appendChild(newContain);
    });
}

function generatePhoneCards(phones) {
    const container = document.querySelector('.phonecardscontainer');
    const templateCard = container.querySelector('.phonecard');
    templateCard.style.display = 'none';

    phones.forEach(phone => {
        const newCard = templateCard.cloneNode(true);
        newCard.querySelector('.phoneimage').src = phone.Image;
        newCard.querySelector('.phonename').textContent = phone.name;
        newCard.querySelector('.phoneprice').textContent = `${phone.price}`;
        newCard.querySelector('.phonedescription').textContent = phone.description;
        newCard.style.display = 'block';
        container.appendChild(newCard);

        const addToCartBtn = newCard.querySelector('.buyphone-btn');
        if (addToCartBtn) addToCartBtn.addEventListener('click', addToCartClicked);
    });

    scrollPhones('.phonecardscontainer', '.scroll-btn-left', '.scroll-btn-right', 300);
}

// ===========================================
// SCROLL PHONES
// ===========================================
function scrollPhones(containerSelector, btnLeftSelector, btnRightSelector, scrollAmount = 1000) {
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
