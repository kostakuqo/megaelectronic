// ketu fillon kodi per krijimin e phone card duke u nisur nga baza de date e krijuar nga mua
const phones = [
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    }, {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
    {
        name: "Iphone 16 pro max",
        price: "$1200",
        Image: "images/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
        description: "Latest model with all"

    },
]

// ketu eshte kodi i funksionit qe ben te mundur gjenerimin e kartave te telefonave
function generatePhoneCards() {
    const container = document.querySelector('.phonecardscontainer');
    const templateCard = container.querySelector('.phonecard'); // Cardul template

    // Eliminăm cardul template din container pentru a nu-l adăuga de mai multe ori
    templateCard.style.display = 'none';

    phones.forEach(phone => {
        // Creăm un nou card copiat din template
        const newCard = templateCard.cloneNode(true);

        // Setăm datele pentru fiecare telefon
        newCard.querySelector('.phoneimage').src = phone.Image;
        newCard.querySelector('.phonename').textContent = phone.name;
        newCard.querySelector('.phoneprice').textContent = `Price: ${phone.price}`;
        newCard.querySelector('.phonedescription').textContent = phone.description;

        // Facem cardul vizibil
        newCard.style.display = 'block';

        // Adăugăm cardul în container
        container.appendChild(newCard);
    });
}

// 3. Apelăm funcția pentru a genera cardurile la încărcarea paginii
window.onload = function () {
    generatePhoneCards();
};
// ketu mbaron kodi per krijimin e phone card

// ketu  fillon eshte funksioni qe ben te mundur scrolling
function scrollPhones(containerSelector, btnLeftSelector, btnRightSelector, scrollAmount = 1000) {
    const container = document.querySelector(".phonecardscontainer");
    const btnLeft = document.querySelector(".scroll-btn-left");
    const btnRight = document.querySelector(".scroll-btn-right");

    if (!container || !btnLeft || !btnRight) {
        console.error('Elementele nu au fost găsite! Verifică selectorii.');
        return;
    } else
        console.log("parametrat qe kerkove ekzistojne dhe jane me poshte", container, btnLeft, btnRight);


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
        scaleCards();
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

// ketu mbaron funksioni qe ben te mundur scrolling