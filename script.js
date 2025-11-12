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

        // atașează evenimente după ce elementele au fost create
        ready();

        scrollPhones('.phonecardscontainer', '.scroll-btn-left', '.scroll-btn-right', 300);
        initMap();

    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', loadData);


document.querySelector(".fa-shopping-cart").addEventListener('click', () => (
    window.location.href = 'cart.html'
));
document.querySelector(".fa-heart").addEventListener('click', () => (
    window.location.href = 'favorites.html'
));
document.querySelector(".fa-user").addEventListener('click', () => (
    window.location.href = 'login.html'
));



function initMap(){
    var map = L.map('map').setView([41.32832421751286, 19.814152215343267], 13); // București

// Adaugă layer-ul OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Adaugă un marker
L.marker([41.32832421751286, 19.814152215343267])
    .addTo(map)
    .bindPopup('Megaelectronic')
    .openPopup();

};


window.onload = loadData;

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready();
}

function ready() {
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
    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)

}

function purchaseClicked() {
    alert('Fleminderit per porosine tuaj');
    var cartItems = document.getElementsByClassName('cart-items')[0];
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal();

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

function addToCartClicked(event) {

    const button = event.target.closest('.buyphone-btn');
    if (!button) return;


    const shopItem = button.closest('.phonecard');
    if (!shopItem) return;


    const title = shopItem.querySelector('.phonename')?.innerText || "Titlu lipsă";
    const price = shopItem.querySelector('.phoneprice')?.innerText || "Preț lipsă";
    const imageSrc = shopItem.querySelector('.phoneimage')?.src || "";


    const product = { title, price, imageSrc, quantity: 1 };
    console.log("PRODUKTI ESHTE", product);

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(p => p.title === title);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${title} u shtua ne koshin tend te blerjeve!`);

    console.log(title, price, imageSrc);
    addItemToCard(title, price, imageSrc);
    updateCartTotal();
}

function addItemToCard(title, price, imageSrc) {
    var cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');

    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartRowContents = `
     <div class="cart-item cart-column">
        <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
        <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">Remove</button>
        </div>`

    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanget);

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

updateCartTotal();
const showProductsList = document.querySelector(".show-products-list");
const hidenList = document.querySelector(".products-list");

showProductsList.addEventListener("click", function () {
    hidenList.style.display = hidenList.style.display === "none" ? "flex" : "none";
})

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

    })
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
    });
}



function scrollPhones(containerSelector, btnLeftSelector, btnRightSelector, scrollAmount = 1000) {
    const container = document.querySelector(".phonecardscontainer");
    const btnLeft = document.querySelector(".scroll-btn-left");
    const btnRight = document.querySelector(".scroll-btn-right");

    if (!container || !btnLeft || !btnRight) {
        console.error('Elementele nu au fost găsite! Verifică selectorii.');
        return;
    }



    const cards = container.querySelectorAll('.phonecard');

    // Funksioni qe face zoom la scroll
    // function scaleCards() {
    //     const containerCenter = container.offsetWidth / 2;

    //     cards.forEach(card => {
    //         const cardRect = card.getBoundingClientRect();
    //         const cardCenter = cardRect.left + cardRect.width / 2 - container.getBoundingClientRect().left;

    //         const distance = Math.abs(containerCenter - cardCenter);
    //         const maxDistance = container.offsetWidth / 2;

    //         // scale intre 0.8 si 1.2
    //         const scale = 1.2 - (distance / maxDistance) * 0.8;
    //         card.style.transform = `scale(${Math.max(scale, 0.6)})`;
    //     });
    // }


    function updateButtons() {
        btnLeft.disabled = container.scrollLeft === 0;
        btnRight.disabled = container.scrollLeft + container.clientWidth >= container.scrollWidth;
        // scaleCards();
    }

    btnLeft.addEventListener('click', () => {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });

        setTimeout(updateButtons, 300);
    });

    btnRight.addEventListener('click', () => {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });

        setTimeout(updateButtons, 300);
    });
    container
        .addEventListener('scroll', updateButtons);

    updateButtons
}
scrollPhones('.phonecardscontainer', '.scroll-btn-left', '.scroll-btn-right', 300);

